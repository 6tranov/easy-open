import { Validation } from "./validation";

class ExcludedURLManager {
    //#region Field
    private tabIdToExcludedURLsMap: { [index: number]: string[]; };
    //#endregion

    //#region Constructor
    constructor() {
        this.tabIdToExcludedURLsMap = [];
    }
    //#endregion

    isOpenedResults(tabId: number) {
        //#region Input Validation
        Validation.NullUndefinedCheck(tabId, "tabId is null or undefined. (excludedURLManager.ts isOpenedResults)");
        //#endregion
        return this.tabIdToExcludedURLsMap[tabId] !== undefined;
    }
    excludedURLs(tabId: number) {
        //#region Input Validation
        Validation.NullUndefinedCheck(tabId, "tabId is null or undefined. (excludedURLManager.ts excludedURLs)");
        //#endregion
        return Validation.isNullOrUndefined(this.tabIdToExcludedURLsMap[tabId]) ? [] : this.tabIdToExcludedURLsMap[tabId];
    }
    addExcludedURL(tabId: number, newURL: string) {
        //#region Input Validation
        Validation.NullUndefinedCheck(tabId, "tabId is null or undefined. (excludedURLManager.ts addExcludedURL)");
        Validation.NullUndefinedCheck(newURL, "newURL is null or undefined. (excludedURLManager.ts addExcludedURL)");
        //#endregion
        if (!this.isOpenedResults(tabId)) {
            this.tabIdToExcludedURLsMap[tabId] = [newURL];
        } else {
            this.tabIdToExcludedURLsMap[tabId].push(newURL);
        }
    }
}

export { ExcludedURLManager };