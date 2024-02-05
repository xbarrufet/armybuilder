'use client'

import { GameList } from "@/app/lib/model/GameList";

import { useSearchParams } from 'next/navigation'
import { ArmyBuillderServiceSingleton } from "@/app/lib/services/ArmyBuilderService";
import { useState } from "react";
import { ArmyProfilesView } from "@/app/ui/listCreationPanels/ArmyProfilesView";
import UnitOptionsView from "@/app/ui/listCreationPanels/UnitOptionsViews";
import GameListView from "@/app/ui/listCreationPanels/GameListView";
import { Alert } from "flowbite-react";
import { SelectedUnit, SelectedUnitFactory } from "@/app/lib/model/SelectedUnit";





export default function Page() {

  const service = ArmyBuillderServiceSingleton.getService();

  const searchParams = useSearchParams()
  const listId = searchParams.get('listId')

  
  var currenGameList:GameList;
  try {
      currenGameList = service.getGameList(listId!=undefined?listId:"")    
  } catch (error) {
       currenGameList = service.DEVELOPMENT_createTOWDwarfsList();
  }
  
  type stateGameList = {
      gameList:GameList
  }
  type stateSelectedUnit= {
      selectedUnit:SelectedUnit
  }


  const [categorySelected, setCategorySelected] = useState<string>('');
  const [stateSelectedUnit, setSelectedUnit] = useState<stateSelectedUnit>({selectedUnit:SelectedUnitFactory.EMPTY_SELECTED_UNIT});
  const [stateGameList, setGameList] = useState<stateGameList>({gameList:currenGameList});
  const [error, setError] = useState<string>('');    



function ShowError() {
      if(error.length>0)
            return (
            <Alert className="float: inline-start" color="failure" onDismiss={() => setError('')}>
            <span className="font-medium">{error}</span>
            </Alert>
            );
    }
  


  const onCategoryClicked = (category:string) => {
      setCategorySelected(category);
}


const onOptionClicked = (entryId:string) => {
  try {
      const gameListUpdated = ArmyBuillderServiceSingleton.getService().checkOptionEntry(stateGameList.gameList.getId(),stateSelectedUnit.selectedUnit.id(),entryId)
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

      const unitSelected = ArmyBuillderServiceSingleton.getService().getSelectedUnitById(stateGameList.gameList.getId(),unitSelectedId);
      let updatedValue = {selectedUnit:unitSelected};
      setSelectedUnit({
          ...stateSelectedUnit,
          ...updatedValue
      });
  } catch(catchError) {
      if (catchError instanceof Error) {
          setError(JSON.stringify(catchError.message))
      }
     
  }
}

const onChangeUnitSizeCallback = (unitSelectedId:string, value:string) => {
  if( typeof value === 'string' && !Number.isNaN(value)) {
      if(parseInt(value)!=stateSelectedUnit.selectedUnit.numModels()) {
          try {
              const gameListUpdated = ArmyBuillderServiceSingleton.getService().setSelectedUnitSize(stateGameList.gameList.getId(),stateSelectedUnit.selectedUnit.id(),parseInt(value))
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
      
      <div className="flex flex-col">
            <ShowError/>
         <div className="flex grow flex-row divide-x divide-gray-400">
           
            <div className="w-1/4">
            <ArmyProfilesView army={stateGameList.gameList.getArmy()} unitClickCallback={onUnitClicked}></ArmyProfilesView>
            </div>
            <div className="w-2/4">
                
                <GameListView gameList={stateGameList.gameList} category={stateGameList.gameList.getArmy().getGame().getUnitCategoryById('UNIT_CATEGORY')} categoryClickCallBack={onCategoryClicked}  unitClickCallBack={onUnitSelectedClicked}/>
            </div>

            <div className="w-1/4">
                {stateSelectedUnit.selectedUnit.isEmpty()?
                <div/>
                :
                <UnitOptionsView selectedUnit={stateSelectedUnit.selectedUnit} optionClickedCallback={onOptionClicked} changeUnitSizeCallback={onChangeUnitSizeCallback}/>
                }
            </div>
      </div>
        </div>
    );
  }

 