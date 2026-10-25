import { test, expect } from '@playwright/test';

test.describe('UI Visual Verification & Screenshot Capture', () => {
  test('Capture visual proof of all primary investigation views', async ({ page }) => {
    // 1. Landing Page
    await page.goto('/');
    await page.screenshot({ path: 'test-results/01-landing-page.png', fullPage: true });

    // 2. Scenario Creation Page
    await page.goto('/create');
    await page.getByRole('button', { name: /The Quantum Core Breach/ }).click();
    await page.screenshot({ path: 'test-results/02-create-case.png', fullPage: true });

    // 3. Submit and wait for Investigation Room
    await page.getByRole('button', { name: /Generate Case/ }).click();
    await expect(page).toHaveURL(/\/investigate\/.*/, { timeout: 20000 });
    await expect(page.getByText('Case Briefing Memo')).toBeVisible();

    await page.screenshot({ path: 'test-results/03-investigation-workspace.png', fullPage: true });

    // 4. Open Evidence Modal
    await page.getByText('Sub-Basement Corridor Access Log').first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.screenshot({ path: 'test-results/04-evidence-modal.png' });

    // Close modal
    await page.getByRole('button', { name: 'Close dialog' }).click();

    // 5. Accuse Marcus Wright and capture reveal
    await page.getByRole('button', { name: 'Accuse Marcus' }).click();
    await page.getByRole('button', { name: 'Confirm Accusation' }).click();
    await expect(page.getByText('Case Solved: Accusation Confirmed')).toBeVisible({ timeout: 10000 });

    await page.screenshot({ path: 'test-results/05-solution-reveal.png', fullPage: true });
  });
});
