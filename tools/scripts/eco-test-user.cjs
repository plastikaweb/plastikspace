#!/usr/bin/env node
/**
 * META-20 — a throwaway user in the local PocketBase, for the eco-page-check skill.
 *
 *   node tools/scripts/eco-test-user.cjs create [--role PARTNER|TENANT_ADMIN|GLOBAL_ADMIN] [--tenant el-llevat]
 *       prints { id, email, password, role, tenant } as JSON: a verified, ACTIVE user of the tenant
 *   node tools/scripts/eco-test-user.cjs delete <user id>
 *       deletes its carts and orders (they keep a user from being deleted), then the user
 *
 * It signs in as the local superuser with POCKETBASE_DEV_ADMIN_EMAIL and
 * POCKETBASE_DEV_ADMIN_PASSWORD, from the environment or else from apps/eco-store/.env (this
 * checkout's, or the main checkout's from a worktree), and never prints them. It talks only to http://127.0.0.1:8090
 * (ECO_TEST_USER_PB_URL may name another port on 127.0.0.1, for the tests), and deletes only
 * users whose email starts with `page-check-`.
 *
 * Exit codes: 0 done; 1 PocketBase refused or failed; 2 usage or configuration error.
 */

const crypto = require('crypto');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PREFIX = 'page-check-';
const ROLES = ['PARTNER', 'TENANT_ADMIN', 'GLOBAL_ADMIN'];
const ENV_FILE = 'apps/eco-store/.env';

class UsageError extends Error {}

/**
 * Reads the superuser credentials: from the environment, or from the eco-store .env here or in
 * the main checkout.
 * @returns {{ identity: string, password: string }} The credentials.
 */
function credentials() {
  const fromEnv = {
    identity: process.env.POCKETBASE_DEV_ADMIN_EMAIL,
    password: process.env.POCKETBASE_DEV_ADMIN_PASSWORD,
  };
  if (fromEnv.identity && fromEnv.password) return fromEnv;
  const roots = [path.resolve(__dirname, '..', '..')];
  try {
    const common = execFileSync(
      'git',
      ['rev-parse', '--path-format=absolute', '--git-common-dir'],
      {
        cwd: roots[0],
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }
    ).trim();
    roots.push(path.dirname(common));
  } catch {
    // Not a git checkout: this folder only.
  }
  const file = roots
    .map(root => path.join(root, ENV_FILE))
    .find(candidate => fs.existsSync(candidate));
  if (!file) throw new UsageError(`${ENV_FILE} not found in this checkout or the main one`);
  const env = Object.fromEntries(
    fs
      .readFileSync(file, 'utf8')
      .split('\n')
      .map(line => line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/))
      .filter(Boolean)
      .map(([, key, value]) => [key, value.replace(/^(['"])(.*)\1$/, '$2')])
  );
  const identity = env.POCKETBASE_DEV_ADMIN_EMAIL;
  const password = env.POCKETBASE_DEV_ADMIN_PASSWORD;
  if (!identity || !password)
    throw new UsageError(
      `${ENV_FILE} has no POCKETBASE_DEV_ADMIN_EMAIL or POCKETBASE_DEV_ADMIN_PASSWORD`
    );

  return { identity, password };
}

/**
 * The PocketBase base URL: the local one, or another port on 127.0.0.1 for the tests.
 * @returns {string} The URL, without a trailing slash.
 */
function baseUrl() {
  const url = process.env.ECO_TEST_USER_PB_URL ?? 'http://127.0.0.1:8090';
  if (!/^http:\/\/127\.0\.0\.1:\d+$/.test(url))
    throw new UsageError(`only a PocketBase on http://127.0.0.1 is allowed; got ${url}`);

  return url;
}

/**
 * Calls PocketBase.
 * @param {string} base The base URL.
 * @param {string | null} token The superuser token.
 * @param {string} method The HTTP method.
 * @param {string} route The API path.
 * @param {object} [body] The JSON body.
 * @returns {Promise<any>} The JSON answer, or null for an empty one.
 */
async function call(base, token, method, route, body) {
  let response;
  try {
    response = await fetch(`${base}${route}`, {
      method,
      headers: {
        'content-type': 'application/json',
        ...(token ? { authorization: token } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    throw new Error(
      `PocketBase at ${base} does not answer (${error.cause?.code ?? error.message})`
    );
  }
  const text = await response.text();
  if (!response.ok) throw new Error(`${method} ${route.split('?')[0]}: ${response.status} ${text}`);

  return text ? JSON.parse(text) : null;
}

/**
 * Signs in as the local superuser.
 * @param {string} base The base URL.
 * @returns {Promise<string>} The token.
 */
async function signIn(base) {
  const answer = await call(
    base,
    null,
    'POST',
    '/api/collections/_superusers/auth-with-password',
    credentials()
  );

  return answer.token;
}

/**
 * Lists the ids of the records of a collection that match a filter.
 * @param {string} base The base URL.
 * @param {string} token The superuser token.
 * @param {string} collection The collection.
 * @param {string} filter The filter.
 * @returns {Promise<string[]>} The ids.
 */
async function ids(base, token, collection, filter) {
  const query = new URLSearchParams({ filter, fields: 'id', perPage: '500' });
  const answer = await call(base, token, 'GET', `/api/collections/${collection}/records?${query}`);

  return answer.items.map(record => record.id);
}

/**
 * Creates the user.
 * @param {{ role: string, tenant: string }} options The role and the tenant's normalizedName.
 * @returns {Promise<object>} What the skill needs to sign in and to delete it.
 */
async function create({ role, tenant }) {
  const base = baseUrl();
  const token = await signIn(base);
  const [tenantId] = await ids(base, token, 'tenants', `normalizedName="${tenant}"`);
  if (!tenantId) throw new Error(`no tenant with normalizedName "${tenant}"`);
  const stamp = `${Date.now()}`;
  const password = crypto.randomBytes(12).toString('base64url');
  const user = await call(base, token, 'POST', '/api/collections/users/records', {
    email: `${PREFIX}${stamp}@example.test`,
    password,
    passwordConfirm: password,
    name: 'Page Check',
    normalizedName: `${PREFIX}${stamp}`,
    tenant: tenantId,
    role,
    verified: true,
    membershipStatus: 'ACTIVE',
    language: 'ca',
  });

  return { id: user.id, email: user.email, password, role, tenant };
}

/**
 * Deletes the user, its carts and its orders.
 * @param {string} id The user id.
 * @returns {Promise<object>} What it deleted.
 */
async function remove(id) {
  if (!/^[a-z0-9]{15}$/.test(id)) throw new UsageError(`not a PocketBase record id: ${id}`);
  const base = baseUrl();
  const token = await signIn(base);
  const user = await call(
    base,
    token,
    'GET',
    `/api/collections/users/records/${id}?fields=id,email`
  );
  if (!user.email?.startsWith(PREFIX))
    throw new UsageError(`${id} is not a test user (${PREFIX}...): nothing deleted`);
  const deleted = { carts: 0, orders: 0 };
  for (const collection of ['carts', 'orders']) {
    for (const record of await ids(base, token, collection, `user="${id}"`)) {
      await call(base, token, 'DELETE', `/api/collections/${collection}/records/${record}`);
      deleted[collection]++;
    }
  }
  await call(base, token, 'DELETE', `/api/collections/users/records/${id}`);

  return { user: user.email, ...deleted };
}

/**
 * Parses the command line and runs it.
 * @param {string[]} argv Arguments after the script name.
 * @returns {Promise<number>} The exit code.
 */
async function main(argv) {
  try {
    const [command, ...rest] = argv;
    let result;
    if (command === 'create') {
      const options = { role: 'PARTNER', tenant: 'el-llevat' };
      for (let i = 0; i < rest.length; i++) {
        const flag = rest[i];
        const value = rest[++i];
        if ((flag !== '--role' && flag !== '--tenant') || value === undefined)
          throw new UsageError(`unknown or empty option: ${flag}`);
        options[flag.slice(2)] = value;
      }
      if (!ROLES.includes(options.role))
        throw new UsageError(`--role must be one of ${ROLES.join(', ')}`);
      result = await create(options);
    } else if (command === 'delete' && rest.length === 1) result = await remove(rest[0]);
    else
      throw new UsageError(
        'usage: eco-test-user.cjs create [--role R] [--tenant T] | delete <user id>'
      );
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

    return 0;
  } catch (error) {
    process.stderr.write(`eco-test-user: ${error.message}\n`);

    return error instanceof UsageError ? 2 : 1;
  }
}

if (require.main === module) main(process.argv.slice(2)).then(code => (process.exitCode = code));

module.exports = { main };
