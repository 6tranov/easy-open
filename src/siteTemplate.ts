import { BackgroundEvent } from '../backgroundEvent';
import { ContentEvent } from '../contentEvent';
import { PageActionMaker } from '..package-lock.json/pageActionMaker';

BackgroundEvent.enablePageActionEvent.Trigger(null, null, null, null);
ContentEvent.enableContentScriptEvent.addHandler(new PageActionMaker(getURLs, null).contentHandler);

//#region Functions
function getURLs(_message: any, _sender: any, _sendRespons: any) {
    let URLs: string[] = new Array<string>();

    return URLs;
}
//#endregion