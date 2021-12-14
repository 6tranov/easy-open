class Validation {
    public static NullUndefinedCheck(object: any, errorMessage: string): void {
        if (Validation.isNullOrUndefined(object)) {
            throw new Error(errorMessage);
        }
    }
    public static isNullOrUndefined(object:any){
        return (typeof object === "undefined" || object === null);
    }
}

export { Validation };