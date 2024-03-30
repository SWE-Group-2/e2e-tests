import {faker} from "@faker-js/faker";

export function generateRandomUsername(): string {
    return faker.internet.userName();
}