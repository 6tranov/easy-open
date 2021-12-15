class Validation {
    public static NullUndefinedCheck(object: any, errorMessage: string): void {
        if (Validation.isNullOrUndefined(object)) {
            throw new Error(errorMessage);
        }
    }
    public static isNullOrUndefined(object: any) {
        return (typeof object === "undefined" || object === null);
    }
    public static numberCheck(object: any, errorMessage: string) {
        if (!(typeof object === "number")) {
            throw new Error(errorMessage);
        }
    }
    public static stringCheck(object: any, errorMessage: string) {
        if (!(typeof object === "string")) {
            throw new Error(errorMessage);
        }
    }
}

export { Validation };