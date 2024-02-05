import { CategoryDefinition } from "./GameCategory";
import { GameList } from "./GameList";
import { SelectedUnit } from "./SelectedUnit";

export type ValidationRuleLimits =  {
    min:number,max:number
}


export enum CounterType {POINTS,UNITS }
export enum ListValidationResult {SUCCESS=0, MIN_NOT_REACHERD=-1,MAX_REACHED=1}
const NO_MAX_LIMIT:number = 10000
const NO_MIN_LIMIT:number = 0



export interface ListValidationRule {
    getLimits(subCategory:string):{min:number,max:number}
    validateSubCategory(subCategory:string, gameList:GameList):{result:ListValidationResult,message:string}
    hasMinLimit(subCategory:string):boolean
    hasMaxLimit(subCategory:string):boolean
    getMinLimit(subCategory:string):number;
    getMaxLimit(subCategory:string):number
    getCounterType():CounterType
}



export class  ListValidationRuleImpl implements ListValidationRule{

    private _limits:Map<string,ValidationRuleLimits>
    private _counterType:CounterType;

    

    constructor(limits:Map<string,ValidationRuleLimits>,counterType:CounterType) {
        this._limits=limits
        this._counterType=counterType;
    }
    getCounterType(): CounterType {
       return this._counterType;
    }
    hasMinLimit(subCategory: string): boolean {
        const limits = this.getLimits(subCategory)
        return limits.min>NO_MIN_LIMIT;
    }
    hasMaxLimit(subCategory: string): boolean {
        const limits = this.getLimits(subCategory)
        return limits.max<NO_MAX_LIMIT;
    }
    getMinLimit(subCategory: string): number {
        const limits = this.getLimits(subCategory)
        return limits.min
    }
    getMaxLimit(subCategory: string): number {
        const limits = this.getLimits(subCategory)
        return limits.max;
    }
    validateSubCategory(subCategory: string, gameList: GameList): {result:ListValidationResult,message:string} {
        const selectedUnits:SelectedUnit[] = gameList.getSelectedUnitsByMainSubCategory(subCategory);
        const limits = this.getLimits(subCategory)
        if(this._counterType==CounterType.POINTS) {
            const totalPoints = selectedUnits.map( (unit) => unit.getTotalCost()).reduce ( (total, current) => total+current,0);
            if(totalPoints< limits.min*gameList.getMaxPoints())
                return {result:ListValidationResult.MIN_NOT_REACHERD,message:`You need ${Math.round(limits.min*gameList.getMaxPoints())} points of this catgory`}
            else if (totalPoints< limits.max*gameList.getMaxPoints())
                return {result:ListValidationResult.SUCCESS,message:`OK`}
            else {
                return {result:ListValidationResult.MAX_REACHED,message:`You can't excceed ${Math.round(limits.max*gameList.getMaxPoints())} points of this catgory`}
            }

        } else {
            if(selectedUnits.length< limits.min)
                return {result:ListValidationResult.MIN_NOT_REACHERD,message:`You need ${limits.min} units in this catgory`}
            else if (selectedUnits.length< limits.max)
            return {result:ListValidationResult.SUCCESS,message:`OK`}
            else {
                return {result:ListValidationResult.MAX_REACHED,message:`You can't excceed ${limits.max} units in this catgory`}
            }

        }
    }


    getLimits(subCategory: string): { min: number; max: number; } {
        const limits = this._limits.get(subCategory)
        if(limits == undefined)
            return {min:0,max:NO_MAX_LIMIT}
        return limits;
    }

}

export class ListValidationRuleFactory  {


    static EMPTY_LIMIT = {min:NO_MIN_LIMIT, max:NO_MAX_LIMIT}

    static build(mainCategory:CategoryDefinition,limits:Map<string,ValidationRuleLimits>,counterType:CounterType):ListValidationRule {
        const completeLimits = new Map<string,ValidationRuleLimits>();
        mainCategory.getSubCategories().forEach ( (subCategory) => {
            const subLimit = limits.get(subCategory.getId())
            if(subLimit==undefined) {
                completeLimits.set(subCategory.getId(),this.EMPTY_LIMIT)
            } else {
                completeLimits.set (subCategory.getId(),subLimit);
            }
        })
        return new ListValidationRuleImpl(completeLimits,counterType)

    }

    static buildLimit(min?:number|undefined, max?:number|undefined):ValidationRuleLimits {
        if(min==undefined) {
            if(max==undefined)
                return this.EMPTY_LIMIT
            else    
                return {min:NO_MIN_LIMIT,max:max}
        } else {
            if(max==undefined)
                return {min:min,max:NO_MAX_LIMIT}
            else
                return {min:min, max:max}
        }
    }

}