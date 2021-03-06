import { BACKGROUND_STATE, BackgroundState } from './backgroundState';
import { Validation } from './validation';
import { BackgroundHandler } from './backgroundHandler';

class BackgroundEvent {
    //#region Field
    backgroundStatus: BACKGROUND_STATE;
    //#endregion

    //#region Constructor
    constructor(backgroundStatus: BACKGROUND_STATE) {
        Validation.NullUndefinedCheck(backgroundStatus, "backgroundStatus is null or undefined. (backgroundEvent.ts constructor)");
        this.backgroundStatus = backgroundStatus;
    }
    //#endregion

    //#region Function
    addHandler(backgroundHandler: BackgroundHandler) {
        //#region Input Validation
        Validation.NullUndefinedCheck(backgroundHandler, "backgroundHandler is null or undefined. (backgroundEvent.ts addHandler)");
        //#endregion
        chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
            //#region Input Validation
            Validation.NullUndefinedCheck(message, "message is null or undefined.");
            if (Validation.isNullOrUndefined(message.backgroundStatus)) return;
            if (!BackgroundState.isCorrectBackgroundStatus(message.backgroundStatus)) throw new Error(message.backgroundStatus + "is not correct BackgroundState. (backgroundEvent.ts addHandler)");
            //#endregion
            //#region Initialization
            let backgroundStatus = message.backgroundStatus;
            //#endregion
            if (backgroundStatus === this.backgroundStatus) {
                delete message.backgroundStatus;
                backgroundHandler(message, sender, sendResponse);
            }
        });
    }
    Trigger(extensionId: any, message: any, options: any, responseCallBack) {
        //#region Input Validation
        Validation.NullUndefinedCheck(message, "message is null or undefined. (backgroundEvent.ts Trigger)");
        if (!Validation.isNullOrUndefined(message.backgroundStatus)) throw new Error("message.backgroundStatus is used by BackgroundEvent. Please use another key. (backgroundEvent.ts Trigger)");
        //#endregion
        message.backgroundStatus = this.backgroundStatus;
        chrome.runtime.sendMessage(extensionId, message, options, responseCallBack);
    }
    //#endregion

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

export { BackgroundEvent };