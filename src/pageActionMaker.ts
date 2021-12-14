import { Validation } from './validation';
import { BackgroundEvent } from './backgroundEvent';
import { IsCorrectPage } from './isCorrectPage';

class PageActionMaker {
    //#region Field
    private getURLs;
    //#endregion

    //#region Constructor
    constructor(getURLs, isCorrectPage: IsCorrectPage) {
        //#region Input Validation
        Validation.NullUndefinedCheck(getURLs, "getURLs is null or undefined.")
        //#endregion
        this.getURLs = getURLs;

        //#region Input Validation
        if (Validation.isNullOrUndefined(isCorrectPage)) return;
        //#endregion
        this.isCorrectPage = isCorrectPage;
    }
    //#endregion

    static getNewURLs(excludedURLs, URLs) {
        //#region Inuput Validation
        Validation.NullUndefinedCheck(excludedURLs, "excludedURLs is null or undefined.")
        Validation.NullUndefinedCheck(URLs, "URLs is null or undefined.")
        //#endregion
        //引数のURLsから、既に開いているURLsを取り除く。
        return URLs.filter(url => excludedURLs.indexOf(url) == -1);
    }
    isCorrectPage(_message: any, _sender: any, _sendResponse: any) {
        return true;
    }
    get contentHandler() {
        return (message, sender, sendResponse) => {
            if (!this.isCorrectPage(message, sender, sendResponse)) {
                BackgroundEvent.notifyNoContentToOpenEvent.Trigger(null, null, null, null);
                return;
            }
            //#region Input Validation
            if (Validation.isNullOrUndefined(message.excludedURLs)) throw new Error("message.excludedURLs is null or undefined.");
            let excludedURLs = message.excludedURLs;
            if (Validation.isNullOrUndefined(message.tabLength)) throw new Error("message.tabLength is null or undefined.");
            let tabLength = message.tabLength;
            let URLs = this.getURLs(message, sender, sendResponse);
            let newURLs = PageActionMaker.getNewURLs(excludedURLs, URLs);
            if (Validation.isNullOrUndefined(newURLs.length)) throw new Error("newURLs.length is null or undefined.");
            //#endregion
            if (newURLs.length > 0) {
                if (tabLength === 1) {
                    BackgroundEvent.openURLsWhenSingleTabEvent.Trigger(null, { newURLs: newURLs }, null, null);
                } else if (tabLength > 1) {
                    BackgroundEvent.openURLsWhenMultipleTabsEvent.Trigger(null, { newURLs: newURLs }, null, null);
                }
            } else {
                BackgroundEvent.notifyNoContentToOpenEvent.Trigger(null, null, null, null);
            }
        }
    }
}

export { PageActionMaker };