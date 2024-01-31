import Link from "next/link";
import { GameItem } from "@/app/lib/model/GameItem";



type ArmyProfilesListParams =  {
    units: GameItem[];
    unitClickCallback:(value:string)=>void
}

interface ButtonProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    profileId:string
}
function Button({ onClick }: ButtonProps) {
    return  (
        <button onClick={onClick}>NOU</button>
    );
  }
  


export function ArmyProfilesList({units,unitClickCallback}:ArmyProfilesListParams) {


    
    const addProfileToGameList = (unitProfile:GameItem) => {
       // gameList.addProfile(unitProfile);
       // udpateGameList(gameList);
    }
    return (
        <div className="flex flex-col divide-y divide-gray-200 bg-gray-50">
       {units.map((unit, i) => {
            return (
                    <Link
                        key={i}
                        href=""
                        className='flex  h-[48px] grow items-center justify-center gap-2 rounded-md  p-3  font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'
                        onClick={()=>unitClickCallback(unit.getId())}><p>{unit.getName()}</p></Link>
                
            )})}
        </div>
    )

}

/*
 return (
        <div className="flex justify-center">
             <ListGroup className="w-48">
          {unitProfiles.map((profile, i) => {
            return (
                <ListGroup.Item key={i} onClick={()=>addProfileToGameList(profile)}>{profile.name()}</ListGroup.Item>
            )})}
            </ListGroup>
        </div>

    )
    */