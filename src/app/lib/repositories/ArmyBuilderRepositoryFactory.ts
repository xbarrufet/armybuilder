import { ArmyBuilderRepository, ArmyBuilderRepositoryJSON } from "./ArmyBuilderRepository";

export class ArmyBuilderRepositoryFactory {


    static buildArmyBuilderRepositoryJSON():ArmyBuilderRepository {
        return new ArmyBuilderRepositoryJSON();
    }
}