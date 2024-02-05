import uuid from "react-uuid";
import { UnitProfile, UnitProfileFactory } from "./UnitProfile"
import { Army } from "./Army";
import { Item, ItemImpl } from "./Item";
import {  OptionType, UnitOptionsEntry, UnitOptionsSection } from "./UnitOptions";
import { CategoryDefinition, CategoryValue } from "./GameCategory";
import { GameItem } from "./GameItem";
import { Game } from "./Game";
import { SelectedUnit, SelectedUnitFactory } from "./SelectedUnit";
import { CounterType, ListValidationResult } from "./ListValidationRule";





enum EquipmentType {BASE=0,EXTRA=1}



export interface GameList extends Item{
    
    getMaxPoints():number,
    getNumModels():number ;
    getTotalCost():number;
    getArmy():Army;
    getSelectedUnitById(selectedUnitId:string):SelectedUnit

    
    addUnitProfile(unit:UnitProfile):GameList;
    selectOptionEntry(selectedUnitId:string,optionEntryId:string,value:any):void

    getSelectedUnitsByMainSubCategory(subCategory:string):SelectedUnit[]    
    getSubCategoryCounterText(subCategory:string):string
    getSubCategoryTotalCost(subCategory:string):number

    
}





class GameListImpl extends ItemImpl implements GameList {

    private _army:Army;
    private _dateCreated:Date;
    private _maxPoints:number;
    private _selectedUnits:SelectedUnit[];

    constructor(id:string,name:string,army:Army,maxPoints:number) {
        super(id,name);
        this._army=army;
        this._maxPoints=maxPoints;
        this._dateCreated=new Date();
        this._selectedUnits=[];
    }
    getSubCategoryTotalCost(subCategory: string): number {
        return this._selectedUnits.filter ( (unit) => unit.getUnitProfile().getCategoryValue().subCategory.getId()==subCategory)
                                    .map((unit) => unit.getTotalCost())
                                    .reduce((total, item ) => total + item,0 )
    }


    getSubCategoryCounterText(subCategory: string): string {
        var res:string = ''
        const listValidationRule = this._army.getGame().getListValidationRule()
        if(listValidationRule.getCounterType()==CounterType.POINTS)
            res = res + this.getSubCategoryTotalCost(subCategory)
        else
            res = res + this.getSelectedUnitsByMainSubCategory(subCategory).length
      
        //if has max limit will be shown, if not show min limit if any and starting for the limit
        if(listValidationRule.hasMaxLimit(subCategory))
           if(listValidationRule.getCounterType()==CounterType.POINTS)
                res = res + '/' + listValidationRule.getMaxLimit(subCategory)*this._maxPoints
            else 
                res = res + '/' + listValidationRule.getMaxLimit(subCategory)
        else if(listValidationRule.hasMinLimit(subCategory))
            if(listValidationRule.getCounterType()==CounterType.POINTS)
                res =  (listValidationRule.getMinLimit(subCategory)*this._maxPoints) + '/' + res
            else
                res =  listValidationRule.getMinLimit(subCategory) + '/' + res
        return res;
    }

    getMaxPoints(): number {
        return this._maxPoints;
    }
    getSelectedUnitById(selectedUnitId: string): SelectedUnit {
        const res = this._selectedUnits.find ( (unit)=> unit.id() ==selectedUnitId)
        if(res ==undefined)
            throw new Error(`Selected Unit ${selectedUnitId} doesn't exist`);
        return res;
    }
    getSelectedUnitsByMainSubCategory(subCategory: string): SelectedUnit[] {
        const mainCategory = this._army.getGame().getUnitsMainCategory();

        return this._selectedUnits.filter( (unit) => 
            unit.getUnitProfile().getCategoryValue().category.getId()==mainCategory.getId() &&
            unit.getUnitProfile().getCategoryValue().subCategory.getId() == subCategory)
    }

    selectOptionEntry(selectedUnitId: string, optionEntryId: string): void {
       const unit = this._selectedUnits.find((unit)=> unit.id()==selectedUnitId)
       if(unit==undefined)
            throw Error(`Unit ${selectedUnitId} doen't exist in the List`)
        unit.selectOptions(optionEntryId,true);
    
    }
  
    
    getNumModels(): number {
        return this._selectedUnits.map((unit) => unit.numModels()).reduce((total, item ) => total + item,0 )
    }


    getTotalCost(): number {
        return this._selectedUnits.map((unit) => unit.getTotalCost()).reduce((total, item ) => total + item,0 )
    }


    addUnitProfile(unit: UnitProfile): GameList {
        const selectedUnit  = SelectedUnitFactory.build(uuid(),unit)
        this._selectedUnits.push(selectedUnit);
        return this;
    }

 
    getArmy():Army {
        return this._army;
    }

    maxPoints():number {
        return this._maxPoints;
    }

    dateCreated():Date {
        return this._dateCreated;
    }

    selectedUnits():SelectedUnit[] {
        return this._selectedUnits;
    }

    addProfile(unitProfile:UnitProfile) {

       
    }

   



}

export class GameListFactory {

    static creeateNewList(id:string,name:string, maxPoints:number,army:Army,) {
        return new GameListImpl(id,name,army,maxPoints);
    }
}




