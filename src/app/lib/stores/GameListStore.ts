import { create } from "zustand";
import { GameList } from "../model/GameList";
import { UnitProfile, UnitProfileImp } from "../model/UnitProfile";

// ZUSTAND STORES ********************************
/*type GameListState = {
    category: string,
    gameList:GameList,
    updateCategory: (newCategory: string) => void,
    updateGameList: (newGameList: GameList) => void
  }

  
  export const useGameListStore = create<GameListState>((set) => ({
    category:'' ,
    gameList:GameList.EMPTY_GAME_LIST,
    updateCategory: (newCategory: string) => set({category:newCategory}),
    updateGameList: (newGameList: GameList) => set({gameList:newGameList})
  }))
  
  export default useGameListStore;*/

  