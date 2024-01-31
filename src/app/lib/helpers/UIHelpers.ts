import { Item } from "../model/Item";

export class UIHelpers {

    static getItemsArrayNames(items: Item[]) {
        if(items==undefined || items.length==0)
            return ""
        var res = items[0].getName();
        items = items.slice(1);
        items.forEach((item) => res = res.concat(', ' + item.getName()));
        return res;
    }

}