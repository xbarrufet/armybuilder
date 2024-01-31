'use client'

import { ArmyBuillderServiceSingleton } from "@/app/lib/services/ArmyBuilderService";
import { useContextStore } from "@/app/lib/stores/ContextStore";
import { createNewGameListParams } from "@/app/lists/page";
import { Label, TextInput, Checkbox, Button, Dropdown } from "flowbite-react";
import { ChangeEvent, useState } from "react";






export interface NewListFormProps {
    gameId:string,
    createNewList: (params: createNewGameListParams) => void;
}
  


export default function NewListForm({gameId,createNewList}:NewListFormProps) {
    
    const service = ArmyBuillderServiceSingleton.getService();
    const armyHeaders = service.getArmyHeaders(gameId)

    const [listName, setListName] = useState<string>('');
    const [armyId, setArmyId] = useState<string>('');
    const [maxPoints, setMaxPoints] = useState<number>(2000);

   const submitForm = () => {
        createNewList({name:listName,armyId:armyId,gameId:gameId,maxPoints:maxPoints})
   }

    return (
        <form >
           
        <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Create New List</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="List Name" />
              </div>
              <TextInput
                id="listName"
                placeholder="List Name"
                required
                onChange={(e: ChangeEvent<HTMLInputElement>) => setListName(e.target.value)}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="army" value="Select Army" />
              </div>
              <select id="maxPoints" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setArmyId(e.target.value)}>
                    <option selected>Select Army</option>
                        {armyHeaders.map((army, i) => <option value={army.getId()}>{army.getName()}</option>)}
                </select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="maxPoints" value="Max Points List" />
              </div>
              <select id="maxPoints" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
               onChange={(e: ChangeEvent<HTMLSelectElement>) => setMaxPoints(Number(e.target.value))}>
                    <option value="500">500s</option>
                    <option value="1000">1.000</option>
                    <option value="1500">1.500</option>
                    <option selected value="2000">2.000</option>
                    <option value="3000">3.000</option>
                    <option value="5000">5.000</option>
                    <option value="7000">7.000</option>
                    <option value="10000">10.000</option>
            </select>
            </div>
            <div className="flex flex-col items-center justify-center">
              <button onClick={submitForm}>Create List</button>
            </div>
            
          </div>
          </form>
    );
}
