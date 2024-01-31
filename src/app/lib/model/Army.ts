import {   Item } from "./Item";
import { UnitProfile } from "./UnitProfile";
import {  GameItem } from "./GameItem";
import { CategoryDefinition, GameItemGroup } from "./GameCategory";
import { GameItemsHolder, GameItemsHolderImp } from "./GameItemsHolder";
import { Game, GameFactory, GameImpl } from "./Game";
import { GameList, GameListFactory } from "./GameList";





export interface ArmyHeader extends Item {

}


export interface Army extends GameItemsHolder {
     getGame():Game;
     createList(id:string,name:string,maxPoints:number):GameList;  
     getUnitsByMainSubCategory(subCategory: string): GameItem[]
}



export class ArmyImpl extends GameItemsHolderImp implements Army,ArmyHeader,GameItemsHolder {
    
    private _game :Game;
    

    constructor(id:string,name:string, game:Game,gameItemCategories: CategoryDefinition[],unitCategories: CategoryDefinition[],  gameItems:GameItem[],unitProfiles:GameItem[])  {
        super(id,name,gameItemCategories,unitCategories,gameItems,unitProfiles);
        this._game=game;
    }
    getUnitsByMainSubCategory(subCategory: string): GameItem[] {
        const mainCategory = this._game.getUnitsMainCategory();
        return this.getUnitProfiles().filter( (unit) => 
            unit.getCategoryValue().category.getId()==mainCategory.getId() &&
            unit.getCategoryValue().subCategory.getId() == subCategory)
    }
    
  

    createList(id: string, name: string, maxPoints: number):GameList {
        
        return GameListFactory.creeateNewList(id,name,maxPoints,this)
            
    }

    

    public getGame():Game {
        return this._game;
    }


  
}

