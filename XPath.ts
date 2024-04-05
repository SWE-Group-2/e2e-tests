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
}

