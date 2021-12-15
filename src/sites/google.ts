import { BackgroundEvent } from '../backgroundEvent';
import { ContentEvent } from '../contentEvent';
import { PageActionMaker } from '../pageActionMaker';
import { DebugNotifier } from '../debugNotifier';

DebugNotifier.Notify("google.ts");


BackgroundEvent.enablePageActionEvent.Trigger(null, {}, null, null);
ContentEvent.enableContentScriptEvent.addHandler(new PageActionMaker(getURLs, null).contentHandler);


//#region Functions
function getURLs(_message: any, _sender: any, _sendRespons: any): string[] {
    let URLs: string[] = new Array<string>();

    let elements = document.getElementsByTagName("a");
    for (let i = 0; i < elements.length; i++) {
        if (
            elements[i].getAttribute("href") != null &&
            elements[i].getAttribute("data-ved") != null &&
            elements[i].getAttribute("ping") != null
        ) {
            let url = elements[i].getAttribute("href");
            URLs.push(url);
        }
    }

    return removeDuplicateURL(URLs);
}
function removeDuplicateURL(URLs: string[]): string[] {
    let result = new Array<string>();
    for (let i = 0; i < URLs.length; i++) {
        if (!result.includes(URLs[i])) {
            result.push(URLs[i]);
        }
    }
    return result;
}
//#endregion