#!/usr/bin/env node
/**
 * META-20: tests tools/scripts/eco-test-user.cjs against a fake PocketBase (a local HTTP server),
 * so CI needs no PocketBase.
 *
 * - create: the fields of the user it posts, the role option, the superuser credentials kept out
 *   of its output, a tenant that does not exist.
 * - delete: carts and orders first, then the user; a user that is not a test user, an id that is
 *   not one, left untouched.
 * - What stops it: a URL off 127.0.0.1, wrong credentials, a PocketBase that does not answer.
 *
 * Run: yarn eco-test-user:test (CI: the Lint Affected step of .github/workflows/ci.yml).
 */
import { execFile } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const SCRIPT = path.join(ROOT, 'tools/scripts/eco-test-user.cjs');
// Built at run time so no scanner reads them as secrets.
const ADMIN = { identity: `admin${'@'}example.test`, password: 'p'.repeat(12) };
const TOKEN = 't'.repeat(20);
const TENANT_ID = 'tenant000000001';

const failures = [];

/**
 * Records a check.
 * @param {string} name The case name.
 * @param {boolean} passed Whether it passed.
 * @param {string} [detail] What was found instead.
 */
function check(name, passed, detail = '') {
  if (passed) console.log(`✓ ${name}`);
  else failures.push(`${name}${detail ? `: ${detail}` : ''}`);
}

/**
 * The fake PocketBase: records every call and keeps a few rows per collection.
 * @returns {{ calls: string[], rows: Record<string, object[]>, server: http.Server }} Its state.
 */
function fakePocketBase() {
  const calls = [];
  const rows = {
    users: [
      { id: 'user00000000001', email: 'page-check-1@example.test' },
      { id: 'user00000000002', email: `someone${'@'}example.test` },
    ],
    carts: [
      { id: 'cart00000000001', user: 'user00000000001' },
      { id: 'cart00000000002', user: 'user00000000001' },
      { id: 'cart00000000003', user: 'user00000000002' },
    ],
    orders: [{ id: 'order0000000001', user: 'user00000000001' }],
    tenants: [{ id: TENANT_ID, normalizedName: 'el-llevat' }],
  };
  const server = http.createServer((request, response) => {
    let body = '';
    request.on('data', chunk => (body += chunk));
    request.on('end', () => {
      const url = new URL(request.url, 'http://127.0.0.1');
      const send = (status, value) => {
        response.writeHead(status, { 'content-type': 'application/json' });
        response.end(value === undefined ? '' : JSON.stringify(value));
      };
      calls.push(`${request.method} ${url.pathname}`);
      if (url.pathname === '/api/collections/_superusers/auth-with-password') {
        const { identity, password } = JSON.parse(body);

        return identity === ADMIN.identity && password === ADMIN.password
          ? send(200, { token: TOKEN })
          : send(400, { message: 'Failed to authenticate.' });
      }
      if (request.headers.authorization !== TOKEN)
        return send(403, { message: 'Only superusers.' });
      const [, collection, id] =
        url.pathname.match(/^\/api\/collections\/(\w+)\/records(?:\/(\w+))?$/) ?? [];
      const table = rows[collection];
      if (!table) return send(404, { message: 'Missing collection.' });
      if (request.method === 'GET' && !id) {
        const [, field, value] = url.searchParams.get('filter').match(/^(\w+)="([^"]*)"$/);

        return send(200, { items: table.filter(row => row[field] === value) });
      }
      if (request.method === 'POST' && !id) {
        const row = { id: `new${String(table.length).padStart(12, '0')}`, ...JSON.parse(body) };
        table.push(row);

        return send(200, { id: row.id, email: row.email });
      }
      const index = table.findIndex(row => row.id === id);
      if (index < 0) return send(404, { message: 'Not found.' });
      if (request.method === 'GET') return send(200, table[index]);
      if (request.method === 'DELETE') {
        table.splice(index, 1);

        return send(204);
      }

      return send(405, { message: 'No.' });
    });
  });

  return { calls, rows, server };
}

/**
 * Runs the script.
 * @param {string[]} args Its arguments.
 * @param {Record<string, string>} env Extra environment.
 * @returns {Promise<{ status: number, stdout: string, stderr: string }>} What it did.
 */
function run(args, env) {
  return new Promise(resolve => {
    execFile(
      process.execPath,
      [SCRIPT, ...args],
      { env: { ...process.env, ...env } },
      (error, stdout, stderr) => resolve({ status: error ? error.code : 0, stdout, stderr })
    );
  });
}

const fake = fakePocketBase();
await new Promise(resolve => fake.server.listen(0, '127.0.0.1', resolve));
const ENV = {
  ECO_TEST_USER_PB_URL: `http://127.0.0.1:${fake.server.address().port}`,
  POCKETBASE_DEV_ADMIN_EMAIL: ADMIN.identity,
  POCKETBASE_DEV_ADMIN_PASSWORD: ADMIN.password,
};
try {
  const created = await run(['create'], ENV);
  let printed = {};
  try {
    printed = JSON.parse(created.stdout);
  } catch {
    printed = {};
  }
  const posted = fake.rows.users.at(-1);
  check(
    'create: a verified, ACTIVE PARTNER of el-llevat, its password confirmed, printed back',
    created.status === 0 &&
      /^page-check-\d+@example\.test$/.test(posted.email) &&
      posted.normalizedName === posted.email.split('@')[0] &&
      posted.tenant === TENANT_ID &&
      posted.role === 'PARTNER' &&
      posted.verified === true &&
      posted.membershipStatus === 'ACTIVE' &&
      posted.passwordConfirm === posted.password &&
      posted.password.length >= 12 &&
      printed.id === posted.id &&
      printed.email === posted.email &&
      printed.password === posted.password,
    `${created.status} ${created.stderr} ${JSON.stringify(posted)}`
  );
  check(
    'create: the superuser credentials appear in no output',
    !`${created.stdout}${created.stderr}`.includes(ADMIN.password) &&
      !`${created.stdout}${created.stderr}`.includes(ADMIN.identity)
  );
  const admin = await run(['create', '--role', 'TENANT_ADMIN'], ENV);
  check(
    'create --role TENANT_ADMIN: the role is posted',
    admin.status === 0 && fake.rows.users.at(-1).role === 'TENANT_ADMIN',
    admin.stderr
  );
  const badRole = await run(['create', '--role', 'OWNER'], ENV);
  const noTenant = await run(['create', '--tenant', 'nowhere'], ENV);
  check(
    'create: an unknown role exits 2; an unknown tenant exits 1 and posts no user',
    badRole.status === 2 &&
      noTenant.status === 1 &&
      /no tenant with normalizedName "nowhere"/.test(noTenant.stderr) &&
      fake.rows.users.length === 4,
    `${badRole.status} ${noTenant.status} ${noTenant.stderr}`
  );

  fake.calls.length = 0;
  const removed = await run(['delete', 'user00000000001'], ENV);
  const deletes = fake.calls.filter(call => call.startsWith('DELETE'));
  check(
    'delete: the carts and the order first, then the user; the other user keeps its cart',
    removed.status === 0 &&
      JSON.stringify(deletes) ===
        JSON.stringify([
          'DELETE /api/collections/carts/records/cart00000000001',
          'DELETE /api/collections/carts/records/cart00000000002',
          'DELETE /api/collections/orders/records/order0000000001',
          'DELETE /api/collections/users/records/user00000000001',
        ]) &&
      fake.rows.carts.length === 1 &&
      JSON.parse(removed.stdout).carts === 2,
    `${removed.status} ${removed.stderr} ${deletes.join(', ')}`
  );
  fake.calls.length = 0;
  const real = await run(['delete', 'user00000000002'], ENV);
  const bad = await run(['delete', 'not-an-id'], ENV);
  check(
    'delete: refuses a user that is not a test user, and a malformed id, deleting nothing',
    real.status === 2 &&
      /not a test user/.test(real.stderr) &&
      bad.status === 2 &&
      !fake.calls.some(call => call.startsWith('DELETE')),
    `${real.status} ${real.stderr} ${bad.status}`
  );

  const remote = await run(['create'], {
    ...ENV,
    ECO_TEST_USER_PB_URL: 'http://pb.example.test:8090',
  });
  const wrong = await run(['create'], { ...ENV, POCKETBASE_DEV_ADMIN_PASSWORD: 'q'.repeat(12) });
  check(
    'a PocketBase off 127.0.0.1 exits 2; wrong credentials exit 1',
    remote.status === 2 &&
      /only a PocketBase on http:\/\/127\.0\.0\.1/.test(remote.stderr) &&
      wrong.status === 1,
    `${remote.status} ${remote.stderr} ${wrong.status} ${wrong.stderr}`
  );
} finally {
  await new Promise(resolve => fake.server.close(resolve));
}
const down = await run(['create'], ENV);
check(
  'a PocketBase that does not answer exits 1 and says so',
  down.status === 1 && /does not answer/.test(down.stderr),
  `${down.status} ${down.stderr}`
);

if (failures.length > 0) {
  console.error(`\n✗ eco-test-user tests: ${failures.length} failed\n- ${failures.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log('\n✓ eco-test-user tests passed');
}
