enum BACKGROUND_STATE {
    ENABLE_PAGE_ACTION,
    OPEN_URLS_WHEN_SINGLE_TAB,
    OPEN_URLS_WHEN_MULTIPLE_TABS,
    NOTIFY_NO_CONTENT_TO_OPEN
}

class BackgroundState {
    public static isCorrectBackgroundStatus(status: BACKGROUND_STATE) {
        return Object.values(BACKGROUND_STATE).includes(status);
    }
}

export { BACKGROUND_STATE, BackgroundState };