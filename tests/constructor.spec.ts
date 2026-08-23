import { test, expect } from '@playwright/test';

const bun = 'Краторная булка N-200i';
const main = 'Филе Люминесцентного тетраодонтимформа';
const order = '109218';
const user = 'Алексей';

test.describe('Burger constructor', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients'
    });
    await page.goto('/');
  });

  test('Добавление булки и начинки', async ({ page }) => {
    await expect(page.getByText('Соберите бургер')).toBeVisible();

    await page
      .locator('li', { hasText: bun })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await expect(page.getByText(`${bun} (верх)`)).toBeVisible();
    await expect(page.getByText(`${bun} (низ)`)).toBeVisible();

    await page
      .locator('li', { hasText: main })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await expect(page.getByText('Выберите начинку')).not.toBeVisible();
  });

  test('Открытие и закрытие модального окна', async ({ page }) => {
    await expect(page.getByText('Соберите бургер')).toBeVisible();

    await page.getByText(bun).first().click();
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText(bun)).toBeVisible();

    await page.getByTestId('modal-close').click();
    await expect(modal).not.toBeVisible();

    await page.getByText(`${bun}`).first().click();
    await expect(modal).toBeVisible();
    await page
      .getByTestId('modal-overlay-close')
      .click({ position: { x: 10, y: 10 } });
    await expect(modal).not.toBeVisible();
  });

  test('Создание заказа', async ({ page }) => {
    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'mock-access-token',
        url: 'http://localhost:4000'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/api/auth/user'
    });
    await page.routeFromHAR('tests/hars/order.har', {
      url: '**/api/orders'
    });

    await page.goto('/');
    await expect(page.getByText('Соберите бургер')).toBeVisible();
    await expect(page.getByText(user)).toBeVisible();

    await page
      .locator('li', { hasText: bun })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await page
      .locator('li', { hasText: main })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal').getByText(order)).toBeVisible();

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await page.getByTestId('modal-close').click();
  });
});
