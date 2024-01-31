import uuid from "react-uuid";
import { UnitProfile } from "./UnitProfile"
import { Army } from "./Army";
import { Item, ItemImpl } from "./Item";
import {  OptionType, UnitOptionsEntry, UnitOptionsSection } from "./UnitOptions";
import { CategoryDefinition, CategoryValue } from "./GameCategory";
import { GameItem } from "./GameItem";
import { Game } from "./Game";





enum EquipmentType {BASE=0,EXTRA=1}



export interface GameList extends Item{
    getNumModels():number ;
    getTotalCost():number;
    getArmy():Army;
    addUnitProfile(unit:UnitProfile):GameList;
    selectOptionEntry(selectedUnitId:string,optionEntryId:string,value:any):void

    getUnitsByMainSubCategory(subCategory:string):SelectedUnit[]
    getSelectedUnitById(selectedUnitId:string):SelectedUnit

    
}


export class SelectedUnit  {
    private _id:string;
    private _optionSections:UnitOptionsSection[]
    private _optionsEntry:Map<string, UnitOptionsEntry>
    private _unitProfile:GameItem
    private _numModels:number;
    private _baseCost:number = 0;
    

    constructor (id:string, unitProfile:UnitProfile) {
        this._id=id;
        this._numModels=unitProfile.getMinNumber();
        this._unitProfile=unitProfile;
        this._optionSections=unitProfile.getUnitOptionsSection();
        this._optionsEntry = new Map<string, UnitOptionsEntry>();
        this.storeOptioEntries(unitProfile.getUnitOptionsSection())
        this._baseCost=unitProfile.getCost()
      
        
    }

    private storeOptioEntries(sections:UnitOptionsSection[]):void {
        sections.forEach ( (section) => {
            section.getOptionEntries().forEach ((entry) => {
                 if(entry.getId().length>0)
                     this._optionsEntry.set(entry.getId(),entry)
                 if(entry.getChildOptionSections()!=undefined && entry.getChildOptionSections().length>0) 
                    this.storeOptioEntries(entry.getChildOptionSections())
            }) 
        })
    }



    id():string {
        return this._id;
    }


    numModels():number {
        return this._numModels;
    }

    getTotalCost():number {
        var cost = this._unitProfile.getCost()
        this._optionsEntry.forEach ((entry,key)=> {
            if(entry.isSelected()) {
                cost = cost + (entry.costPerModel()?entry.getCost()*this._numModels:entry.getCost())
            }
        })
        return cost;

    }

    selectOptions(optionEntryId:string,value:any) {
        const entry = this._optionsEntry.get(optionEntryId)
        if(entry==undefined)
            throw Error(`Entry ${optionEntryId} doen't exist in the List`)
        entry.getParentSection().selectOptionEntry(optionEntryId,true)
    }

     getUnitProfile():GameItem {
        return this._unitProfile;
    }

    getOptionSections():UnitOptionsSection[] {
        return this._optionSections;
    }
}




export class GameListImpl extends ItemImpl implements GameList {

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
    getSelectedUnitById(selectedUnitId: string): SelectedUnit {
        const res = this._selectedUnits.find ( (unit)=> unit.id() ==selectedUnitId)
        if(res ==undefined)
            throw new Error(`Selected Unit ${selectedUnitId} doesn't exist`);
        return res;
    }
    getUnitsByMainSubCategory(subCategory: string): SelectedUnit[] {
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
        return this._selectedUnits.map((unit) => unit.numModels()).reduce((total, item ) => total + item )
    }
    getTotalCost(): number {
        return this._selectedUnits.map((unit) => unit.getTotalCost()).reduce((total, item ) => total + item )
    }


    addUnitProfile(unit: UnitProfile): GameList {
        const selectedUnit  = new SelectedUnit(uuid(),unit)
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