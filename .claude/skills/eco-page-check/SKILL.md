---
name: eco-page-check
description: Reproduce what fails on an eco-store or eco-admin page in a headless Chrome. Find the page in the feature map, serve the app, sign in as a throwaway PocketBase user, open the page and read what rendered (page, console errors, network calls, a screenshot you look at). Use it when told that an eco page fails or looks wrong, and before calling an eco UI change done. Drives the project's `playwright` MCP server. Asks the user before it touches the local PocketBase.
---

# Eco page check

Reproduce a failure on an eco page in a real browser, then read it. The `playwright` server in `.mcp.json` drives a headless Chrome with a profile kept in memory: every session starts signed out, and nothing touches the user's own Chrome. Its tools are named `mcp__playwright__browser_*`. This file names them without the prefix. If they are missing, the session started before the server was in `.mcp.json`: ask the user to restart it.

## 1. Find the page

`yarn feature-map:find <words>` prints, as JSON, every page whose app, path, title key, component, project or file contains all the words. It reads the routes as they are now. Paths are in Catalan (`perfil/avatar`, `cistella/enviament`, `comandes`), so try the Catalan word, the component name, or the app name. Without a match, it lists every page.

From the entry, read:

- `url`: what to open. It is `devUrl` plus the path. Replace each `:param` with a real value, such as a product slug from `/botiga` or an order id from `/comandes`.
- `access`: `public`, `anonymous` (only without a session; signed in, the guard sends you away) or `signed-in`. With `signed-in`, `roles` lists the roles that may enter.
- `needs`: what else the page asks for, such as a cart with products. Each entry says where you land without it.
- `component`, `file`, `specs`, `project`: the code. `yarn nx test <project>` runs its specs.
- `serve`: the command that serves the app.

The whole map is in `tools/feature-map.json` (redirects included). It is generated, and CI fails when it is stale: never edit it by hand.

## 2. Ask the user before PocketBase

Both apps read the local PocketBase at `http://127.0.0.1:8090` (`environment.development.ts`). Ask the user once, before any of the following: starting PocketBase, creating the test user, deleting it afterwards, and stopping PocketBase if you started it. Say which page you are checking. Without an answer, stop there. Never stop a PocketBase you did not start, and never use `yarn eco-store:pocketbase:stop` or `yarn eco-store:local`: both stop any PocketBase that is running.

Once the user agrees:

1. See whether PocketBase runs: `lsof -nP -iTCP:8090 -sTCP:LISTEN`.
2. If not, start it from the main checkout: its binary and `pb_data` are gitignored, so a worktree has neither. The main checkout is the parent of `git rev-parse --path-format=absolute --git-common-dir`. Run `./pocketbase serve` in its `apps/eco-store/pocketbase` folder, in the background, outside the Bash sandbox. It is ready when the log prints `Server started`. Note the PID from `lsof`, so you can stop that process and no other.

## 3. Serve this checkout

1. See whether the port of `url` is taken: `lsof -nP -iTCP:<port> -sTCP:LISTEN`. If it is, find whose server it is with `lsof -a -p <PID> -d cwd -Fn`: the line starting with `n` is its folder. A server started from another checkout, worktree or project serves that code, not yours. Never stop it.
2. If the port is free, run `serve` from the entry in the background. If another server holds the port, serve on a free one instead: `yarn nx run eco-store:serve --port 4201`, or `eco-admin:serve`, and use that port in every URL. Both serve targets accept any host name.
3. In a worktree, prefix the command with `env -u NX_WORKSPACE_ROOT_PATH`: that variable points Nx at the main checkout. Binding a port needs the Bash sandbox off.
4. The app is ready when `curl -s -o /dev/null -w '%{http_code}' <url>` prints `200`. The first build takes about a minute. A build that fails shows Angular's error overlay: fix the build first.

eco-store resolves its tenant from the host name: `el-llevat.test` is the El Llevat cooperative, so keep that host. `/etc/hosts` maps it to this machine. Never use `el-llevat.localhost`: server-side rendering answers it with a 500. eco-admin answers on `localhost`.

## 4. Create the test user

Only for a page with `access: signed-in`. Run `node tools/scripts/eco-test-user.cjs create` outside the Bash sandbox, which blocks port 8090. It prints the `id`, `email` and `password` of a new user of El Llevat: verified, `ACTIVE`, role `PARTNER`. For eco-admin, add `--role` with one of the page's `roles` (`TENANT_ADMIN` for a cooperative's panel).

The script signs in as the local superuser from `apps/eco-store/.env` and never prints those credentials. Do not read them, and never write the test user's password into a file the repo tracks. Keep the `id` for step 7.

## 5. Sign in and open the page

1. `browser_navigate` to the app's `/accedir`, then `browser_snapshot`.
2. `browser_fill_form` with the email and password fields of the snapshot, then `browser_click` the sign-in button. Wait until the URL leaves `/accedir`: `browser_wait_for`, then a snapshot.
3. Meet `needs` through the UI as a user would. A cart with products: open `/botiga` and add one product with its add button. Some needs depend on the tenant, not the user: whether it ships, whether the store is open, whether fiscal data is on. When one is not met, say so and ask the user before changing the tenant.
4. `browser_navigate` to `url`.

An `anonymous` page wants no session: skip step 2. A `public` page opens either way.

## 6. Read what rendered

- `browser_snapshot` returns the accessibility tree: text, headings, buttons. Use it to judge what is missing and to find click targets.
- An error that Angular catches is not in the console. Both apps replace Angular's `ErrorHandler` with `ErrorHandlerService` (`@plastik/shared/notification/data-access`), which shows the message in an error notification closed with «tancar». Look for it in the snapshot. A page that hangs, for example on the loading screen «Collint les dades més fresques…», with a clean console and no notification, usually has a `computed` or a template expression that throws. Call the component's signals with `browser_evaluate` (below) to find which one.
- `browser_console_messages` lists the console: errors outside Angular, failed loads, warnings.
- `browser_network_requests` lists the calls. A PocketBase call with a 4xx or 5xx shows the data the page could not read. `browser_network_request`, with its number, shows one call.
- `browser_take_screenshot` shows layout and colour. Open the image and look at it. Files land in `.playwright-mcp/`, which git ignores.
- `browser_evaluate` reads Angular state, because `serve` is a development build: `() => ng.getComponent(document.querySelector('<selector>'))` returns the component of an element.

Then open `file` and the specs of the entry, and compare what rendered with what the code means to render.

## 7. Clean up

1. `browser_close`.
2. `node tools/scripts/eco-test-user.cjs delete <id>` deletes the user's carts and orders, which would block the delete, and then the user. Its addresses and fiscal profiles go with it. The script refuses any user whose email does not start with `page-check-`.
3. Stop the dev server you started, by its PID.
4. Stop PocketBase only if you started it, by the PID you noted.
5. Tell the user what you stopped, and that the test user is gone.

## Limits

- Only the local apps and the local PocketBase. Never point the browser at staging or production, and never sign in as a real user.
- Never use `browser_run_code_unsafe`: it runs code in the server process, outside the browser.
- The test user is new: no orders, no addresses. A page that lists them shows its empty state until you create some through the UI.

Report the page, the URL, the user's role, what you did to meet `needs`, what failed (console lines, failed calls, what the snapshot or the screenshot shows), and what you could not check.
