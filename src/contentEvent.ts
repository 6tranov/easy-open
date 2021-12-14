class ContentEvent{
    constructor(contentStatus){
        this.contentStatus = contentStatus;
    }
    static contentState = {
        enableContentScript:0,
    }
    static isCorrectContentStatus(status){
        return Object.values(ContentEvent.contentState).includes(status);
    }
    addHandler(contentHandler){
        chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
            //#region Input Validation
            if(Validation.isNullOrUndefined(message))throw new Error("message is null or undefined.");
            //#endregion
            if(!Validation.isNullOrUndefined(message.contentStatus)){
                let contentStatus = message.contentStatus;
                if(!ContentEvent.isCorrectContentStatus(contentStatus))throw new Error(contentStatus + "is not in ContentEvent.contentState.");
                if(contentStatus === this.contentStatus){
                    delete message.contentStatus;
                    contentHandler(message,sender,sendResponse);
                }
            }
        });
    }
    Trigger(tabId,message,options,responseCallback){
        //#region Input Validation
        if(Validation.isNullOrUndefined(tabId))throw new Error("tabId is null or undefined.");
        if(Validation.isNullOrUndefined(message)){
            message = {contentStatus:this.contentStatus};
        }else{
            if(!Validation.isNullOrUndefined(message.contentStatus))throw new Error("message.contentStatus is used by ContentEvent. Please use another key.");
            message.contentStatus = this.contentStatus;
        }
        //#endregion
        chrome.tabs.sendMessage(tabId,message,options,responseCallback);
    }
    static get enableContentScript(){
        return new ContentEvent(ContentEvent.contentState.enableContentScript);
    }
}

export {ContentEvent};