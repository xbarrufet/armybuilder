import { GameItem } from "./GameItem";
import { Item } from "./Item";
import { UnitOptionsSection, UnitOptionsEntry } from "./UnitOptions";
import { UnitProfile, UnitProfileFactory } from "./UnitProfile";


export interface SelectedUnit {


    id():string 

    isEmpty():boolean
    numModels():number 

    getTotalCost():number
    getUnitProfile():GameItem
    selectOptions(optionEntryId:string,value:any):void

    getOptionSections():UnitOptionsSection[] 
    isVariableNumModels():boolean 

    getRangeNumModels():{minNumber:number,maxNumber:number|undefined} 

    getAllOptionsEquiped():Item[]

    setUnitSize(size:number) :void

}





export class SelectedUnitImp implements SelectedUnit   {
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
    getAllOptionsEquiped(): Item[] {
        const items = Array.from(this._optionsEntry.values()).filter ((entry)=> entry.isSelected()).map( (entry)=> entry.getItems())
        var res:Item[] =[]
        items.forEach( ( items) => res=res.concat(items))
        return res;
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

    isEmpty(): boolean {
        return this._id==undefined || this._id.length==0
    }

    numModels():number {
        return this._numModels;
    }

    getTotalCost():number {
        var cost = this._unitProfile.getCost()*this._numModels;
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

    isVariableNumModels():boolean {
        return this._unitProfile.getMaxNumber()!=this._unitProfile.getMinNumber()
    }

    getRangeNumModels():{minNumber:number,maxNumber:number|undefined} {
        const maxNumber:number|undefined = this._unitProfile.getMaxNumber()==0?undefined:this._unitProfile.getMaxNumber();
        return {minNumber:this._unitProfile.getMinNumber(),maxNumber:maxNumber}
    }

    setUnitSize(size:number) {
        this._numModels=size;
    }


    
}


export class SelectedUnitFactory {

    static EMPTY_SELECTED_UNIT = new SelectedUnitImp ("",UnitProfileFactory.EMPTY_UNIT_PROFILE)

    static build(id:string, unitProfile:UnitProfile) :SelectedUnit {
        return new SelectedUnitImp(id,unitProfile);
    }

}

