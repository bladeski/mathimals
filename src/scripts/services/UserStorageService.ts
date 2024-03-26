import { Decoration, Levels, ZooArea } from '../models';
import { Difficulty, Operator, StateProperty } from '../enums';

class UserStorageService {
  private settings = this.loadSettings();

  public getSetting(key: StateProperty) {
    return this.settings[key];
  }

  public getSettings() {
    return this.settings;
  }

  public updateSetting(key: StateProperty, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));

    switch (key) {
      case StateProperty.DECORATIONS:
        this.settings[key] = value as Decoration[];
        break;
      case StateProperty.ZOO_AREAS:
        this.settings[key] = value as ZooArea[];
        break;
      case StateProperty.FOOD:
      case StateProperty.ZOO_COINS:
        this.settings[key] = value as number;
        break;
      case StateProperty.LEVELS:
        this.settings[key] = value as Levels;
        break;
      case StateProperty.ZOO_NAME:
        this.settings[key] = value as string;
        break;
      case StateProperty.CURRENT_DIFFICULTY:
        this.settings[key] = value as Difficulty;
        break;
      case StateProperty.CURRENT_OPERATOR:
        this.settings[key] = value as Operator;
        break;
    
      default:
        break;
    }
  }

  private loadSettings() {
    return {
      [StateProperty.DECORATIONS]: JSON.parse(localStorage.getItem(StateProperty.DECORATIONS) || '[]') as Decoration[],
      [StateProperty.ZOO_AREAS]: JSON.parse(localStorage.getItem(StateProperty.ZOO_AREAS) || '[]') as ZooArea[],
      [StateProperty.FOOD]: JSON.parse(localStorage.getItem(StateProperty.FOOD) || '0') as number,
      [StateProperty.LEVELS]: JSON.parse(localStorage.getItem(StateProperty.LEVELS) || 'null') as Levels | null,
      [StateProperty.ZOO_COINS]: JSON.parse(localStorage.getItem(StateProperty.ZOO_COINS) || '100') as number,
      [StateProperty.ZOO_NAME]: JSON.parse(localStorage.getItem(StateProperty.ZOO_NAME) || '""') as string,
      [StateProperty.CURRENT_DIFFICULTY]: JSON.parse(localStorage.getItem(StateProperty.CURRENT_DIFFICULTY) || `${Difficulty.EASY}`) as Difficulty,
      [StateProperty.CURRENT_OPERATOR]: JSON.parse(localStorage.getItem(StateProperty.CURRENT_OPERATOR) || Operator.ADDITION) as Operator,
    }
  }
}

const userStorageService = new UserStorageService();
export default userStorageService;