'use client'

import { useState } from 'react'
import useGameStore, { useContextStore } from "@/app/lib/stores/ContextStore";
import { Dropdown, Label, TextInput } from 'flowbite-react';
import { GameList } from '@/app/lib/model/GameList';



interface CreateEditListPanelProps {
    gameList:GameList    
}


export default function GameListHeader({gameList}:CreateEditListPanelProps) {

    return (        
        <div className="rounded-md bg-blue-600 p-4 md:h-20">
            <p>{gameList.getName()}:{gameList.getArmy().getName()} </p>
        </div>
    );
}
