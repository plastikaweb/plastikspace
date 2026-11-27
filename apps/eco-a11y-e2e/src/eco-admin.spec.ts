import { audit, expectCredentialsCanBeFilled } from './support/audit';
import { ADMIN } from './support/records';
import { ADMIN_APP, expect, test } from './support/test';

test.use({ account: ADMIN });

test.describe('eco-admin', () => {
  test('the sign-in screen', async ({ page }, testInfo) => {
    await page.goto(`${ADMIN_APP}/accedir`);
    await expect(page.getByRole('heading', { name: 'Inici de sessió' })).toBeVisible();

    await expectCredentialsCanBeFilled(
      page.getByRole('textbox', { name: /correu/i }),
      page.getByLabel(/contrasenya/i).first()
    );
    await audit(page, testInfo);
  });

  test('the first screen after signing in', async ({ page }, testInfo) => {
    await page.goto(`${ADMIN_APP}/accedir`);
    await page.getByRole('textbox', { name: /correu/i }).fill(ADMIN['email'] as string);
    await page
      .getByLabel(/contrasenya/i)
      .first()
      .fill('x'.repeat(12));
    await page.getByRole('button', { name: 'Iniciar sessió' }).click();
    // A tenant administrator lands on the Tauler section of the shell (AP-0 0.7).
    await expect(page).toHaveURL(`${ADMIN_APP}/tauler`);
    await expect(page.getByRole('heading').first()).toBeVisible();

    await audit(page, testInfo);
  });
});
