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
        await page.locator(XPath.getElementById('confirmpassword')).fill('hardpass');
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

    test('User can logout', async ({page}) => {
        await page.goto('/login');
        await expect(page).toHaveURL('/login');

        await expect(page.locator(XPath.getElement('h1'))).toHaveText('LOGIN');
        await page.locator(XPath.getElementById('username')).fill('admin');
        await page.locator(XPath.getElementById('password')).fill('hardpass');
        await page.locator(XPath.getElementByType('submit')).click();

        // navigate to student list via nav bar
        await expect(page).toHaveURL(/internships/);
        const nav_account_loc = '//*[@class="dropdown" and contains(text(), "Account")]';
        const nav_logout_loc = '//*[@class="dropdown-item" and .=" Logout "]';
        await expect(page.locator(nav_logout_loc)).toBeHidden();
        await page.locator(nav_account_loc).hover();
        await expect(page.locator(nav_logout_loc)).toBeVisible();
        await page.locator(nav_logout_loc).click();
        await expect(page).toHaveURL(/login/);

        // now the user can't access restricted pages
        await page.goto('/internships');
        await page.getByRole('button', { name: 'new' }).click()
        await expect(page).toHaveURL(/login/);

        await page.goto('/');
        const nav_student_loc = '//*[@class="navbar-menu"]//*[contains(text(), "Students")]';
        await page.locator(nav_student_loc).click();
        await expect(page).toHaveURL(/login/);
    });
});
