import { BackgroundEvent } from '../backgroundEvent';
import { ContentEvent } from '../contentEvent';
import { PageActionMaker } from '../pageActionMaker';

BackgroundEvent.enablePageActionEvent.Trigger(null, {}, null, null);
ContentEvent.enableContentScriptEvent.addHandler(new PageActionMaker(getURLs, null).contentHandler);

//#region Functions
function getURLs(_message: any, _sender: any, _sendRespons: any): string[] {
    let URLs: string[] = new Array<string>();

    let elements = document.getElementsByTagName('a');
    for (let i = 0; i < elements.length; i++) {
        if (
            elements[i].getAttribute("class") == "question-hyperlink" &&
            elements[i].getAttribute('href') != null
        ) {
            URLs.push(elements[i].getAttribute('href'));
        }
    }
    for (let i = 0; i < URLs.length; i++) {
        URLs[i] = "https://stackoverflow.com" + URLs[i];
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