'use client'

import { GameList, SelectedUnit } from "@/app/lib/model/GameList";
import GameListHeader from "@/app/ui/listCreationPanels/GameListHeader";
import EditListPanelsContainer from "@/app/ui/listCreationPanels/EditListPanelsContainer";
import { useSearchParams } from 'next/navigation'
import { ArmyBuillderServiceSingleton } from "@/app/lib/services/ArmyBuilderService";
import { useState } from "react";





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

  const [gameList, setGameList] = useState<GameList>(currenGameList);
  
    return (
          <div className="flex grow h-full flex-col space-y-4">
                <GameListHeader gameList={gameList}></GameListHeader>
                <EditListPanelsContainer propGameList={gameList}></EditListPanelsContainer>
          </div>
    );
  }

 