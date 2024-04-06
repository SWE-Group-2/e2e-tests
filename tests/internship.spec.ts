import {test, expect} from '@playwright/test';
import {XPath} from "../XPath";

test.describe('Internship List', () => {
    test('User can view internship list', async ({page}) => {
        await page.goto('/login');
        await page.locator(XPath.getElementById('username')).fill('student');
        await page.locator(XPath.getElementById('password')).fill('hardpass');
        await page.locator(XPath.getElementByType('submit')).click();

        await page.goto('/internships');
        await expect(page).toHaveURL(/internships/);

        // can see internship list
        await expect(page.locator('div').filter({ hasText: /^Internships$/ })).toBeVisible();
        await expect(page.getByRole('button', { name: 'new' })).toBeVisible();

        const internship = page.locator(XPath.getElementByClass('internship-card')).first();
        await expect(internship).toBeVisible();
        await expect(internship.locator(XPath.getElementByClass('company-offer'))).toBeVisible();
        await expect(internship.locator(XPath.getElementByClass('company-info')).first()).toBeVisible(); // company
        await expect(internship.locator(XPath.getElementByClass('company-info')).nth(1)).toBeVisible(); // time period
        await expect(internship.locator(XPath.getElementByClass('company-info')).nth(2)).toBeVisible(); // deadline

        // can see and click on sort and filter
        const sort_selection = page.getByRole('combobox').nth(0);
        const filter_selection = page.getByRole('combobox').nth(1);

        await expect(sort_selection).toBeVisible();
        await expect(sort_selection.locator('option').nth(0)).toContainText('Sort by Created');
        await expect(sort_selection.locator('option').nth(1)).toContainText('Sort by Deadline');

        await expect(filter_selection).toBeVisible();
        await expect(filter_selection.locator('option').nth(0)).toContainText('Position');
        await expect(filter_selection.locator('option').nth(1)).toContainText('Company');
        await expect(filter_selection.locator('option').nth(2)).toContainText('Time Period');
        await expect(filter_selection.locator('option').nth(3)).toContainText('Flagged');
        
        await expect(page.getByRole('button', { name: 'Filter' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible()

        await expect(page.getByRole('textbox')).toBeHidden();
        await filter_selection.selectOption('company');
        await expect(page.getByRole('textbox')).toBeVisible();
        await filter_selection.selectOption('time_period');
        await page.getByRole('combobox').nth(2).selectOption('T3 2023-2024');
        await expect(page.getByRole('combobox').nth(2)).toHaveValue('T3 2023-2024');
        await filter_selection.selectOption('flagged');
        await expect(page.getByRole('combobox').nth(2).locator('option').nth(0)).toHaveText('Flagged');
        await expect(page.getByRole('combobox').nth(2).locator('option').nth(1)).toHaveText('Not Flagged');
        await page.getByRole('combobox').nth(2).selectOption('Not Flagged');
        await expect(page.getByRole('combobox').nth(2)).toHaveValue('false');
        await filter_selection.selectOption('position');
        await expect(page.getByRole('textbox')).toBeVisible();
    });


    test('User can create and delete internships', async ({page}) => {
        await page.goto('/login');
        await page.locator(XPath.getElementById('username')).fill('student');
        await page.locator(XPath.getElementById('password')).fill('hardpass');
        await page.locator(XPath.getElementByType('submit')).click();

        await page.getByRole('button', { name: 'new' }).click()
        await expect(page).toHaveURL('/create-internship');

        await expect(page.getByLabel('Company')).toBeVisible();
        await expect(page.getByLabel('Position')).toBeVisible();
        await expect(page.getByLabel('Application Link')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
        await expect(await page.getByLabel('Internship Period')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();

        const company = 'Agoda';
        const position = 'QA';
        const company_link = 'www.agoda.com';
        const deadline = '2024-07-20';

        await page.getByLabel('Company').fill(company);
        await page.getByLabel('Position').fill(position);
        await page.getByLabel('Application Link').fill(company_link);
        await page.getByLabel('Internship Period').selectOption('1');
        const time_period = await page.locator(XPath.getElementById('time-period-input')).locator('option').nth(0).innerText();
        await page.getByLabel('Application Deadline').fill(deadline);
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page).toHaveURL('/create-internship');

        // const internship = await page.getByRole('link', { name: 'logo QA @ Agoda Internship Period: T3 2023-2024 Application Deadline: 2024-07-20' }).first();
        const internship = page.locator(XPath.getFirstOccuranceOfAnInternship(position, company, deadline)).first();
        await expect(internship).toBeVisible();
        await expect(internship.locator(XPath.getElementByClass('company-offer'))).toHaveText('QA');
        await expect(internship.locator(XPath.getElementByClass('company-info')).first()).toHaveText(` @ ${company}`); // company
        await expect(internship.locator(XPath.getElementByClass('company-info')).nth(1)).toHaveText(time_period); // time period
        await expect(internship.locator(XPath.getElementByClass('company-info')).nth(2)).toHaveText('2024-07-20'); // deadline

        /**
         * delete the internship
         * 
         * Id of internships cannot be obtained from the internship list or during the internship creation process,
         * so there is no way to make sure the identified internship is actually the internship that was just created if another user
         * created the same one right before, which is basically like a race condition. In which case, currently there is no way to identify
         * if this is truly the internship created by the user. So it's possible that the delete button may not be accessible
         *if it's an intenship with the same information but was created by a different user
         **/
        await internship.click();
        await expect(page).toHaveURL(/internship\/[0-9]+/);
        const internship_id = page.url().substring(page.url().lastIndexOf('/') + 1);
        await expect(page.getByRole('button', { name: 'delete' })).toBeVisible();
        await page.getByRole('button', { name: 'delete' }).click();

        // Check if an internship with the same info is in the list. If it is not then the internship was deleted.
        // If an internship with that info still exists, then check that it doesn't have the same id as the deleted internship.
        await expect(page).toHaveURL(/internships/);
        if (await internship.isVisible()) {
            await internship.click();
            await expect(page.url().endsWith(`/${internship_id}`)).toBeFalsy();
        }
    });

    test('Sort and filter internships work properly', async ({page}) => {

    });

    
});



