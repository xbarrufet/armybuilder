import { create } from 'zustand'
import { GameHeader } from '../model/GameHeader';
import { Army } from '../model/Army';
import { GameImpl } from '../model/Game';
import { ArmyBuilderContext } from '../model/ArmyBuildeContext';
import Factory from '../helpers/Factory';

const abContext= new ArmyBuilderContext(Factory.builArmyBuilderDataAPI());

interface ContextState {
  context: ArmyBuilderContext;
}


export const useContextStore = create<ContextState>((set) => ({
  context:abContext
}))

export default useContextStore;