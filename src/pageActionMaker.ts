import { Validation } from './validation';
import { BackgroundEvent } from './backgroundEvent';
import { IsCorrectPage } from './isCorrectPage';
import { GetURLs } from './getURLs';

class PageActionMaker {
    //#region Field
    private getURLs: GetURLs;
    //#endregion

    //#region Constructor
    constructor(getURLs: GetURLs, isCorrectPage: IsCorrectPage) {
        //#region Input Validation
        Validation.NullUndefinedCheck(getURLs, "getURLs is null or undefined. (pageActionMaker.ts constructor)")
        //#endregion
        this.getURLs = getURLs;

        //#region Input Validation
        if (!Validation.isNullOrUndefined(isCorrectPage)) {
            //#endregion
            this.isCorrectPage = isCorrectPage;
        }
    }
    //#endregion

    static getNewURLs(excludedURLs: string[], URLs: string[]) {
        //#region Inuput Validation
        Validation.NullUndefinedCheck(excludedURLs, "excludedURLs is null or undefined. (pageActionMaker.ts getNewURLs)")
        Validation.NullUndefinedCheck(URLs, "URLs is null or undefined. (pageActionMaker.ts getNewURLs)")
        //#endregion
        //引数のURLsから、既に開いているURLsを取り除く。
        return URLs.filter(url => excludedURLs.indexOf(url) == -1);
    }
    isCorrectPage(_message: any, _sender: any, _sendResponse: any) {
        return true;
    }
    get contentHandler() {
        return (message: any, sender: any, sendResponse: any) => {
            //#region Input Validation
            Validation.NullUndefinedCheck(message, "message is null or undefined. (pageActionMaker.ts contentHandler)")
            //#endregion
            if (!this.isCorrectPage(message, sender, sendResponse)) {
                BackgroundEvent.notifyNoContentToOpenEvent.Trigger(null, {}, null, null);
                return;
            }
            //#region Input Validation
            Validation.NullUndefinedCheck(message.excludedURLs, "message.excludedURLs is null or undefined. (pageActionMaker.ts contentHandler)");
            Validation.NullUndefinedCheck(message.tabLength, "message.tabLength is null or undefined. (pageActionMaker.ts contentHandler)")
            //#endregion
            //#region Initialization
            let excludedURLs = message.excludedURLs;
            let tabLength = message.tabLength;
            let URLs = this.getURLs(message, sender, sendResponse);
            let newURLs = PageActionMaker.getNewURLs(excludedURLs, URLs);
            //#endregion
            //#region Input Validation
            Validation.NullUndefinedCheck(newURLs.length, "newURLs.length is null or undefined. (pageActionMaker.ts contentHandler)");
            //#region
            if (newURLs.length > 0) {
                if (tabLength === 1) {
                    BackgroundEvent.openURLsWhenSingleTabEvent.Trigger(null, { newURLs: newURLs }, null, null);
                } else if (tabLength > 1) {
                    BackgroundEvent.openURLsWhenMultipleTabsEvent.Trigger(null, { newURLs: newURLs }, null, null);
                }
            } else {
                BackgroundEvent.notifyNoContentToOpenEvent.Trigger(null, {}, null, null);
            }
        }
    }
}

export { PageActionMaker };