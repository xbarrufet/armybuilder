import { Army, ArmyHeader, ArmyImpl } from "../model/Army";
import { Game, GameHeader, GameHeaderImpl, GameImpl } from "../model/Game";
import dataTOW from '@/data/TOW/game_configuration.json'
import dataDWARF from '@/data/TOW/dwarfs/dwarfs_army_configuration.json'
import { Item, ItemFactory, ItemImpl } from "../model/Item";
import { CategoryDefitionDTO, GameItemDTO, ItemDTO, UnitOptionsSectionDTO, UnitProfileDTO } from "../data/DTO";
import { GameItem, GameItemFactory } from "../model/GameItem";
import { CategoryDefinition, CategoryDefinitionImpl, CategoryValue, GameItemGroup } from "../model/GameCategory";
import { GameList } from "../model/GameList";
import { UnitProfile, UnitProfileFactory } from "../model/UnitProfile";
import { OptionTarget, OptionType, UnitOptionsSectionImpl, UnitOptionsEntry, UnitOptionsEntryImpl, UnitOptionsFactory, UnitOptionsSection } from "../model/UnitOptions";


const DEFAULT_MAIN_CATEGORY="PROFILE"

export interface ArmyBuilderRepository {

    getGameHeaders():GameHeader[]
    getGame(gameId:string):Game
    getArmy(armyId: string,gameId:string):Army
    persistGameList(gameList:GameList):void
    getGameList(gameListId:string):GameList
    getUnitProfile(armyId: string,unitId:string):UnitProfile;

}


export class ArmyBuilderRepositoryJSON implements ArmyBuilderRepository {


    private _armies:Map<string,Army> = new Map<string,Army>();
    private _games:Map<string,Game> = new Map<string,Game>();
   

    private _gameListRepo:Map<string,GameList> = new Map<string,GameList>()

    getGameHeaders(): GameHeader[] {
        return [new GameHeaderImpl("OLDWORLD", "The Old World"), new GameHeaderImpl("OLDWORLD", "Age Of Sigmar"), new GameHeaderImpl("OLDWORLD", "Warhammer 40.000"), new GameHeaderImpl("OLDWORLD", "Middle Earth Strategic Battle Game")]
    }

    getGame(gameId: string): Game {
        if(this._games.has(gameId)) {
            return this._games.get(gameId)!;
        } else { 
        const header:GameHeader|undefined = this.getGameHeaders().find((game) => game.getId()==gameId)
        if(header ==undefined)
                throw Error(`Game with id ${gameId} doen't exist`);
            const armyHeaders = this.buildArmyHeaders(gameId, dataTOW["armies"]);
            const categoriesDefinition = this.buildCategoryDefinitions( dataTOW["gameItemCategories"]);
            const unitCategoriesDefinition = this.buildCategoryDefinitions( dataTOW["unitCategories"]);
            const gameItems = this.buildGameItems(dataTOW["gameItems"],categoriesDefinition);
            const profiles = this.buildGameItems(dataTOW["unitProfiles"],unitCategoriesDefinition);
            const game = new GameImpl(header.getId(),header.getName(),armyHeaders,categoriesDefinition, dataTOW["unitsMainCategory"],unitCategoriesDefinition,gameItems,profiles);
            this._games.set(gameId,game)
            return game;
        }
    }

    getArmy(armyId: string):Army {

        const gameId= dataDWARF["gameId"]
        if(this._armies.has(armyId)) {
            return this._armies.get(armyId)!;
        } else {
            const game:Game = this.getGame(gameId);
            if(game==undefined)
                throw Error(`game with id ${gameId} doen't exist`);
            const armyHeader= this.buildArmyHeaders(gameId, dataTOW["armies"]).find((header)=> header.getId()==armyId);
            if(armyHeader==undefined)
                throw Error(`Army with id ${armyId} doen't exist`);
            const categoriesDefinition =game.getItemCategories().concat(this.buildCategoryDefinitions( dataDWARF["gameItemCategories"]));
            const unitCategoriesDefinition = game.getUnitCategories().concat(this.buildCategoryDefinitions( dataDWARF["unitCategories"]));
        
            const gameItems = game.getGameItems().concat(this.buildGameItems(dataDWARF["gameItems"],categoriesDefinition));
            const profiles = game.getUnitProfiles().concat(this.buildGameItems(dataDWARF["unitProfiles"],unitCategoriesDefinition));
            const army = new ArmyImpl(armyHeader.getId(),armyHeader.getName(),game,categoriesDefinition, unitCategoriesDefinition,gameItems,profiles);
            this._armies.set(armyId,army);
            return army;
        }
    }

    getUnitProfile(armyId: string,unitId:string):UnitProfile {

        const army = this._armies.get(armyId);
        if(army==undefined)
            throw Error(`Army ${armyId} doesn't exist`)
        const unitProfileDTO:UnitProfileDTO|undefined = dataDWARF["unitProfiles"].find((profile)=> profile.id==unitId);
        if(unitProfileDTO==undefined)
            throw Error(`Unit Profile with id ${unitId} doen't exist`);
        return this.buildUnitProfile(unitProfileDTO,army);
    } 

    getLinkedUnitProfile(armyId: string,unitId:string):UnitProfile {

        const army = this._armies.get(armyId);
        if(army==undefined)
            throw Error(`Army ${armyId} doesn't exist`)
        const unitProfileDTO:UnitProfileDTO|undefined = dataDWARF["linkedUnitProfiles"].find((profile)=> profile.id==unitId);
        if(unitProfileDTO==undefined)
            throw Error(`Linkled Unit Profile with id ${unitId} doen't exist`);
        return this.buildUnitProfile(unitProfileDTO,army);
    } 



// *** private funcions ****************

    private buildArmyHeaders(gameId:string,armies:ItemDTO[]):ArmyHeader[] {
        const res:ArmyHeader[] =armies.map((army) => 
            new ItemImpl(army.id,army.name)
        );
        return res;
    }


    private buildCategoryDefinitions( categoriesDefinition:CategoryDefitionDTO[]):CategoryDefinition[] {
        const res:CategoryDefinition[] =categoriesDefinition.map((category) => {
            let subCategories:Item[] = [];
            if(category.subCategories!=undefined && category.subCategories.length>0)
                subCategories = category.subCategories.map((subCategory)=> new ItemImpl(subCategory.id,subCategory.name))
            return new CategoryDefinitionImpl(category.id,category.name,subCategories)
        }
        );
        return res;
    }

    private getCategoryValue(categoryId:string, subCategoryId:string|undefined,categoriesDefinition :CategoryDefinition[]) {
        const category = categoriesDefinition.find((category)=> category.getId() == categoryId )
        if(category==undefined)
            throw Error(`Category with id ${categoryId} doen't exist`);
        if(subCategoryId!=undefined && subCategoryId?.length>0) {
            const subItem = category.getSubCategories().find((subC) => subC.getId() == subCategoryId)
            if(subItem==undefined)
                throw Error(`SubCategory with id ${subCategoryId} doen't exist`);
            return {category:ItemFactory.build(category.getId(),category.getName()) ,
                    subCategory:ItemFactory.build( subItem.getId(),subItem.getName())};
        } else {
            return {category:ItemFactory.build(category.getId(),category.getName()) ,
                subCategory:ItemFactory.EMPTY_ITEM}
        }
    }


    private getBothCategoryValues(gameItem:GameItemDTO,categoriesDefinition :CategoryDefinition[]):{mainCategoryValue:CategoryValue,otherCategoryValues:CategoryValue[]} {
        const mainCategoryValue = this.getCategoryValue(gameItem.mainCategory.category,gameItem.mainCategory.subCategory,categoriesDefinition);
        var otherCategoryValues:CategoryValue[] = []
        if(gameItem.otherCategories!=undefined && gameItem.otherCategories.length>0) {
            otherCategoryValues = gameItem.otherCategories.map( ( otherCategory ) => this.getCategoryValue(otherCategory.category,otherCategory.subCategory,categoriesDefinition))
        }
        return {mainCategoryValue:mainCategoryValue,otherCategoryValues:otherCategoryValues};
    }


    private buildGameItems(gameItems:GameItemDTO[],categoriesDefinition :CategoryDefinition[]):GameItem[] {
        const res:GameItem[] = gameItems.map ((gameItem) => {  
            const mainCategoryValue = this.getCategoryValue(gameItem.mainCategory.category,gameItem.mainCategory.subCategory,categoriesDefinition);
            const catValues:{mainCategoryValue:CategoryValue,otherCategoryValues:CategoryValue[]} = this.getBothCategoryValues(gameItem,categoriesDefinition);
            return GameItemFactory.buildGameItem(
                gameItem.id,
                gameItem.name,
                catValues.mainCategoryValue,
                gameItem.cost!=undefined?gameItem.cost:0,
                gameItem.maxNumber,
                gameItem.minNumber,
                gameItem.isSelectable!=undefined?gameItem.isSelectable:true,
                catValues.otherCategoryValues);
        });
        return res;
    }

    private buildUnitProfile(unitProfile:UnitProfileDTO,army:Army):UnitProfile {
        const categoriesDefinition = army.getItemCategories();
        const mainCategoryValue = this.getCategoryValue(unitProfile.mainCategory.category,unitProfile.mainCategory.subCategory,categoriesDefinition);
        const catValues:{mainCategoryValue:CategoryValue,otherCategoryValues:CategoryValue[]} = this.getBothCategoryValues(unitProfile,categoriesDefinition);
        var unitOptionsSections:UnitOptionsSection[] = []
        if(unitProfile.optionSections!=undefined) {
            unitOptionsSections=unitOptionsSections.concat(
                UnitOptionsFactory.buildOptionSectionGroup(unitProfile.optionSections,categoriesDefinition,army.getGameItems())
                       
            );
        }
        return UnitProfileFactory.build(
            unitProfile.id,
            unitProfile.name,
            catValues.mainCategoryValue,
            unitProfile.cost!=undefined?unitProfile.cost:0,
            unitOptionsSections,
            unitProfile.maxNumber,
            unitProfile.minNumber,
            unitProfile.isSelectable,
            catValues.otherCategoryValues
        )

        
    }



    persistGameList(gameList: GameList): void {
        this._gameListRepo.set(gameList.getId(),gameList)
    }
    getGameList(gameListId: string): GameList {
        const gameList = this._gameListRepo.get(gameListId);
        if(gameList==undefined)
            throw new Error(`GameList with id ${gameListId} not exist`);
        return gameList;
    }


    
        
}

    

    
