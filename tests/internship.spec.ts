import {test, expect} from '@playwright/test';
import {XPath} from "../XPath";
import { time } from 'console';

test.describe('Internship List', () => {
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

        await internship.click();
        await page.getByRole('button', { name: 'delete' }).click()

    });
});


