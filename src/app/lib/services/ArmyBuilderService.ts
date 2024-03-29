import uuid from "react-uuid";
import { Army, ArmyHeader } from "../model/Army";
import { GameHeader } from "../model/Game";
import { GameList, } from "../model/GameList";
import { ArmyBuilderRepository } from "../repositories/ArmyBuilderRepository";
import { ArmyBuilderRepositoryFactory } from "../repositories/ArmyBuilderRepositoryFactory";
import { GameItem } from "../model/GameItem";
import { SelectedUnit } from "../model/SelectedUnit";
import { CategoryDefinition } from "../model/GameCategory";
import { Item } from "../model/Item";

export interface ArmyBuilderService {

    
    getGameHeaders():GameHeader[]
    getArmyHeaders(gameId:string):ArmyHeader[];
    getArmy(armyId:string,gameId:string):Army;
    buildSelectedUnit(profileId:string):SelectedUnit
    getGameList(gameListId:string):GameList;
    persistGameList(gameList:GameList):void;
    addUnitProfileToGameList(unitProfileId:string, gameList:GameList):GameList;


    checkOptionEntry(gameListId: string,unitId:string, entryId: string): GameList;
    setSelectedUnitSize(gameListId: string,unitId:string, size: number): GameList;
    
    getSelectedUnitById(gameListId: string,unitId:string):SelectedUnit

    getSelectableProfilesByMainCategory(armyId:string, ):Map<Item,GameItem[]>;
    
    DEVELOPMENT_createTOWDwarfsList():GameList

}

export class ArmyBuilderServiceImpl implements ArmyBuilderService {

    private _armyBuilderRepository:ArmyBuilderRepository;


    constructor (armyBuilderRepositor:ArmyBuilderRepository) {
        this._armyBuilderRepository=armyBuilderRepositor;
    }
    getSelectableProfilesByMainCategory(armyId: string): Map<Item, GameItem[]> {
       try {
            const army = this._armyBuilderRepository.getArmy(armyId)
            if(army==undefined) 
                throw Error(`Army with id ${armyId} doesn't exist`)
            const mainCategory = army.getGame().getUnitsMainCategory()
            if(mainCategory==undefined) 
                throw Error(`Army with id ${armyId} belongs to a game that has no main category`)
            const res = new  Map<Item, GameItem[]>()
            mainCategory.getSubCategories().forEach ( ( subCategory )=> {
                const units = army.getUnitProfilesBySubCategory(subCategory.getId())
                res.set(subCategory,units)
            })
            return res;
        } catch (error) {
            throw(error)
        }
    }

    setSelectedUnitSize(gameListId: string, unitId: string, size: number): GameList {
        try {
            const gameList:GameList = this._armyBuilderRepository.getGameList(gameListId)
            if (gameList==undefined) 
                throw Error(`Game List with id ${gameListId} doesn't exist`)
            const unit:SelectedUnit= gameList.getSelectedUnitById(unitId)
            if (unit==undefined) 
                throw Error(`Selected Unit with id ${unitId} doesn't exist`)
            unit.setUnitSize(size);
            return gameList
        } catch (error) {
            throw(error)
        }


    }
    getSelectedUnitById(gameListId: string, unitId: string): SelectedUnit {
        try {
            const gameList:GameList = this._armyBuilderRepository.getGameList(gameListId)
            if (gameList==undefined) 
                throw Error(`Game List with id ${gameListId} doesn't exist`)
            const unit:SelectedUnit= gameList.getSelectedUnitById(unitId)
            if (unit==undefined) 
                throw Error(`Selected Unit with id ${unitId} doesn't exist`)
            return unit;
        } catch (error) {
            throw(error)
        }
    }
    checkOptionEntry(gameListId: string,unitId:string, entryId: string): GameList {
        try {
            const gameList:GameList = this._armyBuilderRepository.getGameList(gameListId)
            if (gameList==undefined) 
                throw Error(`Game List with id ${gameListId} doesn't exist`)
            gameList.selectOptionEntry(unitId,entryId,true)
            return gameList;
        } catch (error) {
            throw(error)
        }

    }
    DEVELOPMENT_createTOWDwarfsList(): GameList {
        const dwarfsArmy = this._armyBuilderRepository.getArmy("DWARFS")
        const gameList = dwarfsArmy.createList(uuid(),"LLista Development",2000)
        this._armyBuilderRepository.persistGameList(gameList);
        return gameList;
    }


    getGameHeaders(): GameHeader[] {
        return this._armyBuilderRepository.getGameHeaders();
    }
    
    
    getArmyHeaders(gameId: string): ArmyHeader[] {
        const game =  this._armyBuilderRepository.getGame(gameId);
        return game.getArmyHeaders();
    }


    getArmy(armyId: string): Army {
        return this._armyBuilderRepository.getArmy(armyId)
    }

    buildSelectedUnit(profileId: string): SelectedUnit {
        throw new Error("Method not implemented.");
    }


    addUnitProfileToGameList(unitProfileId:string, gameList:GameList):GameList {
            const unitProfile = this._armyBuilderRepository.getUnitProfile(gameList.getArmy().getId(),unitProfileId)
            return gameList.addUnitProfile(unitProfile);
    }


    getGameList(gameListId:string):GameList {
        return this._armyBuilderRepository.getGameList(gameListId)
    }

    persistGameList(gameList:GameList):void {

    }
    
}

export class ArmyBuilderServiceFactory {

    static buildArmyBuilderServiceJSON():ArmyBuilderService {

        return new ArmyBuilderServiceImpl(ArmyBuilderRepositoryFactory.buildArmyBuilderRepositoryJSON())
    }

}


export class ArmyBuillderServiceSingleton {
    private static instance: ArmyBuilderService;

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() { }

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getService(): ArmyBuilderService {
        if (!ArmyBuillderServiceSingleton.instance) {
            ArmyBuillderServiceSingleton.instance = ArmyBuilderServiceFactory.buildArmyBuilderServiceJSON();
        }

        return ArmyBuillderServiceSingleton.instance;
    }

    /**
     * Finally, any singleton should define some business logic, which can be
     * executed on its instance.
    
    public someBusinessLogic() {
        // ...
    }
     */
}