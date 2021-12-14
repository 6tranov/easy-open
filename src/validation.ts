class Validation {
    public static isNullOrUndefined(object : any) {
        return (typeof object === "undefined" || object === null);
    }
}

export { Validation };