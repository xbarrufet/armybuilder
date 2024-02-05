
import { UnitOptionsSectionDTO, UnitOptionsEntryDTO } from "../data/DTO";
import { UIHelpers } from "../helpers/UIHelpers";
import { CategoryDefinition, GameItemGroup } from "./GameCategory";
import { GameItem } from "./GameItem";
import { Item, ItemFactory, ItemImpl } from "./Item";

import uuid from 'react-uuid';


export enum OptionTarget  {BASE, EXTRA};
export enum OptionType  {OPTION,CHECK,DROPDOWN};






export interface UnitOptionsSection  {
    getOptionType():OptionType;
    getOptionEntries():UnitOptionsEntry[];
    getSectionName():string;
    getFeedingCategory():CategoryDefinition|undefined;
    selectOptionEntry(entryId:string, value:boolean):void
    getMaxCost():number;
    getAccumulatedCost():number
    isAccumaltedCostValid():boolean
   
}

export interface UnitOptionsEntry {
      getId():string
      getItems():Item[] 
      getCost():number 
      isSelected():boolean
      setSelected(value:boolean):void
      isTitle():boolean
      getParentSection():UnitOptionsSection
      getChildOptionSections():UnitOptionsSection[]
      hasChildOptionSections():boolean
      costPerModel():boolean;
      
}




export class UnitOptionsSectionImpl  implements UnitOptionsSection{

    private _optionType:OptionType;
    private _optionTarget:OptionTarget;
    private _optionEntries:UnitOptionsEntry[]=[];
    private _sectionName:string;
    private _feedingCategory:CategoryDefinition|undefined
    private _maxCost:number
 

    constructor( sectionName: string, optionType:OptionType,optionTarget:OptionTarget,maxCost:number,feedingCategory?:CategoryDefinition) {
        this._sectionName=sectionName
        this._optionType=optionType;
        this._optionTarget=optionTarget;
        this._feedingCategory=feedingCategory;
        this._maxCost=maxCost
      
      
    }
    getMaxCost(): number {
       return this._maxCost;
    }
    getAccumulatedCost(): number {
        return this._optionEntries.map( (entry) => entry.getCost()).reduce( (accum,cost)=> accum + cost)
    }
    isAccumaltedCostValid(): boolean {
       return this.getAccumulatedCost()<=this.getMaxCost();
    }
    selectOptionEntry(entryId: string): void {
        //in case of option or dd--> unselect rest due to only one is allowes
       if(this._optionType==OptionType.OPTION || this._optionType==OptionType.DROPDOWN ) {
            this._optionEntries.forEach( (entry) => entry.setSelected(false))
       }
       const entry = this._optionEntries.find( (entry) => entry.getId()==entryId)
       if(entry==undefined)
            throw new Error(`Entry ${entry} doesn't exist `)
        entry.setSelected(!entry.isSelected());
    }

    setOptionEntries(entries:UnitOptionsEntry[]):void {
        this._optionEntries=entries;
    }


    getSectionName(): string {
        return this._sectionName;
    }
 
 
    public getOptionType():OptionType {
        return this._optionType
    }

    public getOptionEntries():UnitOptionsEntry[] {
        return this._optionEntries;
    }

    getFeedingCategory(): CategoryDefinition|undefined {
        return this._feedingCategory;
    }

  

    
  
}



export class UnitOptionsEntryImpl implements UnitOptionsEntry {
    private _id:string;
    private _items:Item[];
    private _cost :number;
    private _selected:boolean;
    private _parentSection:UnitOptionsSection;
    private _childOptionSections:UnitOptionsSection[]
    private _costPerModel:boolean;
    

    constructor(id:string,cost:number,costPerModel:boolean,isSelected:boolean,items:Item[],childOptionSections:UnitOptionsSection[],parentSection:UnitOptionsSection) {
        this._id=id;
        this._items=items;
        this._cost=cost;
        this._costPerModel=costPerModel
        this._selected=isSelected;
        this._parentSection=parentSection;
        this._childOptionSections=childOptionSections;
        
    }
    setSelected(value: boolean): void {
       this._selected=value;
    }
   
    public  getId():string {
        return this._id;
    }
    public  getItems():Item[] {
        if(this._items!=undefined)
            return this._items;
        return []
    }

    getChildOptionSections(): UnitOptionsSection[] {
        return this._childOptionSections
    }

    hasChildOptionSections(): boolean {
        return this._childOptionSections.length>0
    }
    
    public  getCost():number {
        return this._cost;
    }

    costPerModel(): boolean {
        return this._costPerModel;
    }
    public  isSelected():boolean {
        return this._selected;
    }

    public isTitle(): boolean {
        return this._id.length==0    
    }
  
    getParentSection(): UnitOptionsSection {
        return this._parentSection;
    }

}


export class UnitOptionsFactory {

    static buildOptionSectionGroup(sectionDTO:UnitOptionsSectionDTO[],categoriesDefinition:CategoryDefinition[],gameItems:GameItem[]):UnitOptionsSection[] {

        var res:UnitOptionsSection[] = []
        res= res.concat(sectionDTO.map ((section ) =>
                                UnitOptionsFactory.buildOptionSection(section,categoriesDefinition,gameItems)
            ));
        return res;
    }
    

    static buildOptionSection(sectionDTO:UnitOptionsSectionDTO,categoriesDefinition:CategoryDefinition[],gameItems:GameItem[]):UnitOptionsSection {
        
        
        var entries:UnitOptionsEntry[];
        var category:CategoryDefinition|undefined;
       
        const section = new UnitOptionsSectionImpl(
            sectionDTO.sectionName,
            OptionType[sectionDTO.optionType as keyof typeof OptionType],
            OptionTarget[sectionDTO.target as keyof typeof OptionTarget],
            sectionDTO.maxCost==undefined?0:sectionDTO.maxCost,
            category);

        if(sectionDTO.feedingCategory!=undefined && sectionDTO.feedingCategory.length>0) {
            // feeded list
            category = categoriesDefinition.find( ( def) => def.getId()==sectionDTO.feedingCategory) 
            if(category==undefined)
                throw Error(`Category ${sectionDTO.feedingCategory} doesn't exist`)    
            entries= this.buildListFeededOptionEntries(sectionDTO.optionEntries,category,gameItems,section);
            
        } else {
            entries= this.buildDirectOptionEntries(sectionDTO.optionEntries,categoriesDefinition,gameItems,section);
        }
        section.setOptionEntries(entries)
        return section;
    }


    private static buildListFeededOptionEntries(entries:UnitOptionsEntryDTO[],feedingCategory:CategoryDefinition,gameItems:GameItem[],parentSection:UnitOptionsSection):UnitOptionsEntry[] {
       
        const isTitleNeeded = entries.length>1;
        let res:UnitOptionsEntry[]=[];
        entries.forEach( (entry) => {
            const subCategory = feedingCategory.getSubCategories().find ( (sub) => sub.getId()==entry.items[0])
            res.push( this.buildTitleEntry(subCategory!=undefined?subCategory.getName():entry.items[0],parentSection))
            res = res.concat(this.builEntryFeededbyCategory(entry,feedingCategory,gameItems,parentSection))
    
        })
        return res;
    }


    private  static builEntryFeededbyCategory (entry:UnitOptionsEntryDTO,feedingCategory:CategoryDefinition,gameItems:GameItem[],parentSection:UnitOptionsSection):UnitOptionsEntry[] {
        
        const itemsToAdd = gameItems.filter(( element) => element.getCategoryValue().category.getId() == feedingCategory.getId() &&
                                                          element.getCategoryValue().subCategory.getId() ==entry.items[0]);   
        const itemRes:UnitOptionsEntry[] =[]
        itemsToAdd.forEach ( (itemToAdd) => {
               const gameItem = gameItems.find( (gameItem) => gameItem.getId()==itemToAdd.getId())
               if(gameItem==undefined) 
                     throw Error(`Item ${itemToAdd.getId()} doesn't exist and can't be included in Options Entry feeding lsit`)   
                
                try {     
                    const uid:string = uuid()
                    itemRes.push(new UnitOptionsEntryImpl(
                        uid,
                        entry.cost==undefined?gameItem.getCost():entry.cost,
                        entry.costPerModel==undefined?false:entry.costPerModel,
                        false,
                        [gameItem],
                        [],
                        parentSection))
                } catch (error) {
                    throw error;
                }
        }) 
        return itemRes   
    }

    private static buildDirectOptionEntries(entries:UnitOptionsEntryDTO[],categoriesDefinition:CategoryDefinition[],gameItems:GameItem[],parentSection:UnitOptionsSection):UnitOptionsEntry[] {
        var res:UnitOptionsEntry[] =[]
        entries.forEach( (entry) => {
            var childOptionSections:UnitOptionsSection[] = []
            if(entry.childOptionSections!=undefined)
                childOptionSections=childOptionSections.concat(this.buildOptionSectionGroup(entry.childOptionSections,categoriesDefinition,gameItems))
            const entryGameItems:GameItem[] = entry.items.map ((item)=> {
                            const gameItem = gameItems.find( (gameItem) => gameItem.getId()==item)
                            if(gameItem==undefined) 
                                throw Error(`Item ${item} doesn't exist and can't be included in Options Entry`)   
                            return gameItem })

            res.push(new UnitOptionsEntryImpl(
                    uuid( ),
                    entry.cost==undefined?0:entry.cost,
                    entry.costPerModel==undefined?true:entry.costPerModel,
                    entry.selected==undefined?false:entry.selected,
                    entryGameItems,
                    childOptionSections,parentSection));
            })
        return res;
    }



    private static buildTitleEntry(title:string,parentSection:UnitOptionsSection) {
            return new UnitOptionsEntryImpl("",0,true,false,[ItemFactory.build("",title)],[],parentSection);
    }



}
