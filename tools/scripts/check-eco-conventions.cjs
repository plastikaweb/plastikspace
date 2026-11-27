#!/usr/bin/env node
/**
 * META-15 — template and style conventions of the eco apps, as a check that fails.
 *
 * Scope: libs/eco* and apps/eco-* (specs left out). Read-only. Modelled on
 * NewWebSite scripts/check-css-conventions.cjs.
 *
 *   ERROR bare-form-control  An <input>, <select> or <textarea> without the
 *                            matInput or matNativeControl attribute, in an HTML
 *                            template or the `template:` literal of a .ts file.
 *                            Fields render inside mat-form-field through Formly
 *                            (.claude/CLAUDE.md, Forms).
 *   ERROR raw-hex            A hex colour in a .scss or .css file. Colours come
 *                            from the Material roles (--mat-sys-*) and the eco
 *                            tokens. Selectors (`#id`), strings and url() are
 *                            left out.
 *   ERROR sys-redefined      A `--mat-sys-*` declared in a .scss or .css file,
 *                            interpolated names (`--mat-sys-#{$role}`) included:
 *                            the system tokens are owned by the token sources.
 *   INFO  ng-deep            Every `::ng-deep`, listed for the reviewer to justify.
 *
 * The token sources (TOKEN_SOURCES: libs/eco/styles/src/_eco_tokens.css and the
 * eco-store `*-theme.css` files) declare the hex scales and the --mat-sys-* roles
 * by design, so raw-hex and sys-redefined skip them. Inline `styles:` of a
 * component are not read: eco components keep their styles in .scss files.
 *
 * Comments (`/* *\/` and `//` in styles and TypeScript, `<!-- -->` in
 * templates) are blanked before the analysis, keeping the line numbers. A
 * justified exception is a comment on the line right before the finding, or a
 * run of such lines:
 *   /* eco:check allow <rule>: <reason> *\/      (styles, TypeScript)
 *   <!-- eco:check allow <rule>: <reason> -->   (templates)
 * No reason, no exception.
 *
 * Files: tracked plus untracked ones (ignores applied) from git, or the paths
 * given to --files (relative to the root), routed by path and extension: the
 * pre-commit passes the staged files and runs inside its copy of the index.
 *
 * Usage:
 *   node tools/scripts/check-eco-conventions.cjs [--files <path>...] [--json] [--root <dir>]
 *
 * Exit codes: 0 clean (info only); 1 one or more errors; 2 usage or IO error.
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SCOPE = /^(apps\/eco-[^/]+|libs\/eco[^/]*)\//;
const SKIPPED = /\.spec\.ts$/;
const STYLE = /\.(scss|css)$/;
const TOKEN_SOURCES = [
  /^libs\/eco\/styles\/src\/_eco_tokens\.css$/,
  /^apps\/eco-store\/src\/styles\/[^/]+-theme\.css$/,
];
const FORM_CONTROL = /<(input|select|textarea)(?=[\s/>]|$)/gi;
const MATERIAL_CONTROL = new Set(['matInput', 'matNativeControl']);
const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g;
const SYS_DECLARATION = /^\s*(--mat-sys-(?:[\w-]|#\{[^}]*\})+)\s*:/;
const NG_DEEP = /::ng-deep/g;
const MARKER = /^(\/\*|<!--)\s*eco:check\s+allow\s+([a-z-]+)\s*:(.*?)(\*\/|-->)$/;
const CLOSER = { '/*': '*/', '<!--': '-->' };

class FatalError extends Error {}

/**
 * Parses the command line.
 * @param {string[]} argv Arguments after the script name.
 * @returns {{ files: string[] | null, json: boolean, root: string, help: boolean }} The options.
 */
function parseArgs(argv) {
  const opts = { files: null, json: false, root: REPO_ROOT, help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--json') opts.json = true;
    else if (arg === '--help' || arg === '-h') opts.help = true;
    else if (arg === '--files') {
      opts.files = opts.files ?? [];
      while (argv[i + 1] !== undefined && !argv[i + 1].startsWith('--')) opts.files.push(argv[++i]);
    } else if (arg === '--root') {
      const value = argv[++i];
      if (value === undefined || value.startsWith('--'))
        throw new FatalError('--root needs a value');
      opts.root = path.resolve(value);
    } else throw new FatalError(`Unknown argument: ${arg}`);
  }

  return opts;
}

/**
 * Tells whether a path is one this check reads.
 * @param {string} file Path relative to the root, with forward slashes.
 * @returns {boolean} True for an eco template, component or stylesheet.
 */
function inScope(file) {
  return SCOPE.test(file) && !SKIPPED.test(file) && /\.(html|ts|scss|css)$/.test(file);
}

/**
 * Lists the files to check.
 * @param {string} root Workspace root.
 * @param {string[] | null} given The --files paths, or null for the whole scope.
 * @returns {string[]} Paths relative to the root, sorted.
 */
function listFiles(root, given) {
  if (given !== null) {
    const files = given.map(file => {
      const relative = path.relative(root, path.resolve(root, file)).split(path.sep).join('/');
      if (!fs.existsSync(path.join(root, relative))) throw new FatalError(`${file}: no such file`);

      return relative;
    });

    return [...new Set(files.filter(inScope))].sort();
  }
  let out;
  try {
    out = execFileSync(
      'git',
      ['ls-files', '-co', '--exclude-standard', '-z', '--', 'apps/eco-*', 'libs/eco*'],
      {
        cwd: root,
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    );
  } catch (error) {
    throw new FatalError(
      `git ls-files failed in ${root}: ${String(error.stderr || error.message).trim()}`
    );
  }

  return [
    ...new Set(
      out
        .split('\0')
        .filter(inScope)
        .filter(file => fs.existsSync(path.join(root, file)))
    ),
  ].sort();
}

/**
 * Replaces a range with spaces, keeping the line breaks.
 * @param {string[]} chars The text, one character per entry; changed in place.
 * @param {number} start First index.
 * @param {number} end Index after the last.
 */
function blank(chars, start, end) {
  for (let i = start; i < end; i++) if (chars[i] !== '\n') chars[i] = ' ';
}

/**
 * Index after a quoted string that starts at `start`. A string ends at its
 * unescaped quote or at the end of the line, as in CSS and TypeScript.
 * @param {string} text The text.
 * @param {number} start Index of the opening quote.
 * @returns {number} Index after the string.
 */
function quotedEnd(text, start) {
  const quote = text[start];
  for (let i = start + 1; i < text.length; i++) {
    if (text[i] === '\\') i++;
    else if (text[i] === quote) return i + 1;
    else if (text[i] === '\n') return i;
  }

  return text.length;
}

/**
 * Index after a line or block comment that starts at `start`, or -1.
 * @param {string} text The text.
 * @param {number} start Index of a `/`.
 * @returns {number} Index after the comment, or -1 when none starts there.
 */
function commentEnd(text, start) {
  if (text[start] !== '/') return -1;
  if (text[start + 1] === '*') {
    const close = text.indexOf('*/', start + 2);

    return close === -1 ? text.length : close + 2;
  }
  if (text[start + 1] === '/') {
    const close = text.indexOf('\n', start);

    return close === -1 ? text.length : close;
  }

  return -1;
}

/**
 * Lexes a stylesheet.
 * @param {string} text The .scss or .css source.
 * @returns {{ code: string, values: string }} `code` has the comments blanked;
 *   `values` also has the strings and the url() arguments blanked.
 */
function lexStyle(text) {
  const code = text.split('');
  const values = text.split('');
  let i = 0;
  while (i < text.length) {
    const comment = commentEnd(text, i);
    if (comment !== -1) {
      blank(code, i, comment);
      blank(values, i, comment);
      i = comment;
    } else if (text[i] === '"' || text[i] === "'") {
      const end = quotedEnd(text, i);
      blank(values, i, end);
      i = end;
    } else if (/^url\(/i.test(text.slice(i, i + 4)) && !/[\w-]/.test(text[i - 1] ?? '')) {
      const close = text.indexOf(')', i + 4);
      const end = close === -1 ? text.length : close + 1;
      blank(values, i, end);
      i = end;
    } else i++;
  }

  return { code: code.join(''), values: values.join('') };
}

/**
 * Splits a lexed stylesheet into statements: what ends at `;`, `{` or `}`,
 * outside a `#{...}` interpolation.
 * @param {string} text The stylesheet with comments, strings and url() blanked.
 * @returns {{ start: number, text: string, opensBlock: boolean }[]} The statements.
 */
function statements(text) {
  const out = [];
  let start = 0;
  let interpolation = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '#' && text[i + 1] === '{') {
      interpolation++;
      i++;
    } else if (interpolation > 0) {
      if (text[i] === '{') interpolation++;
      else if (text[i] === '}') interpolation--;
    } else if (text[i] === ';' || text[i] === '{' || text[i] === '}') {
      out.push({ start, text: text.slice(start, i), opensBlock: text[i] === '{' });
      start = i + 1;
    }
  }
  out.push({ start, text: text.slice(start), opensBlock: false });

  return out;
}

/**
 * Finds the `template:` literals of a TypeScript file, with its comments blanked.
 * @param {string} text The .ts source.
 * @returns {{ start: number, end: number }[]} Each template's content range.
 */
function inlineTemplates(text) {
  const code = text.split('');
  const templates = [];
  let i = 0;
  while (i < text.length) {
    const comment = commentEnd(text, i);
    if (comment !== -1) {
      blank(code, i, comment);
      i = comment;
    } else if (text[i] === '"' || text[i] === "'") {
      i = quotedEnd(text, i);
    } else if (text[i] === '`') {
      let depth = 0;
      let end = i + 1;
      for (; end < text.length; end++) {
        if (text[end] === '\\') end++;
        else if (depth === 0 && text[end] === '`') break;
        else if (text[end] === '$' && text[end + 1] === '{') {
          depth++;
          end++;
        } else if (depth > 0 && text[end] === '{') depth++;
        else if (depth > 0 && text[end] === '}') depth--;
      }
      if (/(^|[^\w$])template\s*:\s*$/.test(code.slice(Math.max(0, i - 200), i).join('')))
        templates.push({ start: i + 1, end });
      i = end + 1;
    } else i++;
  }

  return templates;
}

/**
 * Reads one form control tag: its end and its attribute names.
 * @param {string} text The template with comments blanked.
 * @param {number} start Index after the tag name.
 * @returns {string[]} The attribute names.
 */
function attributeNames(text, start) {
  let end = start;
  while (end < text.length && text[end] !== '>') {
    end =
      text[end] === '"' || text[end] === "'"
        ? text.indexOf(text[end], end + 1) + 1 || text.length
        : end + 1;
  }

  return text
    .slice(start, end)
    .replace(/"[^"]*"|'[^']*'/g, '""')
    .split(/\s+/)
    .map(token => token.split('=')[0].replace(/\/$/, ''))
    .filter(Boolean);
}

/**
 * Checks a template, or the template part of a TypeScript file.
 * @param {string} text The whole file.
 * @param {number} start Start of the template inside it.
 * @param {number} end End of the template inside it.
 * @returns {{ index: number, rule: string, severity: string, detail: string }[]} Its findings.
 */
function checkTemplate(text, start, end) {
  const chars = text.slice(start, end).split('');
  const source = chars.join('');
  for (let i = source.indexOf('<!--'); i !== -1; i = source.indexOf('<!--', i + 4)) {
    const close = source.indexOf('-->', i + 4);
    blank(chars, i, close === -1 ? source.length : close + 3);
  }
  const code = chars.join('');
  const findings = [];
  for (const match of code.matchAll(FORM_CONTROL)) {
    const names = attributeNames(code, match.index + match[0].length);
    if (!names.some(name => MATERIAL_CONTROL.has(name))) {
      findings.push({
        index: start + match.index,
        rule: 'bare-form-control',
        severity: 'error',
        detail: `<${match[1].toLowerCase()}> without matInput or matNativeControl`,
      });
    }
  }

  return findings;
}

/**
 * Checks a stylesheet.
 * @param {string} text The .scss or .css source.
 * @param {boolean} tokenSource True for a file of TOKEN_SOURCES.
 * @returns {{ index: number, rule: string, severity: string, detail: string }[]} Its findings.
 */
function checkStyle(text, tokenSource) {
  const { code, values } = lexStyle(text);
  const findings = [];
  if (!tokenSource) {
    for (const statement of statements(values)) {
      const prelude = statement.text.trimStart();
      if (statement.opensBlock && !prelude.startsWith('@')) continue;
      const declared = statement.text.match(SYS_DECLARATION);
      if (declared) {
        findings.push({
          index: statement.start + statement.text.indexOf(declared[1]),
          rule: 'sys-redefined',
          severity: 'error',
          detail: declared[1],
        });
      }
      for (const match of statement.text.matchAll(HEX)) {
        findings.push({
          index: statement.start + match.index,
          rule: 'raw-hex',
          severity: 'error',
          detail: match[0],
        });
      }
    }
  }
  for (const match of code.matchAll(NG_DEEP)) {
    findings.push({ index: match.index, rule: 'ng-deep', severity: 'info', detail: '::ng-deep' });
  }

  return findings;
}

/**
 * Reads the allow markers on the lines right above a line.
 * @param {string[]} lines The file's lines.
 * @param {number} line The finding's line, 1-based.
 * @returns {{ rule: string, reason: string }[]} The markers, nearest first.
 */
function markersAbove(lines, line) {
  const markers = [];
  for (let i = line - 2; i >= 0; i--) {
    const match = lines[i].trim().match(MARKER);
    if (!match || CLOSER[match[1]] !== match[4]) break;
    markers.push({ rule: match[2], reason: match[3].trim() });
  }

  return markers;
}

/**
 * Checks one file.
 * @param {string} root Workspace root.
 * @param {string} file Path relative to the root.
 * @returns {{ file: string, line: number, severity: string, rule: string, detail: string }[]} Its findings.
 */
function checkFile(root, file) {
  let text;
  try {
    text = fs.readFileSync(path.join(root, file), 'utf8');
  } catch (error) {
    throw new FatalError(`${file}: ${error.message}`);
  }
  let found;
  if (STYLE.test(file))
    found = checkStyle(
      text,
      TOKEN_SOURCES.some(re => re.test(file))
    );
  else if (file.endsWith('.html')) found = checkTemplate(text, 0, text.length);
  else found = inlineTemplates(text).flatMap(({ start, end }) => checkTemplate(text, start, end));
  const lines = text.split('\n');
  const lineStarts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === '\n') lineStarts.push(i + 1);
  const lineOf = index => {
    let low = 0;
    let high = lineStarts.length - 1;
    while (low < high) {
      const mid = (low + high + 1) >> 1;
      if (lineStarts[mid] <= index) low = mid;
      else high = mid - 1;
    }

    return low + 1;
  };

  return found.flatMap(({ index, rule, severity, detail }) => {
    const line = lineOf(index);
    const markers = markersAbove(lines, line).filter(marker => marker.rule === rule);
    if (markers.some(marker => marker.reason !== '')) return [];
    const note = markers.length > 0 ? ' (the allow marker above gives no reason)' : '';

    return [{ file, line, severity, rule, detail: `${detail}${note}` }];
  });
}

/**
 * Runs the check.
 * @param {string[]} argv Arguments after the script name.
 * @returns {number} The exit code.
 */
function main(argv) {
  try {
    const opts = parseArgs(argv);
    if (opts.help) {
      process.stdout.write(
        'Usage: node tools/scripts/check-eco-conventions.cjs [--files <path>...] [--json] [--root <dir>]\n'
      );

      return 0;
    }
    const files = listFiles(opts.root, opts.files);
    const findings = files.flatMap(file => checkFile(opts.root, file));
    const errors = findings.filter(finding => finding.severity === 'error').length;
    const infos = findings.length - errors;
    if (opts.json) {
      process.stdout.write(`${JSON.stringify({ files, findings, errors, infos }, null, 2)}\n`);
    } else {
      for (const { file, line, severity, rule, detail } of findings)
        process.stdout.write(
          `${file}:${line}  ${severity.padEnd(5)} ${rule.padEnd(17)} ${detail}\n`
        );
      const summary = `${files.length} eco file${files.length === 1 ? '' : 's'}, errors: ${errors}, info: ${infos}`;
      if (errors === 0) process.stdout.write(`✓ check-eco-conventions: ${summary}\n`);
      else {
        process.stdout.write(
          `✗ check-eco-conventions: ${summary}. Fix each error, or justify it with ` +
            '`/* eco:check allow <rule>: <reason> */` (`<!-- ... -->` in a template) on the line before (META-15).\n'
        );
      }
    }

    return errors === 0 ? 0 : 1;
  } catch (error) {
    if (!(error instanceof FatalError)) throw error;
    process.stderr.write(`check-eco-conventions: ${error.message}\n`);

    return 2;
  }
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));

module.exports = { main, TOKEN_SOURCES };
