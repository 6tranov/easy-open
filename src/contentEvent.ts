import { CONTENT_STATE, ContentState } from './contentState';
import { Validation } from './validation';
import { ContentHandler } from './contentHandler';

class ContentEvent {
    //#region Field
    contentStatus: CONTENT_STATE;
    //#endregion

    //#region Constructor
    constructor(contentStatus: CONTENT_STATE) {
        Validation.NullUndefinedCheck(contentStatus, "contentStatus is null or undefined. (contentEvent.ts constructor)");
        this.contentStatus = contentStatus;
    }
    //#endregion

    //#region Function
    addHandler(contentHandler: ContentHandler) {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            //#region Input Validation
            Validation.NullUndefinedCheck(message, "message is null or undefined. (contentEvent.ts addHandler)");
            if (Validation.isNullOrUndefined(message.contentStatus)) return;
            if (!ContentState.isCorrectContentStatus(message.contentStatus)) throw new Error(message.contentStatus + " is not correct ContentState. (contentEvent.ts addHandler)");
            //#endregion
            //#region Initialization
            let contentStatus = message.contentStatus;
            //#endregion
            if (contentStatus === this.contentStatus) {
                delete message.contentStatus;
                contentHandler(message, sender, sendResponse);
            }
        });
    }
    Trigger(tabId: any, message: any, options: any, responseCallback) {
        //#region Input Validation
        Validation.NullUndefinedCheck(tabId, "tabId is null or undefined. (contentEvent.ts Trigger)")
        if (!Validation.isNullOrUndefined(message.contentStatus)) throw new Error("message.contentStatus is used by ContentEvent. Please use another key. (contentEvent.ts Trigger)");
        //#endregion
        message.contentStatus = this.contentStatus;
        chrome.tabs.sendMessage(tabId, message, options, responseCallback);
    }
    //#endregion

    //#region Instance maker
    static get enableContentScriptEvent() {
        return new ContentEvent(CONTENT_STATE.ENABLE_CONTENT_SCRIPT);
    }
    //#endregion
}

export { ContentEvent };