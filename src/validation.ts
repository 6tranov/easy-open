class Validation {
    public static NullUndefinedCheck(object: any, errorMessage: string): void {
        if (typeof object === "undefined" || object === null) {
            throw new Error(errorMessage);
        }
    }
}

export { Validation };