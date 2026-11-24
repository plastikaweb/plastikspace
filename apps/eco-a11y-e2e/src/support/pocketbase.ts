import type { BrowserContext, Request, Route } from '@playwright/test';
import { RECORDS, TENANT, type PocketBaseRecord } from './records';

/**
 * The PocketBase the production builds talk to.
 * Every request to it is answered here, so no test reaches the hosted instance, and nothing runs
 * on the local one (:8090).
 */
const POCKETBASE = /^https:\/\/eco-botiga\.pockethost\.io\//;

/** Anything that is not the two apps, the loopback or Google Fonts is aborted and reported. */
const OUTSIDE =
  /^https?:\/\/(?!el-llevat\.localhost|localhost|127\.0\.0\.1|fonts\.(googleapis|gstatic)\.com)/;

/** A 1×1 transparent PNG for every file PocketBase would serve (product photos, avatars). */
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

/** What PocketBase answers when nothing matches (its `data` field is left out). */
const NOT_FOUND = { status: 404, message: 'No fixture.' };

/** One line per PocketBase request: `<status> <method> <path>?<query>`. */
export type PocketBaseLog = string[];

/**
 * Answers every PocketBase request of `context` from the records.
 * Sign-in and token refresh return `user`, whatever password is typed.
 * @param { BrowserContext } context - The browser context of the test.
 * @param { PocketBaseRecord } user - Who the sign-in and refresh calls return.
 * @returns { Promise<PocketBaseLog> } The log of the requests, to report what was not covered.
 */
export async function installPocketBase(
  context: BrowserContext,
  user: PocketBaseRecord
): Promise<PocketBaseLog> {
  const log: PocketBaseLog = [];

  // Playwright tries the most recently added route first: this one runs only for what the
  // PocketBase route below does not match.
  await context.route(OUTSIDE, route => {
    log.push(`BLOCKED ${route.request().url().slice(0, 120)}`);

    return route.abort();
  });
  await context.route(POCKETBASE, route => answer(route, user, log));

  return log;
}

/**
 * An unsigned JWT for `user`.
 * The PocketBase SDK only reads `exp` from it and never checks the signature, so the apps take it
 * as a session that lasts until 2099.
 * @param { PocketBaseRecord } user - Who the session is for.
 * @returns { string } The token.
 */
export function authToken(user: PocketBaseRecord): string {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const header = encode({ alg: 'HS256', typ: 'JWT' });
  const payload = encode({
    id: user.id,
    type: 'auth',
    collectionId: user['collectionId'],
    refreshable: true,
    exp: Math.floor(Date.UTC(2099, 0, 1) / 1000),
  });

  return `${header}.${payload}.fixture`;
}

/**
 * Answers one PocketBase request.
 * @param { Route } route - The intercepted request.
 * @param { PocketBaseRecord } user - Who sign-in returns.
 * @param { PocketBaseLog } log - Where the answer is recorded.
 * @returns { Promise<void> } Resolves once the request is answered.
 */
function answer(route: Route, user: PocketBaseRecord, log: PocketBaseLog): Promise<void> {
  const request: Request = route.request();
  const url = new URL(request.url());
  const path = url.pathname;
  const query = url.search ? `?${decodeURIComponent(url.search.slice(1))}` : '';
  const reply = (status: number, body: unknown) => {
    log.push(`${status} ${request.method()} ${path}${query}`);

    return route.fulfill({
      status,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify(body),
    });
  };

  if (path.startsWith('/api/files/')) {
    log.push(`200 GET ${path}`);

    return route.fulfill({ status: 200, contentType: 'image/png', body: PNG });
  }

  if (/^\/api\/collections\/users\/auth-(with-password|refresh)$/.test(path)) {
    return reply(200, { token: authToken(user), record: user });
  }

  const recordPath = path.match(/^\/api\/collections\/([^/]+)\/records(?:\/([^/]+))?$/);

  if (!recordPath) return reply(404, NOT_FOUND);

  const [, collection, id] = recordPath;
  const records = RECORDS[collection] ?? [];

  if (request.method() !== 'GET') {
    // A write (the cart saved after sign-in, say) answers with what was sent, as PocketBase does.
    const sent = parseBody(request);

    return reply(200, {
      id: id ?? `new${collection}`.slice(0, 15),
      collectionName: collection,
      ...sent,
    });
  }

  if (id) {
    const record = records.find(candidate => candidate.id === id);

    return record ? reply(200, record) : reply(404, NOT_FOUND);
  }

  return reply(200, listOf(select(records, url.searchParams.get('filter')), url));
}

/**
 * Keeps the records a list filter asks for.
 * Those whose id or `normalizedName` the filter quotes; a filter that quotes the tenant, the
 * category or a user (a relation), or none of the records, keeps the whole collection.
 * @param { PocketBaseRecord[] } records - The collection.
 * @param { string | null } filter - The `filter` query parameter.
 * @returns { PocketBaseRecord[] } The records to list.
 */
function select(records: PocketBaseRecord[], filter: string | null): PocketBaseRecord[] {
  if (!filter) return records;

  const quoted = [...filter.matchAll(/["']([^"']*)["']/g)].map(match => match[1]);
  const named = records.filter(record =>
    ['id', 'normalizedName'].some(key => quoted.includes(String(record[key])))
  );
  const relations = [
    TENANT.id,
    'catfruita00001',
    'fruita-i-verdura',
    ...RECORDS['users'].map(account => account.id),
  ];

  if (named.length) return named;
  if (quoted.some(value => relations.includes(value))) return records;

  return quoted.length ? [] : records;
}

/**
 * The body of a list answer, one page with every record.
 * @param { PocketBaseRecord[] } records - The records to list.
 * @param { URL } url - The request URL, for `page` and `perPage`.
 * @returns { object } The list as PocketBase returns it.
 */
function listOf(records: PocketBaseRecord[], url: URL): object {
  return {
    page: Number(url.searchParams.get('page') ?? 1),
    perPage: Number(url.searchParams.get('perPage') ?? 30),
    totalItems: records.length,
    totalPages: records.length ? 1 : 0,
    items: records,
  };
}

/**
 * The JSON body of a write.
 * @param { Request } request - The write.
 * @returns { Record<string, unknown> } Its fields; none for a multipart body (an avatar upload).
 */
function parseBody(request: Request): Record<string, unknown> {
  try {
    return request.postDataJSON() ?? {};
  } catch {
    return {};
  }
}
