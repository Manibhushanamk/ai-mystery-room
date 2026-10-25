import { test, expect } from '@playwright/test';

test.describe('AI Mystery Room End-to-End Investigation Journey', () => {
  test('Complete mystery journey: Seed -> Generation -> Evidence Inspection -> Notes -> Accusation -> Cited Reveal', async ({
    page,
  }) => {
    // 1. Visit landing page
    await page.goto('/');
    await expect(page).toHaveTitle(/AI Mystery Room/);
    await expect(page.getByText('FICTIONAL SIMULATION').first()).toBeVisible();
    await expect(page.getByText('Canonical Truth First')).toBeVisible();

    // 2. Click "Create an Investigation"
    await page.getByRole('link', { name: 'Create an Investigation' }).click();
    await expect(page).toHaveURL(/\/create/);
    await expect(page.getByText('Commission a New Investigation')).toBeVisible();

    // 3. Select preset "The Quantum Core Breach"
    await page.getByRole('button', { name: /The Quantum Core Breach/ }).click();

    // Verify textarea populated
    const textarea = page.locator('textarea#scenario');
    await expect(textarea).not.toBeEmpty();

    // 4. Submit to create case
    await page.getByRole('button', { name: /Generate Case/ }).click();

    // 5. Land on generation screen and wait for transition to investigation workspace
    await expect(page).toHaveURL(/\/cases\/.*\/generating/, { timeout: 10000 });
    await expect(page.getByText('Generating Investigation')).toBeVisible();

    // 6. Wait for auto-redirect to investigation room
    await expect(page).toHaveURL(/\/investigate\/.*/, { timeout: 20000 });
    await expect(page.getByText('Case Briefing Memo')).toBeVisible();
    await expect(page.getByText('Evidence Docket')).toBeVisible();

    // 7. Inspect suspects
    await expect(page.getByRole('heading', { name: 'Marcus Wright', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dr. Evelyn Vance', exact: true })).toBeVisible();

    // 8. Open an evidence clue modal
    await page.getByText('Sub-Basement Corridor Access Log').first().click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Contractor Maintenance Keycard #408')).toBeVisible();

    // 9. Mark clue as important
    await page.getByRole('button', { name: /Mark as Key Clue/ }).click();
    await expect(page.getByText('Marked Clue')).toBeVisible();

    // Close modal
    await page.getByRole('button', { name: 'Close dialog' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();

    // 10. Switch to Notes tab and add an investigator deduction
    await page.getByRole('button', { name: /Notes/ }).click();
    const noteInput = page.getByPlaceholder(/Record deduction/);
    await noteInput.fill('Keycard #408 directly ties Marcus Wright to the vault unlock window.');
    await page.getByRole('button', { name: 'Add Note' }).click();
    await expect(page.getByText('Keycard #408 directly ties Marcus Wright')).toBeVisible();

    // 11. Accuse Marcus Wright (Suspect 02)
    const accuseBtn = page.getByRole('button', { name: 'Accuse Marcus' });
    await accuseBtn.click();

    // 12. Accusation confirmation dialog
    await expect(page.getByText('Final Accusation Warning')).toBeVisible();
    await expect(page.getByText('High Stakes: Irreversible Action')).toBeVisible();

    // 13. Confirm Accusation
    await page.getByRole('button', { name: 'Confirm Accusation' }).click();

    // 14. Verify cited Reveal Screen appears
    await expect(page.getByText('Case Solved: Accusation Confirmed')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('True Motive')).toBeVisible();
    await expect(page.getByText('Method of the Incident')).toBeVisible();
    await expect(page.getByText('Evidence Chain & Reasoning')).toBeVisible();

    // 15. Reload page to ensure persistent completed state
    await page.reload();
    await expect(page.getByText('Case Solved: Accusation Confirmed')).toBeVisible({ timeout: 10000 });
  });
});
