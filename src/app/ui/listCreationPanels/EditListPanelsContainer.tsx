import { GameList, SelectedUnit } from "@/app/lib/model/GameList";
import UnitsSelectedView from "./UnitsSelectedView";
import { ArmyProfilesList } from "./ArmyProfilesList";
import { useState } from "react";
import { GameItemGroup } from "@/app/lib/model/GameCategory";
import { ArmyBuillderServiceSingleton } from "@/app/lib/services/ArmyBuilderService";
import UnitOptions from "./UnitOptions";
import { UnitOptionsSection } from "@/app/lib/model/UnitOptions";

interface EditListPanelsContainerProps {
    propGameList:GameList
}


export default function EditListPanelsContainer({  propGameList }: EditListPanelsContainerProps) {

    type stateGameList = {
        gameList:GameList
    }
    type stateOptions= {
        options:UnitOptionsSection[]
    }


    const [categorySelected, setCategorySelected] = useState<string>('');
    const [unitSelectedId, setUnitSelectedId] = useState<string>('');
    
    
    const [stateGameList, setGameList] = useState<stateGameList>({gameList:propGameList});
    const [stateOptions, setOptions] = useState<stateOptions>({options:[]});

    const [error, setError] = useState<string>('');

    //const unitsSelected = gameList.getSelectedUnitsByMainSubCategory(categorySelected);
    

    const onCategoryClicked = (category:string) => {
            setCategorySelected(category);
    }


    const onOptionClicked = (entryId:string) => {
        try {
            const gameListUpdated = ArmyBuillderServiceSingleton.getService().checkOptionEntry(stateGameList.gameList.getId(),unitSelectedId,entryId)
            let updatedValue = {gameList:gameListUpdated};
            setGameList({
                ...stateGameList,
                ...updatedValue
            });
        } catch(catchError) {
            if (catchError instanceof Error) {
                setError(JSON.stringify(catchError.message))
            }
           
        }
}


    const onUnitSelectedClicked = (unitSelectedId:string) => {
        try {
            setUnitSelectedId(unitSelectedId)
            const unitSelected = ArmyBuillderServiceSingleton.getService().getSelectedUnitById(stateGameList.gameList.getId(),unitSelectedId);
            let updatedValue = {options:unitSelected.getOptionSections()};
            setOptions({
                ...stateOptions,
                ...updatedValue
            });
        } catch(catchError) {
            if (catchError instanceof Error) {
                setError(JSON.stringify(catchError.message))
            }
           
        }
}



    const onUnitClicked = (unitProfileId:string) => {
        try {
            const gameListUpdated = ArmyBuillderServiceSingleton.getService().addUnitProfileToGameList(unitProfileId,stateGameList.gameList)
            let updatedValue = {gameList:gameListUpdated};
            setGameList({
                ...stateGameList,
                ...updatedValue
            });
        } catch(catchError) {
            if (catchError instanceof Error) {
                setError(JSON.stringify(catchError.message))
            }
           
        }
}

    return (
        <div className="flex grow flex-rows divide-x divide-gray-400">
            <p>{error}</p>
            <div className="w-1/3">
                <UnitsSelectedView gameList={stateGameList.gameList} category={stateGameList.gameList.getArmy().getGame().getUnitCategoryById('UNIT_CATEGORY')} categoryClickCallBack={onCategoryClicked}  unitClickCallBack={onUnitSelectedClicked}/>
            </div>
            <div className="w-1/3">
                <ArmyProfilesList units={stateGameList.gameList.getArmy().getUnitsByMainSubCategory(categorySelected)} unitClickCallback={onUnitClicked}></ArmyProfilesList>
            </div>

            <div className="w-1/3">
               <UnitOptions unitSections={stateOptions.options} optionClickedCallback={onOptionClicked}/>
            </div>

        </div>
    )

}
//<GameListView categories={game.unitCategories()} ></GameListView></div>
//

