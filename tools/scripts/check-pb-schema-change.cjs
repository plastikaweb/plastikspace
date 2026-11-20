#!/usr/bin/env node
/**
 * META-12 — pull-request guard for apps/eco-store/pocketbase/pb_schema.json.
 *
 * Every worktree exports the same local PocketBase (:8090) into pb_schema.json, so a
 * branch can carry schema edits that were made for another branch. On merge to
 * develop, .github/workflows/pocketbase-schema.yml applies the file to staging: it
 * creates missing collections and updates existing ones with the file's field list,
 * so a field missing from the file is dropped there, data included.
 *
 * Compares two versions of the schema (in CI: develop now, and develop after the
 * merge) and:
 *   - prints a per-collection summary: added, removed, renamed, fields, rules, indexes;
 *   - fails with `schema-only-change` when the schema changes but no other eco file
 *     does (the likely sign of edits that belong to another branch);
 *   - fails with `schema-removal` when a collection, or a field of a kept collection,
 *     disappears.
 * The `pb-schema` label acknowledges both: they are still listed, as notices.
 * Collections and fields are matched by id, so a rename is not a removal.
 *
 * Usage:
 *   node tools/scripts/check-pb-schema-change.cjs --base <json> --head <json>
 *     [--changed <file with one changed path per line>] [--labels <comma list>]
 *     [--summary <markdown file to append to, e.g. $GITHUB_STEP_SUMMARY>]
 *
 * Exit codes: 0 no change, clean or acknowledged; 1 a rule failed; 2 usage or IO
 * error; 99 unexpected error.
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
  const args = { labels: [] };
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
const same = (left, right) => JSON.stringify(left ?? null) === JSON.stringify(right ?? null);

function indexBy(list) {
  const map = new Map();
  for (const entry of list ?? []) map.set(keyOf(entry), entry);

  return map;
}

/**
 * Lists the differences between two schema exports, one row per touched collection.
 * @param {object[]} base Collections before.
 * @param {object[]} head Collections after.
 * @returns {{collection: string, change: string, detail: string, removal: boolean}[]} Rows.
 */
function compare(base, head) {
  const before = indexBy(base);
  const after = indexBy(head);
  const rows = [];

  for (const [key, collection] of before) {
    if (after.has(key)) continue;
    rows.push({
      collection: collection.name,
      change: 'removed',
      detail: `collection removed with its ${(collection.fields ?? []).length} fields`,
      removal: true,
    });
  }

  for (const [key, collection] of after) {
    const old = before.get(key);
    if (!old) {
      rows.push({
        collection: collection.name,
        change: 'added',
        detail: `${(collection.fields ?? []).length} fields`,
        removal: false,
      });
      continue;
    }
    const details = [];
    if (old.name !== collection.name) details.push(`renamed from ${old.name}`);

    const oldFields = indexBy(old.fields);
    const newFields = indexBy(collection.fields);
    const removed = [...oldFields.entries()]
      .filter(([fieldKey]) => !newFields.has(fieldKey))
      .map(([, field]) => field.name);
    const added = [...newFields.entries()]
      .filter(([fieldKey]) => !oldFields.has(fieldKey))
      .map(([, field]) => field.name);
    const changed = [...newFields.entries()]
      .filter(
        ([fieldKey, field]) => oldFields.has(fieldKey) && !same(oldFields.get(fieldKey), field)
      )
      .map(([fieldKey, field]) => {
        const previous = oldFields.get(fieldKey).name;

        return previous === field.name ? field.name : `${previous} → ${field.name}`;
      });
    if (removed.length > 0) details.push(`fields removed: ${removed.join(', ')}`);
    if (added.length > 0) details.push(`fields added: ${added.join(', ')}`);
    if (changed.length > 0) details.push(`fields changed: ${changed.join(', ')}`);

    const rules = RULE_KEYS.filter(rule => !same(old[rule], collection[rule]));
    if (rules.length > 0) details.push(`rules changed: ${rules.join(', ')}`);
    if (!same(old.indexes ?? [], collection.indexes ?? [])) details.push('indexes changed');
    const others = [...new Set([...Object.keys(old), ...Object.keys(collection)])].filter(
      property => !KNOWN_KEYS.has(property) && !same(old[property], collection[property])
    );
    if (others.length > 0) details.push(`other settings changed: ${others.join(', ')}`);

    if (details.length > 0) {
      rows.push({
        collection: collection.name,
        change: removed.length > 0 ? 'fields removed' : 'changed',
        detail: details.join('; '),
        removal: removed.length > 0,
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

function printHelp() {
  console.log(`Usage: node tools/scripts/check-pb-schema-change.cjs --base <json> --head <json>
  [--changed <file>] [--labels <a,b>] [--summary <md file>]

Fails when pb_schema.json changes without any other eco file (schema-only-change) or
loses a collection or field (schema-removal), unless the labels include "${ACK_LABEL}".`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();

    return 0;
  }
  const rows = compare(readJson(args.base), readJson(args.head));
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
  const removals = rows.filter(row => row.removal);
  if (removals.length > 0) {
    problems.push(
      `schema-removal: ${removals.map(row => row.collection).join(', ')} lose a collection or fields. The staging sync drops them, data included.`
    );
  }

  const acknowledged = args.labels.includes(ACK_LABEL);
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
  for (const problem of problems) write(`${acknowledged ? 'ℹ' : '✖'} ${problem}`);
  if (acknowledged) {
    write(`\nAcknowledged by the "${ACK_LABEL}" label.`);

    return 0;
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
