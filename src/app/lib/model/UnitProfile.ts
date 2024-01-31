import { CategoryValue } from "./GameCategory";
import { UnitOptionsSection } from "./UnitOptions";
import { GameItem, GameItemImpl } from "./GameItem";

export const PROFILE="PROFILE"

export interface UnitProfile extends GameItem {

    getUnitOptionsSection(): UnitOptionsSection[];

    
}




export class UnitProfileImp extends GameItemImpl implements UnitProfile {


    private _unitOptionsSections:UnitOptionsSection[];
    
    
    constructor(id: string, name: string,  mainCategoryValue:CategoryValue, baseCost: number, unitOptionsSections: UnitOptionsSection[],maxNumber?:number,minNumber?:number,isSelectable?:boolean,otherCategoryValues?:CategoryValue[]) {
        super(id, 
            name, 
            mainCategoryValue,
            baseCost,
            maxNumber,
            minNumber,
            isSelectable,
            otherCategoryValues,);

        this._unitOptionsSections = unitOptionsSections;
    }
        
        
   getUnitOptionsSection(): UnitOptionsSection[] {
       return this._unitOptionsSections;
   }
}

export class UnitProfileFactory {

  
   
   static build(id: string, name: string,mainCategoryValue:CategoryValue, cost:number,unitOptionsSections:UnitOptionsSection[],maxNumber?:number,minNumber?:number,isSelectable?:boolean,otherCategoryValues?:CategoryValue[]):UnitProfile {

   
    return new UnitProfileImp(
        id,
        name,
        mainCategoryValue,
        cost,
        unitOptionsSections,
        maxNumber,
        minNumber,
        isSelectable,
        otherCategoryValues);
      
    

}


}


