import { Game } from "./Game";
import { CategoryDefinition, GameItemGroup } from "./GameCategory";
import {  GameItem } from "./GameItem";
import { Item, ItemImpl } from "./Item";
import { UnitProfile } from "./UnitProfile";

export interface GameItemsHolder extends Item{

    getGameItemsByCategoryAnSubCategory(category:string, gameItemGroup:GameItemGroup):GameItem[]
    getItemCategories():CategoryDefinition[];
    getUnitCategories():CategoryDefinition[];

    getGameItems():GameItem[]
    getUnitProfiles():GameItem[]

    getUnitProfilesBySubCategory(subCategory:string):GameItem[]
    getUnitCategoryById(categoryId:string):CategoryDefinition

   
}


export class GameItemsHolderImp extends ItemImpl implements GameItemsHolder {

    private _gameItemCategories: CategoryDefinition[];
    private _unitCategories: CategoryDefinition[];
    private _gameItems: GameItem[];
    private _unitProfiles:GameItem[];

    constructor(id:string,name:string, gameItemCategories: CategoryDefinition[],  unitCategories: CategoryDefinition[],gameItems:GameItem[],unitProfiles:GameItem[]) {
        super(id,name); 
        this._gameItemCategories = gameItemCategories;
        this._unitCategories = unitCategories;
        this._gameItems=gameItems;
        this._unitProfiles=unitProfiles;
    }
    getUnitCategories(): CategoryDefinition[] {
       return this._unitCategories;
    }
    getUnitCategoryById(categoryId:string): CategoryDefinition {
        const res = this._unitCategories.find ((cat) => cat.getId()==categoryId);
        if(res==undefined)
            throw Error(`Category ${categoryId} doesn't exist`);
        return res;
    }

    
    getUnitProfilesBySubCategory(subCategory: string): GameItem[] {
        return this._unitProfiles.filter ((profile)  => profile.getCategoryValue().subCategory.getId()==subCategory)
    }
    getGameItemsByCategoryAnSubCategory(category: string, subCategory: string): GameItem[] {
        return this._gameItems.filter((gameItem) => 
                gameItem.getCategoryValue().category.getId()==category &&
                gameItem.getCategoryValue().subCategory.getId()==subCategory);

    }

    
  
    getGameItems(): GameItem[] {
        return this._gameItems;
    }
  
    getItemCategories(): CategoryDefinition[] {
        return this._gameItemCategories;
    }

    getUnitProfiles(): GameItem[] {
        return this._unitProfiles;
    }
  


}
