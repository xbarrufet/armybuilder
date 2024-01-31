import { CategoryValue, } from "./GameCategory";
import { Item,ItemImpl } from "./Item";





export interface GameItem extends Item {
   
   
    getCost():number;
    getMaxNumber():number;
    getMinNumber():number;
    getCategoryValue():CategoryValue;
    getOtherCategoriesValues():CategoryValue[]
    isSelectable():boolean

   
}



export  class GameItemImpl extends ItemImpl implements GameItem {

    private _cost:number;
    private _maxNumber:number=1;
    private _minNumber:number=1;
    private _categoryValue:CategoryValue;
    private _otherCategoryValues:CategoryValue[]=[]
    private _isSelectable:boolean=true;

    constructor(id: string, name: string,categoryValue:CategoryValue,cost:number,maxNumber?:number,minNumber?:number,isSelectable?:boolean|undefined,otherCategoryValues?:CategoryValue[]) {
       super(id,name);
        this._cost=cost;
        if(maxNumber!=undefined)
            this._maxNumber=maxNumber;
        if(minNumber!=undefined)
            this._minNumber=minNumber;
        this._categoryValue=categoryValue;
            if(otherCategoryValues!=undefined)
                this._otherCategoryValues=otherCategoryValues;
        if(isSelectable!=undefined)
            this._isSelectable=isSelectable;
    }
     

    getCost():number {
        return this._cost;
    }
    getMaxNumber(): number {
        return this._maxNumber
    }

    getMinNumber(): number {
        return this._minNumber
    }

    getCategoryValue(): CategoryValue {
        return this._categoryValue
    }

    getOtherCategoriesValues(): CategoryValue[] {
        return this._otherCategoryValues;
    }

    isSelectable(): boolean {
        return this._isSelectable;
    }

}

export class GameItemFactory {

    static buildGameItem(id: string, name: string,mainCategoryValue:CategoryValue,cost:number,maxNumber?:number,minNumber?:number,isSelectable?:boolean,otherCategoryValues?:CategoryValue[]) {
        return new GameItemImpl(id,name,mainCategoryValue,cost,maxNumber,minNumber,isSelectable,otherCategoryValues);
    }
        
}




