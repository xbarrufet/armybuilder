import { Item, ItemFactory, ItemImpl } from "./Item";




export enum GameItemGroup { WARGEAR="WARGEAR",ENHANCEMENT="ENHANCEMENT",UNIT_PROFILE="PROFILE",MOUNT="MOUNT",EMPTY="EMPTY"}


export type CategoryValue = {
    category:Item,
    subCategory:Item
}


export interface CategoryDefinition extends Item{
    getSubCategories(filter?:string[]):Item[];
    

}




export class CategoryDefinitionImpl extends ItemImpl implements CategoryDefinition  {
    private _subCategories:Item[];
    constructor(id:string,name:string, subCategories?:Item[]|undefined) {
        super(id,name);
        this._subCategories=subCategories==undefined?[]:subCategories;
    }

    getSubCategories(filter?:string[]):Item[] {
        if(filter==undefined || filter.length==0)
            return this._subCategories;
        else
            return this._subCategories.filter((subcategory) => filter.includes(subcategory.getId() ));
    }



}








export class CategoryFactory {

    static EMPTY_CATAGORY_VALUE = {  category:ItemFactory.EMPTY_ITEM ,subCategory:ItemFactory.EMPTY_ITEM};


    static buildCategoryDefinition(categoryId:string,categoryName:string , subCategories:Item[]):CategoryDefinition {

        return new CategoryDefinitionImpl(categoryId,categoryName, subCategories);
    }

   
    static buildCategoryValue( categoryId:string, categoryName:string,subCategoryId:string,subCategoryName:string) {
        return {category:new ItemImpl(categoryId,categoryName),subCategory:new ItemImpl(subCategoryId,subCategoryName)};
    }
   
}