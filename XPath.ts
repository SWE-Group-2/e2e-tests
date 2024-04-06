export class XPath {
    static getElement(element: string): string {
        return `//${element}`;
    }

    static getElementByAttribute(element: string, attribute: string, value: string): string {
        return `//${element}[@${attribute}="${value}"]`;
    }

    static getElementByAttributes(element: string, attributeMap: { [key: string]: string }): string {
        return `//${element}${Object.keys(attributeMap).map(key => `[@${key}="${attributeMap[key]}"]`).join('')}`;
    }

    static getElementById(id: string): string {
          return this.getElementByAttribute('*', 'id', id);
    }

    static getElementByType(type: string): string {
        return this.getElementByAttribute('*', 'type', type);
    }

    static getElementByClass(classAttr: string): string {
        return this.getElementByAttribute('*', 'class', classAttr);
    }

    // There can be duplicate internship information. So, this doesn't guarantee it's the internship a user just created
    // even if it's presented first because it's technically possible for another user to create another one with the same info right before.
    // This mess can be simplified or get rid of entirely if frontend label things more with attributes.
    static getFirstOccuranceOfAnInternship(position: string, company: string, deadline: string): string {
        return `//div[@class="internship-card"]//descendant::span[@class="company-offer" and text()="${position}"]/following-sibling::span[text()=" @ ${company}"]/../../descendant::*[contains(., "Deadline")]//span[text()="${deadline}"]/ancestor::div[@class="internship-card"]`
    }
}

