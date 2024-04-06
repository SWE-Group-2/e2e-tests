import {test, expect} from '@playwright/test';
import {XPath} from "../XPath";

test.describe('Student List', () => {
    test('User can view student list', async ({page}) => {
        await page.goto('/login');
        await page.locator(XPath.getElementById('username')).fill('student');
        await page.locator(XPath.getElementById('password')).fill('hardpass');
        await page.locator(XPath.getElementByType('submit')).click();
        
        // navigate to student list via nav bar
        await expect(page).toHaveURL(/internships/);
        const nav_student_loc = '//*[@class="navbar-menu"]//*[contains(text(), "Students")]';
        await page.locator(nav_student_loc).click();
        await expect(page).toHaveURL(/users/);

        const table_headers = page.locator('//*[@class="table-header"]//*')

        await expect(table_headers.nth(0)).toContainText('Username');
        await expect(table_headers.nth(1)).toContainText('Name');
        await expect(table_headers.nth(2)).toContainText('GPA');
        await expect(table_headers.nth(3)).toContainText('Positions');
        await expect(page.locator('#table')).toContainText('student');

    });

    
});
