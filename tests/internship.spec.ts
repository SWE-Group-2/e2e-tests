import {test, expect} from '@playwright/test';
import {XPath} from "../XPath";

test.describe('Internship', () => {
    test('User can view and edit individual internship', async ({page}) => {
        await page.goto('/login');
        await page.locator(XPath.getElementById('username')).fill('student');
        await page.locator(XPath.getElementById('password')).fill('hardpass');
        await page.locator(XPath.getElementByType('submit')).click();

        await page.getByRole('button', { name: 'new' }).click()
        await expect(page).toHaveURL('/create-internship');

        // create an internship
        var company = 'Ocean';
        var position = 'Backend';
        var company_link = 'https://www.youtube.com/watch?v=nw0i4BSicsU';
        var deadline = '2024-11-15';

        await page.getByLabel('Company').fill(company);
        await page.getByLabel('Position').fill(position);
        await page.getByLabel('Application Link').fill(company_link);
        const time_period = await page.locator(XPath.getElementById('time-period-input')).locator('option').nth(0).innerText();
        await page.getByLabel('Application Deadline').fill(deadline);
        await page.getByRole('button', { name: 'Submit' }).click();

        await expect(page).toHaveURL(/internships/);
        const internship = await page.locator(XPath.getFirstOccuranceOfAnInternship(position, company, deadline)).first();
        await internship.click();
        await expect(page).toHaveURL(/internship\/[0-9]*/);
        const internship_url= page.url();

        // check all components are visible
        await expect(page.getByText('Internship Information')).toBeVisible();
        await expect(page.getByRole('button', { name: 'edit' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'delete' })).toBeVisible();

        await expect(page.locator('#view-internship').getByRole('img', { name: 'logo' })).toBeVisible();
        await expect(page.getByText(company)).toBeVisible();
        await expect(page.getByText(position)).toBeVisible();
        await expect(page.getByText(company_link)).toBeVisible();
        await expect(page.getByText(time_period)).toBeVisible();
        await expect(page.getByText(deadline)).toBeVisible();
        await expect(page.locator('#view-internship')).toContainText(company);
        await expect(page.locator('#view-internship')).toContainText(position);
        await expect(page.locator('#view-internship')).toContainText(company_link);
        await expect(page.locator('#view-internship')).toContainText(time_period);
        await expect(page.locator('#view-internship')).toContainText(deadline);
        await expect(page.locator('//*[contains(text(), "Author:")]/following-sibling::*[contains(text(), "student")]')).toBeVisible();
        await expect(page.locator('//*[contains(text(), "Author role:")]/following-sibling::*[contains(text(), "Student")]')).toBeVisible();
        await expect(page.locator('//*[contains(text(), "Posted on:")]/following-sibling::*')).toBeVisible();
        await expect(page.locator('//*[contains(text(), "Posted on:")]/following-sibling::*')).toHaveText(/^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/);

        // edit internship
        const internship_id = page.url().substring(page.url().lastIndexOf('/') + 1);
        const pfp = './utils/pfp/luffy.jpg';
        company = 'Pirate';
        position = 'Frontend';
        company_link = 'https://www.youtube.com/watch?v=6gVxrbYZETI';
        deadline = '2024-06-28';

        await page.getByRole('button', { name: 'edit' }).click();
        await expect(page).toHaveURL(`/edit-internship/${internship_id}`);
        await page.getByLabel('Company').click();
        await page.getByLabel('Company').fill(company);
        await page.getByLabel('Position').click();
        await page.getByLabel('Position').fill(position);
        await page.getByLabel('Application Link').press('Tab');
        await page.getByLabel('Application Link').fill(company_link);
        await page.getByLabel('Internship Period').press('Tab');
        await page.getByLabel('Application Deadline').fill(deadline);
        await page.locator('input[type="file"]').click();
        await page.locator('input[type="file"]').setInputFiles(pfp);
        await page.getByRole('button', { name: 'Submit' }).click();

        // check updated internship
        await expect(page).toHaveURL(/internships/);
        await page.goto(internship_url);
        await expect(page.locator('#view-internship')).toContainText(company);
        await expect(page.locator('#view-internship')).toContainText(position);
        await expect(page.locator('#view-internship')).toContainText(company_link);
        await expect(page.locator('#view-internship')).toContainText(time_period);
        await expect(page.locator('#view-internship')).toContainText(deadline);
        await expect(page.locator('//*[@class="photo"]//img[@src]')).toBeVisible();

        await page.getByRole('button', { name: 'delete' }).click();
        await expect(page).toHaveURL(/internships/);

    });

});