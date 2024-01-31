import { CategoryValue } from "./GameCategory";
import { Item, ItemImpl } from "./Item";


export interface CategorizedItem extends Item {
    getCategoryValue():CategoryValue;
    getOtherCategoriesValues():CategoryValue[]
}


export class CategorizedItemImpl extends ItemImpl implements CategorizedItem{
    private _categoryValue:CategoryValue;
    private _otherCategoryValues:CategoryValue[]=[]
    
    constructor(id:string,name:string, categoryValue:CategoryValue,otherCategoryValues?:CategoryValue[]) {
        super(id,name)
        this._categoryValue=categoryValue;
        if(otherCategoryValues!=undefined)
            this._otherCategoryValues=otherCategoryValues;

    }

    getCategoryValue(): CategoryValue {
        return this._categoryValue
    }

    getOtherCategoriesValues(): CategoryValue[] {
        return this._otherCategoryValues;
    }

}
