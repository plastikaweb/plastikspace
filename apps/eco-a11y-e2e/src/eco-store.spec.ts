import type { Page } from '@playwright/test';
import { audit, expectCredentialsCanBeFilled, type KnownViolation } from './support/audit';
import { MEMBER, MEMBER_ADDRESS } from './support/records';
import { expect, startSession, STORE, test } from './support/test';

// Violations found when the suite was written (META-40, 2026-11-24). Each one waits for its own
// task; take the entry out when the task lands, or the report flags it as «not found».
const HEADER_NAMES: KnownViolation = {
  rule: 'label-content-name-mismatch',
  target: /aria-label="(Tornar a la botiga|Anar a la cistella)|user-pill/,
  reason: '2.5.3: the desktop header logo, cart and user buttons are named apart from their text',
};
const PRODUCT_CHIPS: KnownViolation = {
  rule: 'aria-required-parent',
  target: /role="listitem" aria-label="(ECO|NOVETAT|OFERTA)"/,
  reason: '1.3.1: the product chips are list items whose list role never reaches them',
};
const RATING_LINK: KnownViolation = {
  rule: 'label-content-name-mismatch',
  target: /aria-label="\(124 valoracions\)"/,
  reason: '2.5.3: the rating link drops «4.8» from its name',
};
const LEGAL_NOTE: KnownViolation = {
  rule: 'color-contrast',
  target: /En continuar, acceptes/,
  reason:
    '1.4.3: the terms note under the form is 3.8:1 in light and 4.46:1 in dark (`opacity-70`)',
};
const DARK_FIXED_SHADES: KnownViolation = {
  rule: 'color-contrast',
  target:
    /text-tertiary-700 dark:text-tertiary-300|class="text-md">kg<|text-primary-700 text-xs"> MS </,
  reason:
    '1.4.3: in dark mode, text on a fixed palette shade keeps its light colour (1.2 to 1.4:1)',
};
const STORE_KNOWN = [HEADER_NAMES, DARK_FIXED_SHADES];

/**
 * Adds the first product of the catalogue to the cart of a visitor, through its button.
 * @param { Page } page - The page of the test.
 */
async function addFirstProductToCart(page: Page): Promise<void> {
  await page.goto(`${STORE}/botiga`);
  // The favourites button is also named «Afegir …»: the cart button is exactly «Afegir».
  await page.getByRole('button', { name: 'Afegir', exact: true }).first().click();
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('el-llevat-cart-v1')))
    .toContain('prodperes00001');
}

test.describe('eco-store, signed out', () => {
  test('the catalogue', async ({ page }, testInfo) => {
    await page.goto(`${STORE}/botiga`);
    await expect(page.getByRole('heading', { name: 'Peres conferència' })).toBeVisible();

    await audit(page, testInfo, STORE_KNOWN);
  });

  test('the catalogue sorted by price, 75 a page', async ({ page }, testInfo) => {
    await page.goto(`${STORE}/botiga?perPage=75&page=0&active=priceWithIva&direction=desc`);
    await expect(page.getByRole('heading', { name: 'Pomes golden' })).toBeVisible();

    await audit(page, testInfo, STORE_KNOWN);
  });

  test('a product page', async ({ page }, testInfo) => {
    await page.goto(`${STORE}/botiga/fruita-i-verdura/peres-conferencia`);
    await expect(page.getByRole('heading', { name: 'Peres conferència' })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Afegir( al cabàs)?$/ })).toBeVisible();

    await audit(page, testInfo, [...STORE_KNOWN, PRODUCT_CHIPS, RATING_LINK]);
  });

  test('the cart summary with a product in it', async ({ page }, testInfo) => {
    await addFirstProductToCart(page);
    await page.goto(`${STORE}/cistella/resum`);
    await expect(page).toHaveURL(/\/cistella\/resum$/);
    await expect(page.getByText('Peres conferència').first()).toBeVisible();

    await audit(page, testInfo, STORE_KNOWN);
  });

  test('the sign-in screen', async ({ page }, testInfo) => {
    await page.goto(`${STORE}/accedir`);
    await expect(page.getByRole('heading', { name: 'Inici de sessió' })).toBeVisible();

    await expectCredentialsCanBeFilled(
      page.getByRole('textbox', { name: /correu/i }),
      page.getByLabel(/contrasenya/i).first()
    );
    await audit(page, testInfo, [LEGAL_NOTE]);
  });

  test('the password recovery screen', async ({ page }, testInfo) => {
    await page.goto(`${STORE}/recuperar-contrasenya`);
    await expect(page.getByRole('heading', { name: 'Has oblidat la contrasenya?' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /correu/i })).toHaveAttribute(
      'autocomplete',
      'email'
    );

    await audit(page, testInfo, [LEGAL_NOTE]);
  });

  test('the delivery step, after signing in, offers the saved address', async ({
    page,
  }, testInfo) => {
    await addFirstProductToCart(page);
    await startSession(page, MEMBER);
    await page.goto(`${STORE}/cistella/enviament`);
    await expect(page).toHaveURL(/\/cistella\/enviament$/);

    // 3.3.7: home delivery offers the address the member saved, instead of asking for it again.
    await page.getByText(/enviament a domicili/i).click();
    await expect(page.getByText(MEMBER_ADDRESS['address'] as string)).toBeVisible();

    await audit(page, testInfo, STORE_KNOWN);
  });
});

test.describe('eco-store, first visit', () => {
  test.use({ hasPwaSheet: true });

  test('the catalogue with the install sheet open', async ({ page }, testInfo) => {
    await page.goto(`${STORE}/botiga`);
    await expect(page.getByRole('heading', { name: 'Peres conferència' })).toBeVisible();
    // Chrome offers the install once the app qualifies; the event is what opens the sheet.
    await page.evaluate(() =>
      window.dispatchEvent(
        Object.assign(new Event('beforeinstallprompt', { cancelable: true }), {
          prompt: () => Promise.resolve(),
          userChoice: Promise.resolve({ outcome: 'dismissed' }),
        })
      )
    );
    await expect(page.getByRole('dialog').first()).toBeVisible();

    await audit(page, testInfo, STORE_KNOWN);
  });
});

test.describe('eco-store, signed in as a member', () => {
  test.use({ isSignedIn: true });

  test('the personal details form', async ({ page }, testInfo) => {
    await page.goto(`${STORE}/perfil/dades-personals`);
    const name = page.getByRole('textbox', { name: /nom/i }).first();

    await expect(name).toBeVisible();
    // 1.3.5: the fields that ask for the member's own data say which data they hold.
    await expect(name).toHaveAttribute('autocomplete', 'name');
    await expect(page.getByRole('textbox', { name: /telèfon/i })).toHaveAttribute(
      'autocomplete',
      'tel'
    );

    await audit(page, testInfo, STORE_KNOWN);
  });
});
