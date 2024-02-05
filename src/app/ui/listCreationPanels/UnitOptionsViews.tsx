'use client';

import { UIHelpers } from "@/app/lib/helpers/UIHelpers"
import { SelectedUnit } from "@/app/lib/model/SelectedUnit";
import { OptionType, UnitOptionsEntry, UnitOptionsSection } from "@/app/lib/model/UnitOptions"
import { Checkbox, Label, Radio } from "flowbite-react"
import { useState } from "react";
import { clsx } from 'clsx';




interface UnitOptionsViewProps {
    selectedUnit: SelectedUnit
    optionClickedCallback: (value: string) => void
    changeUnitSizeCallback: (selectedUnittId: string, value: string) => void
   
}


interface RenderOptionComponentProps {
    optionEntry: UnitOptionsEntry
    optionSection: UnitOptionsSection,
    optionClickedCallback: (value: string) => void
}
function RenderOptionComponent ({ optionEntry,optionSection,optionClickedCallback}:RenderOptionComponentProps) {
        if(optionSection.getOptionType()==OptionType.OPTION) {
            return (
                <Radio className="mr-4 align-middle" id={optionEntry.getId()} name = {optionSection.getSectionName()} value={optionEntry.getId()} checked={optionEntry.isSelected()} onChange={() => optionClickedCallback(optionEntry.getId())} />
            )
        } else {
            return (
                <Checkbox className="mr-4" id={optionEntry.getId()} onChange={() => optionClickedCallback(optionEntry.getId())} checked={optionEntry.isSelected()} />
            )
        }   
}

/*

interface RenderSectionProps {
    optionSection: UnitOptionsSection
    optionClickedCallback: (value: string) => void
    level:string
}
function RenderOptionSection({ optionSection, optionClickedCallback,level }: RenderSectionProps) {

    return (
        <fieldset className="flex max-w-md flex-col gap-4">
            {optionSection.getOptionEntries().map((entry) => 
                <RenderOptionLine optionEntry={entry} optionSectionId={optionSection.getSectionName()} optionClickedCallback={optionClickedCallback} />
            )}
        </fieldset>
    )

}



function RenderCheckBoxSection({ optionSection, optionClickedCallback,level }: RenderSectionProps) {


    const levelInt = parseInt(level)
    return (

        <div className="flex max-w-md flex-col gap-4" id="checkbox">
            {optionSection.getOptionEntries().map((entry) => {
               if(entry.isTitle()) {
                    return(<div>
                        <legend className="ml-2 ">{UIHelpers.getItemsArrayNames(entry.getItems())}</legend>
                    </div>)
               } else if (entry.isSelected() && entry.getChildOptionSections().length > 0) {
                    return (
                        <div>
                            <div className="flex items-center gap-2 text-xs">
                                <div>
                                    <Checkbox id={entry.getId()} onChange={() => optionClickedCallback(entry.getId())} defaultChecked />
                                    <Label htmlFor="accept" className="flex grow" >{UIHelpers.getItemsArrayNames(entry.getItems())}</Label>
                                </div>
                                <div>
                                    <p className="text-xs">{entry.getCost()} pts.</p>
                                </div>
                            </div>
                            <UnitOptionSections optionSections={entry.getChildOptionSections()} optionClickedCallback={optionClickedCallback} level={'' + (levelInt+1)}/>
                        </div>

                    )
                } else if (entry.isSelected() && entry.getChildOptionSections().length == 0) {
                    return (
                        <div className="flex items-center gap-2 text-xs">
                              <div>
                            <Checkbox id={entry.getId()} onChange={() => optionClickedCallback(entry.getId())} defaultChecked />
                            <Label htmlFor="accept" className="flex grow">{UIHelpers.getItemsArrayNames(entry.getItems())}</Label>
                            </div>
                            <div>
                            <p className="text-xs">{entry.getCost()} pts.</p>
                            </div>
                        </div>

                    )

                } else {
                    return (
                        <div className="flex items-center gap-2 text-xs">
                            <Checkbox id={entry.getId()} onChange={() => optionClickedCallback(entry.getId())} />
                            <Label htmlFor="accept" className="flex grow">{UIHelpers.getItemsArrayNames(entry.getItems())}</Label>
                            <p className="text-xs">{entry.getCost()} pts.</p>
                        </div>
                    )

                }
            }
            )}
        </div>
    )


}

*/

interface RenderChildOptionsSectionProps {
    optionEntry: UnitOptionsEntry
    optionSection: UnitOptionsSection,
    optionClickedCallback: (value: string) => void
}
function RenderChildOptionSection({optionEntry,optionSection,optionClickedCallback}:RenderChildOptionsSectionProps) {
    if(optionEntry.isSelected() && optionEntry.hasChildOptionSections()) {
            return (
                <div className="mt-0 pl-2 p-2 bg-blue-100">
                    <UnitOptionSections optionSections={optionEntry.getChildOptionSections()} optionClickedCallback={optionClickedCallback}/>
                </div>
            )
    } else {
        return (<div></div>)
    }

}


interface UnitOptionSectionProps {
    optionSections: UnitOptionsSection[]
    optionClickedCallback: (value: string) => void
   
}
function UnitOptionSections({ optionSections, optionClickedCallback }: UnitOptionSectionProps) {

    return (
        <div>
            {optionSections.map((optionSection) => {
                return (
                    <div className="mt-2 flex flex-col">
                        <legend className="mb-1 font-bold">{optionSection.getSectionName()}</legend>
                        {optionSection.getOptionEntries().map((entry) => {
                           if (entry.isTitle()) {
                                return(
                                    <legend className="ml-2 ">{UIHelpers.getItemsArrayNames(entry.getItems())}</legend>
                                )
                           } else {
                            return( 
                                <div>
                                    <div className="text-xs flex flex-row grow items-start pb-2">
                                        <RenderOptionComponent optionEntry={entry} optionSection={optionSection} optionClickedCallback={optionClickedCallback}/>
                                        <Label className="flex grow">{UIHelpers.getItemsArrayNames(entry.getItems())}</Label>
                                        <Label className="text-xs w-40 text-end border-1">{entry.getCost()} pts.</Label>
                                    </div>
                                    <RenderChildOptionSection optionEntry={entry} optionClickedCallback={optionClickedCallback} optionSection={optionSection}/>
                                </div>
                            )
                           }
                        })}
                    </div>
                )
            })
            }
        </div>
    )

}







export default function UnitOptionsView({ selectedUnit, optionClickedCallback, changeUnitSizeCallback }: UnitOptionsViewProps) {

    const SelectNumModels = () => {
        const { minNumber, maxNumber } = selectedUnit.getRangeNumModels();
        const rangeText = "[" + minNumber + (maxNumber == undefined ? "+]" : "-" + maxNumber + "]")
        return (
            <div>
                <label htmlFor="number-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Unit size {rangeText}:</label>
                {maxNumber == undefined ?
                    <input type="number"
                        id="number-input"
                        min={minNumber}
                        onChange={(e) => changeUnitSizeCallback(selectedUnit.id(), (e.target as HTMLInputElement).value)}
                        aria-describedby="helper-text-explanation"
                        autoFocus
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={selectedUnit.numModels()}
                        required />
                    :
                    <input type="number"
                        id="number-input"
                        min={minNumber}
                        max={maxNumber}
                        onChange={(e) => changeUnitSizeCallback(selectedUnit.id(), (e.target as HTMLInputElement).value)}
                        aria-describedby="helper-text-explanation"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        autoFocus
                        value={selectedUnit.numModels()}
                        required />
                }
            </div>
        )
    }
    const OptionsHeader = () => {
        return (
            <div className="flex flex-row mb-5">
                <div className="w-3/4 text-xl">{selectedUnit.getUnitProfile().getName()}</div>
                <div className="grow text-xl">Cost: {selectedUnit.getTotalCost()}</div>
            </div>
        )

    }

    

    return (
        <div className="flex flex-col divide-y divide-gray-200 bg-gray-50 p-4">
            <OptionsHeader />
            <SelectNumModels />
            <UnitOptionSections optionSections={selectedUnit.getOptionSections()} optionClickedCallback={optionClickedCallback}/>

        </div>

    )


}