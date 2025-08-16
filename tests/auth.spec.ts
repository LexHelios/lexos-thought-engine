import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test('should display sign in form by default', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /sign in/i })).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should switch between sign in and sign up forms', async ({ page }) => {
    // Start on sign in
    await expect(page.getByRole('tab', { name: /sign in/i })).toHaveAttribute('data-state', 'active');
    
    // Switch to sign up
    await page.getByRole('tab', { name: /sign up/i }).click();
    await expect(page.getByRole('tab', { name: /sign up/i })).toHaveAttribute('data-state', 'active');
    await expect(page.getByPlaceholder('Enter your full name')).toBeVisible();
    await expect(page.getByPlaceholder('Create a password')).toBeVisible();
    await expect(page.getByPlaceholder('Confirm your password')).toBeVisible();

    // Switch back to sign in
    await page.getByRole('tab', { name: /sign in/i }).click();
    await expect(page.getByRole('tab', { name: /sign in/i })).toHaveAttribute('data-state', 'active');
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Try to sign in with empty fields
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText('Please fill in all fields')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByPlaceholder('Enter your password');
    const toggleButton = page.locator('button[type="button"]').filter({ hasText: '' }).first();

    // Password should be hidden by default
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle to show password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click toggle to hide password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should validate sign up form', async ({ page }) => {
    // Switch to sign up
    await page.getByRole('tab', { name: /sign up/i }).click();

    // Fill form with mismatched passwords
    await page.getByPlaceholder('Enter your full name').fill('John Doe');
    await page.getByPlaceholder('Enter your email').fill('john@example.com');
    await page.getByPlaceholder('Create a password').fill('password123');
    await page.getByPlaceholder('Confirm your password').fill('password456');

    // Submit form
    await page.getByRole('button', { name: /create account/i }).click();

    // Should show password mismatch error
    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });

  test('should validate password length', async ({ page }) => {
    // Switch to sign up
    await page.getByRole('tab', { name: /sign up/i }).click();

    // Fill form with short password
    await page.getByPlaceholder('Enter your full name').fill('John Doe');
    await page.getByPlaceholder('Enter your email').fill('john@example.com');
    await page.getByPlaceholder('Create a password').fill('123');
    await page.getByPlaceholder('Confirm your password').fill('123');

    // Submit form
    await page.getByRole('button', { name: /create account/i }).click();

    // Should show password length error
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
  });
});