import { browser, by, element } from 'protractor';

export class AppPage {
    navigateTo(): Promise<unknown> {
        return browser.get(browser.baseUrl) as Promise<unknown>;
    }

    getTitleText(): Promise<string> {
        return element(by.css('app-root header h1')).getText() as Promise<string>;
    }

    getMapTypeSectionText(): Promise<string> {
        return element(by.css('app-root section .app-options-name')).getText() as Promise<string>;
    }

    getMapObjectSectionText(): Promise<string> {
        return element(by.css('app-root section .child-options-key1')).getText() as Promise<string>;
    }

    getGetValueSectionText(): Promise<string> {
        return element(by.css('app-root section .key1')).getText() as Promise<string>;
    }
}
