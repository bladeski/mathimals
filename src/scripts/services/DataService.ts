import { Animal, Decoration, Levels, ZooArea } from '../models';
import { Animals, Decorations, ZooAreas } from '../../data';
import {
  Difficulty,
  EndangeredStatus,
  Operator,
  StateProperty,
} from '../enums';

import UserStorageService from './UserStorageService';

class DataService {
  private static getAnimalCost(animal: Animal): number {
    switch (animal.endangeredStatus) {
      case EndangeredStatus.NOT_EVALUATED:
      case EndangeredStatus.DATA_DEFICIENT:
      case EndangeredStatus.LEAST_CONCERN:
        return 50;
      case EndangeredStatus.NEAR_THREATENED:
        return 100;
      case EndangeredStatus.VULNERABLE:
        return 150;
      case EndangeredStatus.ENDANGERED:
        return 250;
      case EndangeredStatus.CRITICALLY_ENDANGERED:
        return 500;
      case EndangeredStatus.EXTINCT_IN_THE_WILD:
        return 1000;
      case EndangeredStatus.EXTINCT:
        return 5000;
      default:
        return 50;
    }
  }

  public getAnimals() {
    return new Promise<Animal[]>((res) =>
      res(
        Animals,
      ),
    );
  }

  public getCurrentDifficulty() {
    return new Promise<Difficulty>((res) =>
      res(
        (UserStorageService.getSetting(
          StateProperty.CURRENT_DIFFICULTY,
        ) as Difficulty) || Difficulty.EASY,
      ),
    );
  }

  public getCurrentOperator() {
    return new Promise<Operator>((res) =>
      res(
        (UserStorageService.getSetting(
          StateProperty.CURRENT_OPERATOR,
        ) as Operator) || Operator.ADDITION,
      ),
    );
  }

  public getDecorations() {
    return new Promise<Decoration[]>((res) => res(Decorations));
  }

  public getLevels() {
    return new Promise<Levels>((res) =>
      res(
        (UserStorageService.getSetting(StateProperty.LEVELS) as Levels) ||
          new Levels(),
      ),
    );
  }

  public getZooAreas() {
    return new Promise<ZooArea[]>((res) =>
      res(
        ZooAreas.map((zooArea) => ({
          ...zooArea,
          ...(
            UserStorageService.getSetting(StateProperty.ZOO_AREAS) as ZooArea[]
          ).find((area) => area.id === zooArea.id),
        })),
      ),
    );
  }

  public getZooCoins() {
    return new Promise<number>((res) =>
      res(UserStorageService.getSetting(StateProperty.ZOO_COINS) as number),
    );
  }

  public updateCurrentDifficulty(difficulty: Difficulty) {
    UserStorageService.updateSetting(
      StateProperty.CURRENT_DIFFICULTY,
      difficulty,
    );
  }

  public updateCurrentOperator(operator: Operator) {
    UserStorageService.updateSetting(StateProperty.CURRENT_OPERATOR, operator);
  }

  public updateDecorations(decoration: Decoration[]) {
    UserStorageService.updateSetting(StateProperty.DECORATIONS, decoration);
  }

  public updateFood(food: number) {
    UserStorageService.updateSetting(StateProperty.FOOD, food);
  }

  public updateLevels(levels: Levels) {
    UserStorageService.updateSetting(StateProperty.LEVELS, levels);
  }

  public updateZooAreas(areas: ZooArea[]) {
    UserStorageService.updateSetting(StateProperty.ZOO_AREAS, areas);
  }

  public updateZooCoins(coins: number) {
    UserStorageService.updateSetting(StateProperty.ZOO_COINS, coins);
  }

  public updateZooName(name: string) {
    UserStorageService.updateSetting(StateProperty.ZOO_NAME, name);
  }
}

const dataService = new DataService();
export default dataService;
