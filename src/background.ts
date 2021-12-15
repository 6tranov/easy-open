import { BackgroundEvent } from './backgroundEvent';
import { ExcludedURLManager } from './excludedUrlManager';
import { Validation } from './validation';
import { ContentEvent } from './contentEvent';


let eum = new ExcludedURLManager();

BackgroundEvent.enablePageActionEvent.addHandler(enablePageActionHandler);
BackgroundEvent.openURLsWhenSingleTabEvent.addHandler(openURLsWhenSingleTabHandler);
BackgroundEvent.openURLsWhenMultipleTabsEvent.addHandler(openURLsWhenMultipleTabsHandler);
BackgroundEvent.notifyNoContentToOpenEvent.addHandler(notifyNoContentToOpenHandler);

chrome.pageAction.onClicked.addListener(clickIcon);


//#region Functions
function enablePageActionHandler(_message: any, sender: any, _sendResponse: any) {
    //#region Input Validation
    Validation.NullUndefinedCheck(sender, "sender is null or undefined");
    Validation.NullUndefinedCheck(sender.tab, "sender.tab is null or undefined.");
    Validation.NullUndefinedCheck(sender.tab.id, "sender.tab.id is null or undefined.");
    Validation.numberCheck(sender.tab.id, "typeof sender.tab.id is not number.");
    //#endregion
    let tabId: number = sender.tab.id;
    enablePageAction(tabId);

    //#region Local Functions
    function enablePageAction(tabId: number) {
        //#region Input Validation
        Validation.NullUndefinedCheck(tabId, "tabId is null or undefined.");
        Validation.numberCheck(tabId, "tabId is not number.");
        //#endregion
        disablePopup(tabId);
        chrome.pageAction.show(tabId, null);

        //#region Local Functions
        function disablePopup(tabId: number) {
            //#region Input Validation
            Validation.NullUndefinedCheck(tabId, "tabId is null or undefined.");
            Validation.numberCheck(tabId, "tabId is not number.");
            //#endregion
            chrome.pageAction.setPopup({ popup: "", tabId: tabId });
        }
        //#endregion
    }
    //#endregion
}
function openURLsWhenSingleTabHandler(message: any, sender: any, _sendResponse: any) {
    //#region Input Validation
    Validation.NullUndefinedCheck(sender, "sender is null or undefined.");
    Validation.NullUndefinedCheck(sender.tab, "sender.tab is null or undefined.");
    Validation.NullUndefinedCheck(message.newURLs, "message.newURLs is null or undefined.");
    //#endregion
    //#region Initialization
    let tab: any = sender.tab;
    let newURLs = message.newURLs;
    //#endregion
    openURLs(tab, newURLs, true);
}
function openURLsWhenMultipleTabsHandler(message: any, sender: any, _sendResponse: any) {
    //#region Input Validation
    Validation.NullUndefinedCheck(sender, "sender is null or undefined.");
    Validation.NullUndefinedCheck(sender.tab, "sender.tab is null or undefined.");
    Validation.NullUndefinedCheck(message.newURLs, "message.newURLs is null or undefined.");
    //#endregion
    //#region Initialization
    let tab: any = sender.tab;
    let newURLs = message.newURLs;
    //#endregion
    openURLs(tab, newURLs, false);
}
function notifyNoContentToOpenHandler(_message: any, _sender: any, _sendResponse: any) {
    notifyNoContentToOpen();
}
function clickIcon(tab: any) {
    //#region Input Validation
    Validation.NullUndefinedCheck(tab, "tab is null or undefined.");
    Validation.NullUndefinedCheck(tab.id, "tab.id is null or undefined.");
    Validation.NullUndefinedCheck(tab.windowId, "tab.windowId is null or undefined.");
    //#endregion
    //#region Initialization
    let tabId = tab.id;
    let windowId = tab.windowId;
    let excludedURLs = eum.excludedURLs(tabId);
    //#endregion
    chrome.tabs.query({ windowId: windowId }, (tabs) => {
        ContentEvent.enableContentScriptEvent.Trigger(tabId, { excludedURLs: excludedURLs, tabLength: tabs.length }, null, null);
    });
}
function notifyNoContentToOpen() {
    alert('開くコンテンツがありません。');
}
function openURLs(tab: any, URLs, isSingleTab: boolean) {
    //#region Input Validation
    Validation.NullUndefinedCheck(tab, "tab is null or undefined.");
    Validation.NullUndefinedCheck(tab.id, "tab.id is null or undefined.");
    Validation.NullUndefinedCheck(URLs, "URLs is null or undefined.");
    Validation.NullUndefinedCheck(URLs.length, "URLs.length is null or undefined.");
    Validation.NullUndefinedCheck(isSingleTab, "isSingleTab is null or undefined.");
    //#endregion
    //#region Initialization
    let tabId = tab.id;
    //#endregion
    if (URLs.length == 0) {
        notifyNoContentToOpen();
        return;
    }
    //一度も開いたことのない、かつタブが2つ以上の場合は、まず新しいウィンドウにタブを移動させる。
    if (!eum.isOpenedResults(tabId) && !isSingleTab) {
        chrome.windows.create({ tabId: tabId });
    }
    let lengthBeforeOpening = eum.excludedURLs(tabId).length;
    //全てのタブを開く。開いたものは自動的にMapに登録される。
    for (let i = 0; i < URLs.length; i++) {
        open(URLs[i], tab, _tab => {
            //最後のタブが開き終わったら、ハイライトを新しく開くタブの内最初のものに設定する。
            //tabのwindowIdは、以下のようにして改めて取得する必要がある。
            if (i === URLs.length - 1) {
                let lengthAfterOpening = eum.excludedURLs(tabId).length;
                let length = lengthAfterOpening - lengthBeforeOpening;
                chrome.tabs.get(tabId, tab => {
                    hilight(tab.windowId, length);
                });
            }
        });
    }
    //#region Local Functions
    function hilight(windowId: number, newOpenedURLsLength: number) {
        //#region Input Validation
        Validation.NullUndefinedCheck(windowId, "windowId is null or undefined.");
        //#endregion
        chrome.tabs.query({ windowId: windowId }, (tabs) => {
            let index = tabs.length - newOpenedURLsLength;
            chrome.tabs.highlight({ tabs: index });
        });
    }
    function open(url: string, fromTab: any, callback) {
        //#region Input Validation
        Validation.NullUndefinedCheck(url, "url is null or undefined.");
        Validation.NullUndefinedCheck(fromTab, "fromTab is null or undefined.");
        Validation.NullUndefinedCheck(fromTab.windowId, "fromTab.windowId is null or undefined.");
        Validation.NullUndefinedCheck(callback, "callback is null or undefined.");
        //#endregion
        chrome.tabs.create({ url: url }, tab => {
            if (Validation.isNullOrUndefined(tab)) alert('tab is null or undefined');
            if (Validation.isNullOrUndefined(tab)) throw new Error("tab is null or undefined.");
            if (Validation.isNullOrUndefined(tab.id)) throw new Error("tab.id is null or undefined.");
            eum.addExcludedURL(fromTab.id, url);
            callback(tab);
        });
    }
    //#endregion
}
//#endregion