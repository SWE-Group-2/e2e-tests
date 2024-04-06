import {test, expect} from '@playwright/test';
import {XPath} from "../XPath";

test.describe('User Profile', () => {
    test('User can view navigate to their profile', async ({page}) => {
        await page.goto('/login');
        await page.locator(XPath.getElementById('username')).fill('student');
        await page.locator(XPath.getElementById('password')).fill('hardpass');
        await page.locator(XPath.getElementByType('submit')).click();
        
        // navigate to student list via nav bar
        await expect(page).toHaveURL(/internships/);
        const nav_account_loc = '//*[@class="dropdown" and contains(text(), "Account")]';
        const nav_profile_loc = '//*[@class="dropdown-item" and .=" Profile "]';
        await expect(page.locator(nav_profile_loc)).toBeHidden();
        await page.locator(nav_account_loc).hover();
        await expect(page.locator(nav_profile_loc)).toBeVisible();
        await page.locator(nav_profile_loc).click();
        await expect(page).toHaveURL(/users\/2/);
    });

});