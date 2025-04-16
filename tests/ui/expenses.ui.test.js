import { test, expect } from '@playwright/test';

test('adds and deletes an expense', async ({ page }) => {
    await page.goto('/');

    // Add expense
    await page.fill('#amount', '25.50');
    await page.selectOption('#category', 'Grocery');
    await page.fill('#date', '2025-04-12');
    //await page.click('button[type="submit"]');

    const submitPromise = page.waitForResponse(response => 
        response.url().includes('/api/expenses') && response.request().method() === 'POST'
    );
    await page.click('button[type="submit"]');
    await submitPromise;

    // Wait for the GET response that refreshes the table
    const fetchPromise = page.waitForResponse(response => 
        response.url().includes('/api/expenses') && response.request().method() === 'GET'
    );
    await fetchPromise;

    // Check table
    await expect(page.locator('td:has-text("AED 25.50")')).toBeVisible();

    // Delete expense
    await page.click('td button:has-text("Delete")');
    await expect(page.locator('td:has-text("AED 25.50")')).not.toBeVisible();
});