import { Item } from "../model/Item";
import { OptionType, UnitOptionsEntry } from "../model/UnitOptions";


/** ITEMS and Categories ************************************************* */

export type ItemDTO = {
    id:string,
    name:string
}


export type CategoryDTO = {
    id:string,
    name:string
    subcategories:ItemDTO[]
}

export type ListValidationRuleDTO = {

    counterType:string,
    limits:{subCategory:string, min?:number|undefined,max?:number|undefined}[]

}
export type GameItemDTO  = {
    id: string,
    name: string,
    cost?:number|undefined;
    mainCategory: CategoryValueDTO,
    otherCategories?:CategoryValueDTO[]|undefined;
    maxNumber?:number,
    minNumber?:number
    isSelectable?:boolean
}

export type UnitProfileDTO  = {
    id: string,
    name: string,
    cost?:number|undefined;
    mainCategory: CategoryValueDTO,
    otherCategories?:CategoryValueDTO[]|undefined;
    maxNumber?:number,
    minNumber?:number,
    isSelectable?:boolean,
    optionSections?:UnitOptionsSectionDTO[]
}


export type CategoryDefitionDTO ={
    id:string,
    name:string,
    gameItemGroup?:string|undefined;
    subCategories?:ItemDTO[]|undefined
}

export type CategoryValueDTO =  {
    category:string,
    subCategory:string
}


/** GAME AND ARMY************************************************* */



/** OPTIONS************************************************* */


export type UnitOptionsSectionDTO ={
    sectionName:string,
    optionType:string,
    target:string,
    optionEntries:UnitOptionsEntryDTO[],
    maxCost?:number|undefined,
    feedingCategory?:string|undefined;
   
}


export type UnitOptionsEntryDTO = {
    id:string,
    items:string[],
    cost?:number|undefined,
    selected?:boolean|undefined;
    childOptionSections?:UnitOptionsSectionDTO[]|undefined
    costPerModel?:boolean|undefined
}
