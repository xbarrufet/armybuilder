'use client'

import { useState } from 'react'
import useGameStore from "@/app/lib/stores/ContextStore";
import { HiOutlinePlus } from "react-icons/hi";
import { Label } from 'flowbite-react';
import { UnitProfile } from '@/app/lib/model/UnitProfile';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import { GameItem } from '@/app/lib/model/GameItem';
import { CategoryDefinition, CategoryValue } from '@/app/lib/model/GameCategory';
import { GameList } from '@/app/lib/model/GameList';
import { Item } from '@/app/lib/model/Item';
import { CounterType, ListValidationResult } from '@/app/lib/model/ListValidationRule';
import { SelectedUnit } from '@/app/lib/model/SelectedUnit';




export type UnitsSelectionPanelProps = {
    gameList: GameList
    category:CategoryDefinition
    categoryClickCallBack:(value:string)=>void;
    unitClickCallBack:(value:string)=>void
}



type GameListCategoryHeaderProps = {
    gameList:GameList
    mainCategory:CategoryDefinition
    subCategory:string
}
const GameListCategoryHeader = ({gameList,mainCategory,subCategory}:GameListCategoryHeaderProps)=> {
    const subCategoryName =mainCategory.getSubCategoryById(subCategory).getName()
    const listValidationRule = gameList.getArmy().getGame().getListValidationRule()
    const {result,message} = listValidationRule.validateSubCategory(subCategory,gameList)
    
    if(result==ListValidationResult.SUCCESS) {
        return (
            <div className="flex grow bg-green-200 p-2">
                <p className='w-4/5 text-left '>{subCategoryName}</p>
                <p className='flez grow text-right mr-2'>{gameList.getSubCategoryCounterText(subCategory)}</p>
            </div>
        )
    } else {
        return (
            <div className="flex grow  bg-red-200 p-2">
                <p className='w-4/5 text-left '>{subCategoryName}</p>
                <p className='flez grow text-right mr-2'>{gameList.getSubCategoryCounterText(subCategory)}</p>
            </div>
        )
    }
} 
    

type RenderSelectedUnitProps = {
    selectedUnit:SelectedUnit
    unitClickCallBack:(value:string)=>void
}
const RenderSelectedUnit=({selectedUnit,unitClickCallBack}:RenderSelectedUnitProps) => {
    return (
            <Link
                key={selectedUnit.getUnitProfile().getName()}
                href=""
                onClick={() => unitClickCallBack(selectedUnit.id())}
                className='flex  h-[30px] grow items-center justify-center gap-2 rounded-md text-sm p-3 hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'>
                 <p>{selectedUnit.numModels()} x {selectedUnit.getUnitProfile().getName()}--{selectedUnit.getTotalCost()}</p></Link>
    )
}

type GameListCategoryUnitsProps = {
    selectedUnits:SelectedUnit[]
    unitClickCallBack:(value:string)=>void
}
const GameListCategoryUnits = ({selectedUnits, unitClickCallBack }: GameListCategoryUnitsProps) => {
    return (
    
        <div className='flex flex-col font-medium '>
            <div className="flex flex-col divide-y divide-gray-200 bg-gray-50">
             {selectedUnits.map((unit, i) => {
                    return (
                    <RenderSelectedUnit selectedUnit={unit} unitClickCallBack={unitClickCallBack} />
            )})}
        </div>
        </div>
    );

}



export default function GameListView({ gameList,category,categoryClickCallBack,unitClickCallBack }: UnitsSelectionPanelProps) {
    
        category.getSubCategories().map( (subCategory) => {
                const selectedUnits = gameList.getSelectedUnitsByMainSubCategory(subCategory.getId())
                return (
                    <div className='flex flex-col w-100 space-y-2'>
                        <GameListCategoryHeader gameList={gameList} mainCategory={category} subCategory={subCategory.getId()}/>
                        <GameListCategoryUnits selectedUnits={selectedUnits} unitClickCallBack={unitClickCallBack}/>
                    </div>
                    )
            })         
}

