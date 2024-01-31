'use client'

import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import NewListForm from "../ui/listCreationPanels/NewListForm";
import { useRouter } from 'next/navigation';
import { ArmyBuillderServiceSingleton } from "../lib/services/ArmyBuilderService";
import uuid from "react-uuid";


export interface createNewGameListParams {
  name:string,
  armyId:string,
  gameId:string,
  maxPoints:number;
}



export default function Page() {
  const [openModal, setOpenNewListForm] = useState(false);
  const service = ArmyBuillderServiceSingleton.getService();
  const router = useRouter();
 
  
 function onCloseModal() {
    setOpenNewListForm(false);
  }

  const gameHeaders =service.getGameHeaders()

  const [error, setError] = useState<string>('');

  const createNewGameList = ({name,armyId,gameId,maxPoints}: createNewGameListParams) => {

    try {
      const army = service.getArmy(armyId,gameId) 
      const newList = army.createList(uuid(),name,maxPoints) 
      setOpenNewListForm(false);
      router.push(`/lists/edit?listId=${newList.getId()}`);
    } catch(catchError) {
      if (catchError instanceof Error) {
          setError(JSON.stringify(catchError.message))
      }
     
  }
  }

  return (
    
    <div className="flex flex-col p-4">  
    <p>{error}</p>
      {gameHeaders.map ((header,index) => {
        
        return (
          <div key={index} className="p-4">
          <Button onClick={() => setOpenNewListForm(true)}>Create New List {header.getName()}</Button>
          <Modal show={openModal} size="md" onClose={onCloseModal} popup>
            <Modal.Header />
            <Modal.Body>
              <NewListForm gameId={header.getId()} createNewList={createNewGameList}/>
            </Modal.Body>
          </Modal>
          </div>
        )
      })}
      
    </div>
  );

  }