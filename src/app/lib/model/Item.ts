import { noSSR } from "next/dynamic";
import { GameItemDTO, ItemDTO } from "../data/DTO";






export interface Item  {
    getId():string;
    getName():string;
    isEmpty(): boolean ;
}




export class ItemImpl implements Item {
    private _id: string;
    private _name: string;
    constructor(id: string, name: string,description?:string|undefined) {
        this._id=id;
        this._name=name;
    }


    getId(): string {
        return this._id;
    }

    getName(): string {
        return this._name;
    }
  
    isEmpty(): boolean {
        return (this.getId()=="");
    }

    
}


export  class ItemFactory {
    
    static EMPTY_ITEM = new ItemImpl("","");

    static buildFromDTO(item:ItemDTO) {
        return new ItemImpl(item.id,item.name);

    }

    static build(id:string,name:string) {
        return new ItemImpl(id,name);
    }
}



