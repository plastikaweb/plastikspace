import AxeBuilder from '@axe-core/playwright';
import { expect, type Locator, type Page, type TestInfo } from '@playwright/test';

/** WCAG 2.2 AA as axe tags it: every A and AA rule up to 2.2. */
export const WCAG_22_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/**
 * A violation the suite knows about and lets pass until its task fixes it.
 * It names the rule and the nodes, never a whole rule on a whole page.
 */
export interface KnownViolation {
  /** The axe rule id. */
  rule: string;
  /** Matched against each failing node's selector and opening tag. */
  target: RegExp;
  /** The criterion, what fails, and the task that fixes it. */
  reason: string;
}

/**
 * The audit every screen gets.
 * Axe with the WCAG 2.2 AA rules and, in the light projects, the 2.4.11 walk with Tab: where
 * focus lands does not depend on the colour scheme.
 * @param { Page } page - The page, in the state the user sees it.
 * @param { TestInfo } testInfo - The running test.
 * @param { KnownViolation[] } known - The violations that may stay for now.
 */
export async function audit(
  page: Page,
  testInfo: TestInfo,
  known: KnownViolation[] = []
): Promise<void> {
  await expectNoAxeViolations(page, testInfo, known);

  if (testInfo.project.use.colorScheme !== 'dark') await expectFocusNotObscured(page);
}

/**
 * Runs axe and fails on any violation that `known` does not list.
 * Attaches the full result to the report either way, and annotates each known violation as
 * found or not found.
 * @param { Page } page - The page, in the state the user sees it.
 * @param { TestInfo } testInfo - The running test, for the attachment and the annotations.
 * @param { KnownViolation[] } known - The violations that may stay for now.
 */
async function expectNoAxeViolations(
  page: Page,
  testInfo: TestInfo,
  known: KnownViolation[]
): Promise<void> {
  await iconFontLoaded(page);
  const results = await new AxeBuilder({ page }).withTags(WCAG_22_AA).analyze();
  const unexpected: string[] = [];
  const matched = new Set<KnownViolation>();

  for (const violation of results.violations) {
    for (const node of violation.nodes) {
      const target = node.target.join(' ');
      const allowed = known.find(
        entry => entry.rule === violation.id && entry.target.test(`${target} ${node.html}`)
      );

      if (allowed) {
        matched.add(allowed);
      } else {
        unexpected.push(
          `${violation.id} (${violation.impact}): ${target}\n    ${node.failureSummary}`
        );
      }
    }
  }

  for (const entry of known) {
    testInfo.annotations.push({
      type: matched.has(entry) ? 'known violation' : 'known violation not found',
      description: `${entry.rule} ${entry.target}: ${entry.reason}`,
    });
  }
  await testInfo.attach('axe-violations.json', {
    body: JSON.stringify(results.violations, null, 1),
    contentType: 'application/json',
  });

  expect(
    unexpected,
    `axe found ${unexpected.length} violation(s):\n${unexpected.join('\n')}`
  ).toEqual([]);
}

/**
 * Waits for Material Symbols.
 * Until it loads, an icon is the plain word of its ligature («favorite»), and axe reads that
 * word as the button's visible text. Both apps load the font from Google Fonts with a stylesheet
 * that applies late, so `document.fonts.ready` can resolve before the font is even declared.
 * @param { Page } page - The page to wait on.
 */
async function iconFontLoaded(page: Page): Promise<void> {
  await page
    .waitForFunction(
      () => {
        let isLoaded = false;

        document.fonts.forEach(face => {
          if (face.family.replace(/["']/g, '') === 'Material Symbols Outlined') {
            isLoaded ||= face.status === 'loaded';
          }
        });

        return isLoaded;
      },
      undefined,
      { timeout: 15_000 }
    )
    .catch(() => {
      throw new Error('Material Symbols did not load from Google Fonts: is the machine offline?');
    });
}

/**
 * Checks 2.4.11 Focus Not Obscured (Minimum) by tabbing through the page.
 * Fails when a focused element is wholly covered by fixed or sticky content it does not belong
 * to (a bar, a sheet, a toast), or ends up outside the viewport.
 * @param { Page } page - The page, with nothing focused yet.
 * @param { number } stops - How many Tab presses to check.
 */
async function expectFocusNotObscured(page: Page, stops = 40): Promise<void> {
  const hidden: string[] = [];

  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());

  for (let stop = 1; stop <= stops; stop++) {
    await page.keyboard.press('Tab');
    const verdict = await page.evaluate(focusVerdict);

    if (verdict === 'end') break;
    if (verdict !== 'visible') hidden.push(`Tab ${stop}: ${verdict}`);
  }

  expect(hidden, `focus hidden at:\n${hidden.join('\n')}`).toEqual([]);
}

/**
 * Says where the focused element stands; it runs in the page.
 * @returns { string } `end` past the last element, `visible`, or what hides the element.
 */
function focusVerdict(): string {
  const element = document.activeElement;

  if (!element || element === document.body) return 'end';

  const rect = element.getBoundingClientRect();
  const label = (element.getAttribute('aria-label') ?? element.textContent ?? '').trim();
  const name = `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''} «${label.slice(0, 40)}»`;

  if (rect.width === 0 && rect.height === 0) return 'visible';

  const inset = 2;
  const left = Math.max(rect.left + inset, 0);
  const right = Math.min(rect.right - inset, window.innerWidth - 1);
  const top = Math.max(rect.top + inset, 0);
  const bottom = Math.min(rect.bottom - inset, window.innerHeight - 1);

  if (left > right || top > bottom) return `${name} is outside the viewport`;

  const points = [
    [(left + right) / 2, (top + bottom) / 2],
    [left, top],
    [right, top],
    [left, bottom],
    [right, bottom],
  ];
  const coveringLayer = (x: number, y: number): Element | null => {
    let candidate = document.elementFromPoint(x, y);

    if (!candidate || element.contains(candidate) || candidate.contains(element)) return null;

    while (candidate && candidate !== document.body) {
      const { position } = getComputedStyle(candidate);

      if (position === 'fixed' || position === 'sticky') {
        return candidate.contains(element) ? null : candidate;
      }
      candidate = candidate.parentElement;
    }

    return null;
  };
  const layers = points.map(([x, y]) => coveringLayer(x, y));

  if (layers.every(Boolean)) {
    const layer = layers[0] as Element;
    const classes = Array.from(layer.classList).slice(0, 2).join('.');

    return `${name} is covered by ${layer.tagName.toLowerCase()}.${classes}`;
  }

  return 'visible';
}

/**
 * Checks 3.3.8 Accessible Authentication (Minimum) on a credentials form.
 * A password manager can fill the fields (their `autocomplete` tokens), and pasting into them is
 * not blocked.
 * @param { Locator } email - The email field.
 * @param { Locator } password - The password field.
 * @param { string } passwordToken - `current-password` to sign in, `new-password` to set one.
 */
export async function expectCredentialsCanBeFilled(
  email: Locator,
  password: Locator,
  passwordToken: 'current-password' | 'new-password' = 'current-password'
): Promise<void> {
  await expect(email).toHaveAttribute('autocomplete', 'email');
  await expect(password).toHaveAttribute('autocomplete', passwordToken);

  for (const field of [email, password]) {
    const isPasteBlocked = await field.evaluate(input => {
      const clipboardData = new DataTransfer();

      clipboardData.setData('text/plain', 'pasted');
      const paste = new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData });

      input.dispatchEvent(paste);

      return paste.defaultPrevented;
    });

    expect(isPasteBlocked, 'pasting into a credential field is blocked').toBe(false);
  }
}
