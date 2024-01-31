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
import { GameList, SelectedUnit } from '@/app/lib/model/GameList';
import { Item } from '@/app/lib/model/Item';




export type UnitsSelectionPanelProps = {
    gameList: GameList
    category:CategoryDefinition
    categoryClickCallBack:(value:string)=>void;
    unitClickCallBack:(value:string)=>void
}


type GameListSectionProps = {
    categoryValue: Item,
    selectedUnits:SelectedUnit[]
    categoryClickCallBack:(value:string)=>void
    unitClickCallBack:(value:string)=>void
}






export const GameListSection = ({categoryValue,selectedUnits,categoryClickCallBack ,unitClickCallBack }: GameListSectionProps) => {
    return (
    
        <div className='flex flex-col font-medium '>
            <div className='flex flex-row bg-white h-10 items-center p-2 border-t-2 border-b-2 border-gray-400 '>
                <div className='w-80'><p className="text-center align-bottom">{categoryValue.getName()}</p></div>
                <div className='w-20 text-center'> 
                     <Button  size="sm" color="blue" className="bg-blue-600" onClick={() => categoryClickCallBack(categoryValue.getId())} ><HiOutlinePlus/></Button>
                </div>
            </div>
            <div className="flex flex-col divide-y divide-gray-200 bg-gray-50">
             {selectedUnits.map((unit, i) => {
                    return (
                    <Link
                        key={unit.getUnitProfile().getName()}
                        href=""
                        onClick={() => unitClickCallBack(unit.id())}
                        className='flex  h-[30px] grow items-center justify-center gap-2 rounded-md text-sm p-3 hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'>
                         <p>{unit.numModels()} x {unit.getUnitProfile().getName()}--{unit.getTotalCost()}</p></Link>
                
            )})}
        </div>
        </div>
    );

}



export default function UnitsSelectedView({ gameList,category,categoryClickCallBack,unitClickCallBack }: UnitsSelectionPanelProps) {
    
   /* const handleButtonClik = () => {
        updateCategory(categories[0].getId())
    }*/


    return (
        <div className='flex flex-col w-100 space-y-2'>
            {category.getSubCategories().map( (subCategory) => {
                return (<GameListSection selectedUnits={gameList.getUnitsByMainSubCategory(subCategory.getId())} categoryValue={subCategory} categoryClickCallBack={categoryClickCallBack} unitClickCallBack={unitClickCallBack}></GameListSection>)
            })}
        </div>
    )
}

/*
  return (
        <div>
            {categories.map((category,i) => <GameListSection key={i} category={category}/>)}
            {Array.from(selectedUnits.entries()).map( (entry) => {
                const [key, value] = entry;
                return (<GameListSection selectedUnits={value} categoryValue={key.category}></GameListSection>)
            })}
        </div>         
    )

     <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                <li className="pb-3 sm:pb-4">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {unit.unitName()}
                            </p>
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            {unit.unitCategory()}
                            </p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                            {unit.totalPoints()}
                        </div>
                    </div>
                </li>
            </ul>

*/


