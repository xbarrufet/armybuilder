import { ArmyDTO,  GameConfigurationDTO, GameItemDTO } from "../data/DTO";
import { Army, ArmyImpl} from "../model/Army";
import { GameImpl } from "../model/Game";
import { Wargear, WargearFactory } from "../model/Wargear";
import {  Item, ItemFactory } from "../model/Item";
import { GameHeader } from "../model/GameHeader";
import { ArmyBuilderDataAPI, ArmyBuilderDataAPIMemory } from "../data/api";
import { EnhancementFactory } from "../model/Enhancement";
import { CategoryDefinition, CategoryFactory, GameItemCategoryDefinition, GameItemCategoryFactory, GameItemGroup } from "../model/GameCategory";
import { GameItem } from "../model/GameItem";





function buildGame(gameHeader:GameHeader,configuration: GameConfigurationDTO): GameImpl {
    var armies: Item[] = [];
    configuration.armies.forEach((armyHeader) =>
        armies.push(ItemFactory.buildFromDTO(armyHeader))
    )   
    const itemCategoryDefinition:GameItemCategoryDefinition[] =[] 
    configuration.gameItemGameCategories.forEach ( (element) => {
        itemCategoryDefinition.push(GameItemCategoryFactory.buildFromDTO(element))
    })
    const categoryDefinition:CategoryDefinition[] =[] 
    configuration.gameScpecificCategories.forEach ( (element) => {
        categoryDefinition.push(CategoryFactory.buildCategoryDefinitonFromDTO(element))
    })


    const gameItems:GameItem[] = [];    
    configuration.gameItems.forEach((item)=> {
        gameItems.push(buildGameItem(item,itemCategoryDefinition));
    })


    return new GameImpl(gameHeader.id,
        gameHeader.name,
        armies,
        itemCategoryDefinition,
        categoryDefinition,
        gameItems)

}


function buildGameItem(data:GameItemDTO,categories:GameItemCategoryDefinition[]):GameItem {
    
    const category = categories.find ((cat) => cat.id() == data.mainCategory.category)
    if (category == undefined || category.gameItemGroup()==GameItemGroup.WARGEAR)
        return WargearFactory.builFromDTO(data);
    else if(category.gameItemGroup()==GameItemGroup.ENHANCEMENT)
        return EnhancementFactory.builFromDTO(data);    
    else 
        return WargearFactory.builFromDTO(data);
}


function buildArmy(header: Item, data: ArmyDTO,game:GameImpl): Army {
    
        const itemCategoryDefinition:GameItemCategoryDefinition[] =[] 
        data.gameItemGameCategories.forEach ( (element) => {
            itemCategoryDefinition.push(GameItemCategoryFactory.buildFromDTO(element))
        })
        const categoryDefinition:CategoryDefinition[] =[] 
        data.gameScpecificCategories.forEach ( (element) => {
            categoryDefinition.push(CategoryFactory.buildCategoryDefinitonFromDTO(element))
        })

        const gameItems:GameItem[] = [];    
        data.gameItems.forEach((item)=> {
            gameItems.push(buildGameItem(item,itemCategoryDefinition));
        })
  
        const army = new ArmyImpl(header.getId(),header.getName(),game,itemCategoryDefinition,categoryDefinition,gameItems);
        army.loadUnitProfiles(data.unitProfiles,data.splitUnitProfiles)
        return army;

}



function mergeEquipment(baseEquiment:Wargear[],armyEquipmemt:Wargear[]):Wargear[] {
    return baseEquiment.concat(armyEquipmemt);
}







function builArmyBuilderDataAPI():ArmyBuilderDataAPI {
    return new ArmyBuilderDataAPIMemory();
}


export default { buildGame, buildArmy ,builArmyBuilderDataAPI}