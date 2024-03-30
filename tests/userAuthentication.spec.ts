import {test, expect} from '@playwright/test';
import {XPath} from "../XPath";
import {generateRandomUsername} from "../utils/utils";

test.describe('User Authentication', () => {
    test('User can register', async ({page}) => {
        const username = generateRandomUsername();
        await page.goto('/register');
        await expect(page).toHaveURL('/register');

        await expect(page.locator(XPath.getElement('h1'))).toHaveText('REGISTER');
        await page.locator(XPath.getElementById('first_name')).fill('first name');
        await page.locator(XPath.getElementById('last_name')).fill('last name');
        await page.locator(XPath.getElementById('username')).fill(username);
        await page.locator(XPath.getElementById('password')).fill('hardpass');
        await page.locator(XPath.getElementByType('submit')).click();

        await expect(page).toHaveURL('/login');
    });

    test('User can login', async ({page}) => {
        await page.goto('/login');
        await expect(page).toHaveURL('/login');

        await expect(page.locator(XPath.getElement('h1'))).toHaveText('LOGIN');
        await page.locator(XPath.getElementById('username')).fill('admin');
        await page.locator(XPath.getElementById('password')).fill('hardpass');
        await page.locator(XPath.getElementByType('submit')).click();

        await expect(page).toHaveURL('/internships');
    });
});