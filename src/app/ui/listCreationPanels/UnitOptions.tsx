'use client';

import { UIHelpers } from "@/app/lib/helpers/UIHelpers"
import { OptionType, UnitOptionsSection } from "@/app/lib/model/UnitOptions"
import { Checkbox, Label, Radio } from "flowbite-react"
import { useState } from "react";




interface UnitOptionsProps {
    unitSections:UnitOptionsSection[]
    optionClickedCallback:(value:string)=>void
}

interface RenderSectionProps {
        optionSection:UnitOptionsSection
        onchange: (value:string)=>void
}


function RenderOptionSection({optionSection,onchange}:RenderSectionProps) {

    return (
        <fieldset className="flex max-w-md flex-col gap-4">
             <legend className="mb-4">{optionSection.getSectionName()}</legend>
        {optionSection.getOptionEntries().map ( ( entry) => {
              if(entry.isSelected())
                return (<div className="flex items-center gap-2">
                             <Radio id={entry.getId()} name={optionSection.getSectionName()} value={entry.getId()} defaultChecked  onChange={()=>onchange(entry.getId())}/>
                            <Label htmlFor="united-state">{UIHelpers.getItemsArrayNames(entry.getItems())}</Label>
                        </div>)
              else 
                return (<div className="flex items-center gap-2">
                     <Radio id={entry.getId()} name={optionSection.getSectionName()} value={entry.getId()} onChange={()=>onchange(entry.getId())}/>
                    <Label htmlFor="united-state">{UIHelpers.getItemsArrayNames(entry.getItems())}</Label>
         </div>)
          })}

    </fieldset>
    )

}





function RenderCheckBoxSection({optionSection,onchange}:RenderSectionProps) {

  
      
    return (
        
        <div className="flex max-w-md flex-col gap-4" id="checkbox">
          {optionSection.getOptionEntries().map ( ( entry) => {
                 if(entry.isSelected() && entry.getChildOptionSections().length>0) {
                        return ( 
                            <div>
                                <div className="flex items-center gap-2">             
                                    <Checkbox id={entry.getId()}  onChange={()=>onchange(entry.getId())} defaultChecked/>
                                    <Label htmlFor="accept" className="flex">{UIHelpers.getItemsArrayNames(entry.getItems())}</Label>
                                </div>
                                <UnitOptions unitSections={entry.getChildOptionSections()} optionClickedCallback={onchange}/>
                                </div>

                        )
                    } else if(entry.isSelected() && entry.getChildOptionSections().length==0)  {
                        return ( 
                            <div className="flex items-center gap-2">             
                                <Checkbox id={entry.getId()}  onChange={()=>onchange(entry.getId())} defaultChecked/>
                                <Label htmlFor="accept" className="flex">{UIHelpers.getItemsArrayNames(entry.getItems())}</Label>
                            </div>

                        )
                        
                    } else {
                        return (
                            <div className="flex items-center gap-2">      
                                <Checkbox id={entry.getId()}  onChange={()=>onchange(entry.getId())} />
                                <Label htmlFor="accept" className="flex">{UIHelpers.getItemsArrayNames(entry.getItems())}</Label>
                                </div>
                        ) 
                                
                    }
            }
        )}    
        </div>
    )


}



export default function UnitOptions({unitSections,optionClickedCallback}:UnitOptionsProps)  {


    const [debug, setDebug] = useState<string>('');

    const onOptionChange = (e: { target: { value: any; }; }) => {
        setDebug(debug + '  ' +  e.target.value)
      }
    

   
    return (
        <div className="flex flex-col divide-y divide-gray-200 bg-gray-50 p-5">
            {}
            {unitSections.map( (section ) => {
                if(section.getOptionType()==OptionType.OPTION) {
                    return (
                        <div>
                    
                    <RenderOptionSection optionSection={section} onchange={optionClickedCallback}/>
                    </div>
                    )
                } else {
                    return (<RenderCheckBoxSection optionSection={section} onchange={optionClickedCallback}/>)
                }
            })}


        </div>


    )





}