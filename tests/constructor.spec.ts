import { test, expect } from '@playwright/test';
import ingredients from '../src/mocks/ingredients.json';

const bun = ingredients.find((item) => item.type === 'bun');
const main = ingredients.find((item) => item.type === 'main');

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
      .locator('li', { hasText: bun?.name })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await expect(page.getByText(`${bun?.name} (верх)`)).toBeVisible();
    await expect(page.getByText(`${bun?.name} (низ)`)).toBeVisible();

    await page
      .locator('li', { hasText: main?.name })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await expect(page.getByText('Выберите начинку')).not.toBeVisible();
  });

  test('Открытие и закрытие модального окна', async ({ page }) => {
    await expect(page.getByText('Соберите бургер')).toBeVisible();

    await page.getByText(bun?.name).first().click();
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText(bun?.name)).toBeVisible();

    await page.getByTestId('modal-close').click();
    await expect(modal).not.toBeVisible();

    await page.getByText(`${bun?.name}`).first().click();
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

    await page.route('**/api/auth/user', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { email: 'mock@mock.ru', name: 'Mock user' }
        })
      })
    );

    await page.route('**/api/orders', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          name: 'Краторный бургер',
          order: {
            _id: 'order-1',
            status: 'done',
            name: 'Краторный бургер',
            createdAt: '2026-08-20T00:00:00.000Z',
            updatedAt: '2026-08-20T00:00:00.000Z',
            number: 12354,
            price: 5000
          }
        })
      })
    );

    await page.goto('/');
    await expect(page.getByText('Соберите бургер')).toBeVisible();

    await page
      .locator('li', { hasText: bun?.name })
      .getByRole('button', { name: 'Добавить' })
      .click();
    await page
      .locator('li', { hasText: main?.name })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('12354')).toBeVisible();

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await page.getByTestId('modal-close').click();
  });
});
