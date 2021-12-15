enum CONTENT_STATE {
    ENABLE_CONTENT_SCRIPT
}

class ContentState{
    public static isCorrectContentStatus(status: CONTENT_STATE) {
        return Object.values(CONTENT_STATE).includes(status);
    }
}

export { CONTENT_STATE, ContentState };