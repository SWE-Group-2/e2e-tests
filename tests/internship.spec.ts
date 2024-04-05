import {test, expect} from '@playwright/test';
import {XPath} from "../XPath";
import { time } from 'console';

test.describe('Internships', ()    => {
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
        await page.getByLabel('Company').fill('Agoda');
        await page.getByLabel('Position').fill('QA');
        await page.getByLabel('Application Link').fill('www.agoda.com');
        await page.getByLabel('Internship Period').selectOption('1');
        const time_period = await page.locator(XPath.getElementById('time-period-input')).innerText();
        await page.getByLabel('Application Deadline').fill('2024-07-20');
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page).toHaveURL('/create-internship');

        const internship = page.locator(XPath.getElementByClass('internship-card')).first();
        await expect(internship).toBeVisible();
        await expect(internship.locator(XPath.getElementByClass('company-offer'))).toHaveText('QA');
        await expect(internship.locator(XPath.getElementByClass('company-info')).first()).toHaveText('@ Agoda'); // company
        await expect(internship.locator(XPath.getElementByClass('company-info')).nth(1)).toHaveText(time_period); // time period
        await expect(internship.locator(XPath.getElementByClass('company-info')).nth(2)).toHaveText('2024-07-20'); // deadline

        await internship.click();
        await page.getByRole('button', { name: 'delete' }).click()

    });
});
