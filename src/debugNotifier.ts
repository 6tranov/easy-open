class DebugNotifier {
    public static enableNotifier: boolean = true;
    public static Notify(detail: string): void {
        if (DebugNotifier.enableNotifier) {
            console.log("Debug:" + detail);
        }
    }
}

export { DebugNotifier };