import { BackgroundEvent } from './backgroundEvent';
import { ExcludedURLManager } from './excludedUrlManager';
import { Validation } from './validation';
import { ContentEvent } from './contentEvent';


let eum = new ExcludedURLManager();

BackgroundEvent.enablePageActionEvent.addHandler(func1);
BackgroundEvent.openURLsWhenSingleTabEvent.addHandler(func2);
BackgroundEvent.openURLsWhenMultipleTabsEvent.addHandler(func3);
BackgroundEvent.notifyNoContentToOpenEvent.addHandler(func4);

chrome.pageAction.onClicked.addListener(clickIcon);


//#region Functions
function func1(_message: any, sender: any, _sendResponse: any) {
    //#region Input Validation
    Validation.NullUndefinedCheck(sender, "sender is null or undefined");
    Validation.NullUndefinedCheck(sender.tab, "sender.tab is null or undefined.");
    Validation.NullUndefinedCheck(sender.tab.id, "sender.tab.id is null or undefined.");
    Validation.NumberCheck(sender.tab.id, "typeof sender.tab.id is not number");
    //#endregion
    let tabId: number = sender.tab.id;
    enablePageAction(tabId);

    //#region Local Functions
    function enablePageAction(tabId: number) {
        //#region Input Validation
        if (Validation.isNullOrUndefined(tabId)) throw new Error("tabId is null or undefined.");
        //#endregion
        disablePopup(tabId);
        chrome.pageAction.show(tabId, null);
        //#region Local Functions
        function disablePopup(tabId) {
            //#region Input Validation
            if (Validation.isNullOrUndefined(tabId)) throw new Error("tabId is null or undefined.");
            //#endregion
            chrome.pageAction.setPopup({ popup: "", tabId: tabId });
        }
        //#endregion
    }
    //#endregion
}
function func2(message, sender, _sendResponse) {
    //#region Input Validation
    if (Validation.isNullOrUndefined(sender)) throw new Error("sender is null or undefined.");
    if (Validation.isNullOrUndefined(sender.tab)) throw new Error("sender.tab is null or undefined.");
    let tab = sender.tab;
    if (Validation.isNullOrUndefined(message.newURLs)) throw new Error("message.newURLs is null or undefined.");
    let newURLs = message.newURLs;
    //#endregion
    openURLs(tab, newURLs, true);
}
function func3(message, sender, _sendResponse) {
    //#region Input Validation
    if (Validation.isNullOrUndefined(sender)) throw new Error("sender is null or undefined.");
    if (Validation.isNullOrUndefined(sender.tab)) throw new Error("sender.tab is null or undefined.");
    let tab = sender.tab;
    if (Validation.isNullOrUndefined(message.newURLs)) throw new Error("message.newURLs is null or undefined.");
    let newURLs = message.newURLs;
    //#endregion
    openURLs(tab, newURLs, false);
}
function func4(_message, _sender, _sendResponse) {
    notifyNoContentToOpen();
    //#region Local Functions
    function notifyNoContentToOpen() {
        alert('開くコンテンツがありません。');
    }
    //#endregion
}
function openURLs(tab, URLs, isSingleTab) {
    //#region Input Validation
    if (Validation.isNullOrUndefined(tab)) throw new Error("tab is null or undefined.");;
    if (Validation.isNullOrUndefined(tab.id)) throw new Error("tab.id is null or undefined.");
    let tabId = tab.id;
    if (Validation.isNullOrUndefined(URLs)) throw new Error("URLs is null or undefined.");
    if (Validation.isNullOrUndefined(URLs.length)) throw new Error("URLs.length is null or undefined.");
    if (Validation.isNullOrUndefined(isSingleTab)) throw new Error("isSingleTab is null or undefined.");
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
    function hilight(windowId, newOpenedURLsLength) {
        //#region Input Validation
        if (Validation.isNullOrUndefined(windowId)) throw new Error("windowId is null or undefined.");
        //#endregion
        chrome.tabs.query({ windowId: windowId }, (tabs) => {
            let index = tabs.length - newOpenedURLsLength;
            chrome.tabs.highlight({ tabs: index });
        });
    }
    function open(url, fromTab, callback) {
        //#region Input Validation
        if (Validation.isNullOrUndefined(url)) throw new Error("url is null or undefined.");
        if (Validation.isNullOrUndefined(fromTab)) throw new Error("fromTab is null or undefined.");
        if (Validation.isNullOrUndefined(fromTab.windowId)) throw new Error("fromTab.windowId is null or undefined.");
        if (Validation.isNullOrUndefined(callback)) throw new Error("callback is null or undefined.");
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
function clickIcon(tab) {
    //#region Input Validation
    if (Validation.isNullOrUndefined(tab)) throw new Error("tab is null or undefined.");
    if (Validation.isNullOrUndefined(tab.id)) throw new Error("tab.id is null or undefined.");
    if (Validation.isNullOrUndefined(tab.windowId)) throw new Error("tab.windowId is null or undefined.");
    let tabId = tab.id;
    let windowId = tab.windowId;
    let excludedURLs = eum.excludedURLs(tabId);
    //#endregion
    chrome.tabs.query({ windowId: windowId }, (tabs) => {
        ContentEvent.enableContentScriptEvent.Trigger(tabId, { excludedURLs: excludedURLs, tabLength: tabs.length }, null, null);
    });
}
//#endregion