#!/usr/bin/env node
/**
 * META-12 — pull-request guard for apps/eco-store/pocketbase/pb_schema.json.
 *
 * Every worktree exports the same local PocketBase (:8090) into pb_schema.json, so a
 * branch can carry schema edits that were made for another branch. On merge to
 * develop, .github/workflows/pocketbase-schema.yml applies the file to staging
 * (apps/eco-store/scripts/sync-pocketbase-schema.js). It only creates and updates:
 *   - a collection is found on staging by id (a rename) or else by name; one found
 *     neither way is created, and a collection missing from the file is never deleted;
 *   - a found collection gets the file's field list, matched by field id, so a field
 *     whose id is missing from the file is dropped there, data included.
 *
 * Compares two versions of the schema (in CI: develop now, and develop after the
 * merge), pairing collections the way the sync does, and:
 *   - prints a per-collection summary: added, removed, renamed, fields, rules, indexes;
 *   - fails with `schema-only-change` when the schema changes but no other eco file
 *     does (the likely sign of edits that belong to another branch);
 *   - fails with `schema-removal` when a collection, or a field of a kept collection,
 *     disappears.
 * The `pb-schema` label acknowledges both: they are still listed, as notices. With
 * --label-stale (the workflow passes it when the push being checked changed the schema)
 * the label no longer counts until it is added again.
 *
 * A collection whose id changes under the same name is updated in place by the sync, so
 * it is not a removal. A relation is compared by the name of the collection it points
 * to, since the sync remaps that id by name. The fields of a view are matched by name:
 * PocketBase derives them from the view's query and gives them random `_clone_` ids
 * that change each time the view is saved. A view stores no data, so a view field that
 * disappears is listed but is not a removal.
 *
 * Usage:
 *   node tools/scripts/check-pb-schema-change.cjs --base <json> --head <json>
 *     [--changed <file with one changed path per line>] [--labels <comma list>]
 *     [--label-stale] [--summary <markdown file to append to, e.g. $GITHUB_STEP_SUMMARY>]
 *   node tools/scripts/check-pb-schema-change.cjs --compare-only --base <json> --head <json>
 *     exits 0 when the two describe the same schema, 1 when they do not.
 * With GITHUB_ACTIONS=true, each problem is also printed as an annotation: an error,
 * or a warning once acknowledged.
 *
 * Exit codes: 0 no change, clean or acknowledged; 1 a rule failed (or, with
 * --compare-only, the schemas differ); 2 usage or IO error; 99 unexpected error.
 */

const fs = require('fs');

const SCHEMA_PATH = 'apps/eco-store/pocketbase/pb_schema.json';
const ECO_PATH = /^(apps\/eco-(store|admin)(-e2e)?|libs\/eco(-store|-admin)?)\//;
const ACK_LABEL = 'pb-schema';
const RULE_KEYS = [
  'listRule',
  'viewRule',
  'createRule',
  'updateRule',
  'deleteRule',
  'manageRule',
  'authRule',
];
const KNOWN_KEYS = new Set(['id', 'name', 'fields', 'indexes', ...RULE_KEYS]);

class UsageError extends Error {}

function parseArgs(argv) {
  const args = { labels: [], labelStale: false, compareOnly: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const value = () => {
      const next = argv[++i];
      if (next === undefined || next.startsWith('--')) throw new UsageError(`${arg} needs a value`);

      return next;
    };
    if (arg === '--help' || arg === '-h') args.help = true;
    else if (arg === '--base') args.base = value();
    else if (arg === '--head') args.head = value();
    else if (arg === '--changed') args.changed = value();
    else if (arg === '--labels')
      args.labels = value()
        .split(',')
        .map(label => label.trim())
        .filter(Boolean);
    else if (arg === '--label-stale') args.labelStale = true;
    else if (arg === '--compare-only') args.compareOnly = true;
    else if (arg === '--summary') args.summary = value();
    else throw new UsageError(`unknown argument ${arg}`);
  }
  if (!args.help && (!args.base || !args.head))
    throw new UsageError('--base and --head are required');

  return args;
}

function readJson(file) {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    throw new UsageError(`${file}: ${err.message}`);
  }
  if (!Array.isArray(parsed)) throw new UsageError(`${file}: expected an array of collections`);

  return parsed;
}

const keyOf = entry => entry.id ?? entry.name;
const nameOf = entry => entry.name;
const same = (left, right) => JSON.stringify(left ?? null) === JSON.stringify(right ?? null);

function indexBy(list, key = keyOf) {
  const map = new Map();
  for (const entry of list ?? []) map.set(key(entry), entry);

  return map;
}

/**
 * Pairs the collections of two schemas the way the staging sync finds them: by id
 * first (a rename keeps the id), then the remaining ones by name.
 * @param {object[]} base Collections before.
 * @param {object[]} head Collections after.
 * @returns {{pairs: [object, object][], removed: object[], added: object[]}} Pairing.
 */
function pairCollections(base, head) {
  const baseById = indexBy(base);
  const pairs = [];
  const pairedBase = new Set();
  const unpairedHead = [];
  for (const collection of head ?? []) {
    const old = baseById.get(keyOf(collection));
    if (old && !pairedBase.has(old)) {
      pairs.push([old, collection]);
      pairedBase.add(old);
    } else unpairedHead.push(collection);
  }
  const leftByName = new Map(
    (base ?? []).filter(old => !pairedBase.has(old)).map(old => [old.name, old])
  );
  const added = [];
  for (const collection of unpairedHead) {
    const old = leftByName.get(collection.name);
    if (old) {
      pairs.push([old, collection]);
      pairedBase.add(old);
      leftByName.delete(collection.name);
    } else added.push(collection);
  }

  return { pairs, removed: (base ?? []).filter(old => !pairedBase.has(old)), added };
}

/**
 * Lists the differences between two schema exports, one row per touched collection.
 * @param {object[]} base Collections before.
 * @param {object[]} head Collections after.
 * @returns {{collection: string, change: string, detail: string, removal: boolean}[]} Rows.
 */
function compare(base, head) {
  const { pairs, removed, added } = pairCollections(base, head);
  const rows = [];
  // A relation points to a collection id, which the sync remaps by name: two relations
  // point to the same collection when the ids are equal or both resolve to one name.
  const baseNames = new Map((base ?? []).map(collection => [collection.id, collection.name]));
  const headNames = new Map((head ?? []).map(collection => [collection.id, collection.name]));
  const sameTarget = (oldId, newId) =>
    oldId === newId || (baseNames.has(oldId) && baseNames.get(oldId) === headNames.get(newId));
  const withoutIds = (field, isView) => {
    const copy = { ...field };
    delete copy.collectionId;
    if (isView) delete copy.id;

    return copy;
  };
  const sameField = (oldField, newField, isView) =>
    same(withoutIds(oldField, isView), withoutIds(newField, isView)) &&
    sameTarget(oldField.collectionId, newField.collectionId);

  for (const collection of removed) {
    rows.push({
      collection: collection.name,
      change: 'removed',
      detail: `collection removed (${(collection.fields ?? []).length} fields); staging keeps it`,
      removal: true,
    });
  }
  for (const collection of added) {
    rows.push({
      collection: collection.name,
      change: 'added',
      detail: `${(collection.fields ?? []).length} fields`,
      removal: false,
    });
  }

  for (const [old, collection] of pairs) {
    const details = [];
    if (old.name !== collection.name) details.push(`renamed from ${old.name}`);
    else if (old.id !== collection.id)
      details.push(`id changed from ${old.id} (the sync finds it by name and keeps its id)`);

    // View fields: matched by name and compared without their random `_clone_` ids.
    const isView = old.type === 'view' || collection.type === 'view';
    const fieldKey = isView ? nameOf : keyOf;
    const oldFields = indexBy(old.fields, fieldKey);
    const newFields = indexBy(collection.fields, fieldKey);
    const lost = [...oldFields.entries()]
      .filter(([fieldKey]) => !newFields.has(fieldKey))
      .map(([, field]) => field.name);
    const gained = [...newFields.entries()]
      .filter(([fieldKey]) => !oldFields.has(fieldKey))
      .map(([, field]) => field.name);
    const changed = [...newFields.entries()]
      .filter(
        ([fieldKey, field]) =>
          oldFields.has(fieldKey) && !sameField(oldFields.get(fieldKey), field, isView)
      )
      .map(([fieldKey, field]) => {
        const previous = oldFields.get(fieldKey).name;

        return previous === field.name ? field.name : `${previous} → ${field.name}`;
      });
    const kind = isView ? 'view fields' : 'fields';
    if (lost.length > 0) details.push(`${kind} removed: ${lost.join(', ')}`);
    if (gained.length > 0) details.push(`${kind} added: ${gained.join(', ')}`);
    if (changed.length > 0) details.push(`${kind} changed: ${changed.join(', ')}`);

    const rules = RULE_KEYS.filter(rule => !same(old[rule], collection[rule]));
    if (rules.length > 0) details.push(`rules changed: ${rules.join(', ')}`);
    if (!same(old.indexes ?? [], collection.indexes ?? [])) details.push('indexes changed');
    const others = [...new Set([...Object.keys(old), ...Object.keys(collection)])].filter(
      property => !KNOWN_KEYS.has(property) && !same(old[property], collection[property])
    );
    if (others.length > 0) details.push(`other settings changed: ${others.join(', ')}`);

    if (details.length > 0) {
      const removal = lost.length > 0 && !isView;
      rows.push({
        collection: collection.name,
        change: removal ? 'fields removed' : 'changed',
        detail: details.join('; '),
        removal,
      });
    }
  }

  return rows;
}

function readChanged(file) {
  try {
    return fs
      .readFileSync(file, 'utf8')
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);
  } catch (err) {
    throw new UsageError(`${file}: ${err.message}`);
  }
}

const cell = text => String(text).replace(/\|/g, '\\|');

// GitHub workflow commands: https://docs.github.com/actions/reference/workflow-commands-for-github-actions
const escapeData = text =>
  String(text).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
const escapeProperty = text => escapeData(text).replace(/:/g, '%3A').replace(/,/g, '%2C');

function annotate(level, title, message) {
  if (process.env.GITHUB_ACTIONS !== 'true') return;
  console.log(
    `::${level} file=${escapeProperty(SCHEMA_PATH)},title=${escapeProperty(title)}::${escapeData(message)}`
  );
}

function printHelp() {
  console.log(`Usage: node tools/scripts/check-pb-schema-change.cjs --base <json> --head <json>
  [--changed <file>] [--labels <a,b>] [--label-stale] [--summary <md file>]
  node tools/scripts/check-pb-schema-change.cjs --compare-only --base <json> --head <json>

Fails when pb_schema.json changes without any other eco file (schema-only-change) or
loses a collection or a field (schema-removal), unless the labels include "${ACK_LABEL}".
--label-stale: the label was added before the schema last changed, so it does not count.
--compare-only: exit 0 when both files describe the same schema, 1 when they do not.`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();

    return 0;
  }
  const rows = compare(readJson(args.base), readJson(args.head));
  if (args.compareOnly) {
    console.log(
      rows.length === 0
        ? 'same schema'
        : `schema changed: ${rows.map(row => row.collection).join(', ')}`
    );

    return rows.length === 0 ? 0 : 1;
  }
  const write = text => {
    console.log(text);
    if (args.summary) fs.appendFileSync(args.summary, `${text}\n`);
  };

  if (rows.length === 0) {
    write('✓ pb_schema.json: no schema change.');

    return 0;
  }

  const problems = [];
  if (args.changed) {
    const otherEco = readChanged(args.changed).filter(
      file => file !== SCHEMA_PATH && ECO_PATH.test(file)
    );
    if (otherEco.length === 0) {
      problems.push(
        'schema-only-change: pb_schema.json changes but no other eco file does. The schema may come from edits another branch made to the shared local PocketBase.'
      );
    }
  }
  const lostFields = rows.filter(row => row.removal && row.change === 'fields removed');
  if (lostFields.length > 0) {
    problems.push(
      `schema-removal: ${lostFields.map(row => row.collection).join(', ')} lose fields. The staging sync drops a field the file no longer has, data included.`
    );
  }
  const lostCollections = rows.filter(row => row.removal && row.change === 'removed');
  if (lostCollections.length > 0) {
    problems.push(
      `schema-removal: ${lostCollections.map(row => row.collection).join(', ')} removed. The staging sync never deletes a collection: it stays on staging with its data, and pb_schema.json no longer describes it.`
    );
  }

  const labelled = args.labels.includes(ACK_LABEL);
  const acknowledged = labelled && !args.labelStale;
  write('### pb_schema.json changes\n');
  write('| Collection | Change | Detail |');
  write('| --- | --- | --- |');
  for (const row of rows)
    write(`| ${cell(row.collection)} | ${cell(row.change)} | ${cell(row.detail)} |`);
  write('');

  if (problems.length === 0) {
    write('✓ No removals, and other eco files change with the schema.');

    return 0;
  }
  for (const problem of problems) {
    write(`${acknowledged ? 'ℹ' : '✖'} ${problem}`);
    const [rule] = problem.split(':');
    annotate(
      acknowledged ? 'warning' : 'error',
      acknowledged ? `${rule} (acknowledged)` : rule,
      problem
    );
  }
  if (acknowledged) {
    write(`\nAcknowledged by the "${ACK_LABEL}" label.`);

    return 0;
  }
  if (labelled) {
    write(
      `\nThe "${ACK_LABEL}" label was on the pull request before this push changed pb_schema.json, so it no longer counts. Review the table, then add the label again; the check runs again.`
    );

    return 1;
  }
  write(
    `\nIf this schema change is intended, add the "${ACK_LABEL}" label to the pull request; the check runs again.`
  );

  return 1;
}

try {
  process.exitCode = main();
} catch (err) {
  if (err instanceof UsageError) {
    console.error(`check-pb-schema-change: ${err.message}`);
    process.exitCode = 2;
  } else {
    console.error(err);
    process.exitCode = 99;
  }
}
