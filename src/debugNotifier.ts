class DebugNotifier {
    public static enableNotifier: boolean = false;
    public static Notify(detail: string): void {
        if (DebugNotifier.enableNotifier) {
            alert("Debug:" + detail);
        }
    }
}

export { DebugNotifier };