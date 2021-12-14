import { CONTENT_STATE, contentState } from './contentState';
import {Validation} from './validation';
import {ContentHandler} from './contentHandler';

class ContentEvent {
    //#region Field
    contentStatus: CONTENT_STATE;
    //#endregion

    //#region Constructor
    constructor(contentStatus: CONTENT_STATE) {
        Validation.NullUndefinedCheck(contentStatus, "contentStatus is null or undefined.");
        this.contentStatus = contentStatus;
    }
    //#endregion

    addHandler(contentHandler : ContentHandler) {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            //#region Input Validation
            Validation.NullUndefinedCheck(message,"message is null or undefined.");
            //#endregion
            if (!Validation.isNullOrUndefined(message.contentStatus)) {
                let contentStatus = message.contentStatus;
                if (!ContentEvent.isCorrectContentStatus(contentStatus)) throw new Error(contentStatus + "is not in ContentEvent.contentState.");
                if (contentStatus === this.contentStatus) {
                    delete message.contentStatus;
                    contentHandler(message, sender, sendResponse);
                }
            }
        });
    }
    Trigger(tabId, message, options, responseCallback) {
        //#region Input Validation
        if (Validation.isNullOrUndefined(tabId)) throw new Error("tabId is null or undefined.");
        if (Validation.isNullOrUndefined(message)) {
            message = { contentStatus: this.contentStatus };
        } else {
            if (!Validation.isNullOrUndefined(message.contentStatus)) throw new Error("message.contentStatus is used by ContentEvent. Please use another key.");
            message.contentStatus = this.contentStatus;
        }
        //#endregion
        chrome.tabs.sendMessage(tabId, message, options, responseCallback);
    }

    //#region Instance maker
    static get enableContentScriptEvent() {
        return new ContentEvent(CONTENT_STATE.ENABLE_CONTENT_SCRIPT);
    }
    //#endregion
}

export { ContentEvent };