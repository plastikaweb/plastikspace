import { expect, test } from './support/test';

// The two flows this suite must eventually cover are AMBR-07 (member deletion) and AORD-03 (order
// state transitions): REQUIREMENTS §6. They need the views behind the shell; until then the suite
// checks the door.
test('sends a visitor without a session to the login screen', async ({ page }) => {
  await page.goto('/');

  await expect.poll(() => new URL(page.url()).pathname).toBe('/accedir');
  await expect(page.getByRole('textbox', { name: 'Correu electrònic' })).toBeVisible();
  await expect(page.getByLabel('Contrasenya', { exact: true })).toHaveAttribute('type', 'password');
});
