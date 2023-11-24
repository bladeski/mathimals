import { Animal, Decoration, Levels, ZooArea } from '../models';

import { StateProperty } from '../enums';

class StorageService {
  public loadSettings() {
    return {
      [StateProperty.ANIMALS]: JSON.parse(localStorage.getItem(StateProperty.ANIMALS) || '[]') as Animal[],
      [StateProperty.DECORATIONS]: JSON.parse(localStorage.getItem(StateProperty.DECORATIONS) || '[]') as Decoration[],
      [StateProperty.ZOO_AREAS]: JSON.parse(localStorage.getItem(StateProperty.ZOO_AREAS) || '[]') as ZooArea[],
      [StateProperty.FOOD]: JSON.parse(localStorage.getItem(StateProperty.FOOD) || '0') as number,
      [StateProperty.LEVELS]: JSON.parse(localStorage.getItem(StateProperty.LEVELS) || 'null') as Levels | null,
      [StateProperty.ZOO_COINS]: JSON.parse(localStorage.getItem(StateProperty.ZOO_COINS) || '100') as number,
      [StateProperty.ZOO_NAME]: JSON.parse(localStorage.getItem(StateProperty.ZOO_NAME) || '""') as string,
    }
  }

  public updateSetting(key: StateProperty, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

const storageService = new StorageService();
export default storageService;