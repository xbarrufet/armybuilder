import { ArmyHeader } from "./Army";
import {  Item, ItemImpl } from "./Item";
import { CategoryDefinition } from "./GameCategory";
import {  GameItem } from "./GameItem";
import { GameItemsHolder, GameItemsHolderImp } from "./GameItemsHolder";
import { UnitProfile } from "./UnitProfile";
import { ListValidationRule, ListValidationRuleImpl, ValidationRuleLimits } from "./ListValidationRule";



export interface GameHeader extends Item {
    getArmyHeaders():ArmyHeader[]
    

  
}
export class GameHeaderImpl extends ItemImpl implements GameHeader {
    
    constructor(id:string,name:string) {
        super(id,name)
    }
   
    getArmyHeaders(): ArmyHeader[] {
        throw new Error("Method not implemented.");
    }
}



export interface Game  extends GameItemsHolder {
    getArmyHeaders():ArmyHeader[]
    getUnitsMainCategory():CategoryDefinition
    getListValidationRule():ListValidationRule
 
    
}



export class GameImpl extends GameItemsHolderImp implements Game,GameHeader{


    private _armyHeaders:ArmyHeader[];
    private _unitsMainCategory:string
    private _validationRule:ListValidationRule
    
    constructor(id:string,name:string, armyHeaders:ArmyHeader[],gameItemCategories: CategoryDefinition[],unitsMainCategory:string, unitCategories: CategoryDefinition[], gameItems:GameItem[],unitProfiles:GameItem[], validationRule:ListValidationRule)  {
        super(id,name,gameItemCategories,unitCategories,gameItems,unitProfiles);
        this._armyHeaders=armyHeaders;
        this._unitsMainCategory=unitsMainCategory
        this._validationRule=validationRule;

    }     
    getListValidationRule(): ListValidationRule {
       return this._validationRule;
    }
    getUnitsMainCategory(): CategoryDefinition {
        const cat = this.getUnitCategories().find((cat) => cat.getId()==this._unitsMainCategory);
        if (cat==undefined) 
            throw Error(`Main category ${this._unitsMainCategory} doesn't exist`)
        return cat;
    }

    public  getArmyHeaders():ArmyHeader[] {
        return this._armyHeaders;
    }
   
   
   
}


export class GameFactory {

   
   
}







