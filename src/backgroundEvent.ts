import {BACKGROUND_STATE,BackgroundState} from './backgroundState';

class BackgroundEvent {
    //#region Field
    backgroundStatus: BACKGROUND_STATE;
    //#endregion

    //#region Constructor
    constructor(backgroundStatus: BACKGROUND_STATE) {
        this.backgroundStatus = backgroundStatus;
    }
    //#endregion

    static isCorrectBackgroundStatus(status) {
        return Object.values(BackgroundEvent.backgroundState).includes(status);
    }
    addHandler(backgroundHandler) {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            //#region Input Validation
            if (Validation.isNullOrUndefined(message)) throw new Error("message is null or undefined.");
            //#endregion
            if (!Validation.isNullOrUndefined(message.backgroundStatus)) {
                let backgroundStatus = message.backgroundStatus;
                if (!BackgroundEvent.isCorrectBackgroundStatus(backgroundStatus)) throw new Error(backgroundStatus + "is not in BackgroundEvent.backgroundState.");
                if (backgroundStatus === this.backgroundStatus) {
                    delete message.backgroundStatus;
                    backgroundHandler(message, sender, sendResponse);
                }
            }
        });
    }
    Trigger(extensionId, message, options, responseCallBack) {
        //#region Input Validation
        if (Validation.isNullOrUndefined(message)) {
            message = { backgroundStatus: this.backgroundStatus };
        } else {
            if (!Validation.isNullOrUndefined(message.backgroundStatus)) throw new Error("message.backgroundStatus is used by BackgroundEvent. Please use another key.");
            message.backgroundStatus = this.backgroundStatus;
        }
        //#endregion
        chrome.runtime.sendMessage(extensionId, message, options, responseCallBack);
    }

    //#region Instance maker
    static get enablePageActionEvent(): BackgroundEvent {
        return new BackgroundEvent(BACKGROUND_STATE.ENABLE_PAGE_ACTION);
    }
    static get openURLsWhenSingleTabEvent(): BackgroundEvent {
        return new BackgroundEvent(BACKGROUND_STATE.OPEN_URLS_WHEN_SINGLE_TAB);
    }
    static get openURLsWhenMultipleTabsEvent(): BackgroundEvent {
        return new BackgroundEvent(BACKGROUND_STATE.OPEN_URLS_WHEN_MULTIPLE_TABS);
    }
    static get notifyNoContentToOpenEvent(): BackgroundEvent {
        return new BackgroundEvent(BACKGROUND_STATE.NOTIFY_NO_CONTENT_TO_OPEN);
    }
    //#endregion
}