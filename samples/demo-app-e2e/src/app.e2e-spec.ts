import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should display title', () => {
        void page.navigateTo();

        void expect(page.getTitleText()).toEqual('NG-CONFIG Demo');
    });

    it(`should display 'appOptions.name' text`, () => {
        void page.navigateTo();

        void expect(page.getMapTypeSectionText()).toEqual('ng-config-demo');
    });

    it(`should display 'childOptions.key1' text`, () => {
        void page.navigateTo();

        void expect(page.getMapObjectSectionText()).toEqual('a');
    });

    it(`should display 'configValue' text`, () => {
        void page.navigateTo();

        void expect(page.getGetValueSectionText()).toEqual('value1');
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(
            jasmine.objectContaining({
                level: logging.Level.SEVERE
            } as logging.Entry)
        );
    });
});
