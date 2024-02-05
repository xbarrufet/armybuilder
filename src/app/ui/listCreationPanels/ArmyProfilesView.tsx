import Link from "next/link";
import { GameItem } from "@/app/lib/model/GameItem";
import { ArmyBuillderServiceSingleton } from "@/app/lib/services/ArmyBuilderService";
import { Item } from "@/app/lib/model/Item";
import { Army } from "@/app/lib/model/Army";
import { Alert } from "flowbite-react";









interface RenderCategoryProps {
    category: Item
    profiles: GameItem[] | undefined
    unitClickCallback: (value: string) => void
}
function RenderCategory({ category, profiles, unitClickCallback }: RenderCategoryProps) {

    if (profiles != undefined && profiles.length > 0) {
        return (
            <div className="flex pt-5 grow flex-col">
                <legend className="p-1 border-y-2 bg-blue-400">{category.getId()}</legend>
                <div className="divide-y divide-solid grow">
                {profiles.map((profile) => {
                    return (
                        <RenderUnitToSelect unitItem={profile} unitClickCallback={unitClickCallback} />
                    )
                })
                }
                </div>
            </div>
        )
    } else {
        return (<div></div>)
    }

}

interface RednderUnitToSelectProps {
    unitItem: GameItem
    unitClickCallback: (value: string) => void
}
function RenderUnitToSelect({ unitItem, unitClickCallback }: RednderUnitToSelectProps) {

    return (
        <div className="flex grow flex-row align-middle hover:bg-sky-100 hover:text-blue-600 active:bg-sky-300">
        <p
            key={unitItem.getId()}
            className='flex-none  grow rounded-md  align-middle p-2 font-medium '
            onClick={() => unitClickCallback(unitItem.getId())}>{unitItem.getName()}</p>
       <p className='rounded-md  align-middle p-2 font-medium'>
            {unitItem.getCost()} pts. 
       </p>
       </div>
    )

}


interface ArmyProfilesViewParams {
    army: Army
    unitClickCallback: (value: string) => void
}
export function ArmyProfilesView({ army, unitClickCallback }: ArmyProfilesViewParams) {

    const service = ArmyBuillderServiceSingleton.getService();
    const armyUnits = service.getSelectableProfilesByMainCategory(army.getId())
    return (
        <div className="flex grow flex-col mt-5 p-2 w-100">
            <legend className="flex grow text-center ">{army.getName()} Units</legend>
            {Array.from(armyUnits.keys()).map((subCategory, index) => {
                return (
                    <RenderCategory category={subCategory} profiles={armyUnits.get(subCategory)} unitClickCallback={unitClickCallback} />
                )
            }
            )}
        </div>
    )
}


