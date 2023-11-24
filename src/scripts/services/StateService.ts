import { Animal, BasicType, Decoration, Levels, ZooArea } from '../models';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Difficulty, Operator, StateProperty } from '../enums';

import dataService from './DataService';
import storageService from './StorageService';

class StateService {
  public allAnimals$: Observable<Animal[]>;
  public allDecorations$: Observable<Decoration[]>;
  public allZooAreas$: Observable<ZooArea[]>;
  public animals$: Observable<Animal[]>;
  public animalsAndAreas$: Observable<[Animal[], ZooArea[]]>;
  public decorations$: Observable<Decoration[]>;
  public food$: Observable<number>;
  public levels$: Observable<Levels>;
  public ready$: Observable<boolean>;
  public zooAreas$: Observable<ZooArea[]>;
  public zooCoins$: Observable<number>;
  public zooName$: Observable<string>;

  private allAnimals: BehaviorSubject<Animal[]> = new BehaviorSubject([] as Animal[]);
  private allDecorations: BehaviorSubject<Decoration[]> = new BehaviorSubject([] as Decoration[]);
  private allZooAreas: BehaviorSubject<ZooArea[]> = new BehaviorSubject([] as ZooArea[]);
  private animals: BehaviorSubject<Animal[]>;
  private decorations: BehaviorSubject<Decoration[]>;
  private food: BehaviorSubject<number>;
  private levels: BehaviorSubject<Levels>;
  private ready: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private zooAreas: BehaviorSubject<ZooArea[]>;
  private zooCoins: BehaviorSubject<number>;
  private zooName: BehaviorSubject<string>;

  constructor() {
    this.ready$ = this.ready.asObservable();

    const loadedSettings = storageService.loadSettings();
    
    this.animals = new BehaviorSubject(loadedSettings[StateProperty.ANIMALS]);
    this.decorations = new BehaviorSubject(loadedSettings[StateProperty.DECORATIONS]);
    this.zooAreas = new BehaviorSubject(loadedSettings[StateProperty.ZOO_AREAS]);
    this.food = new BehaviorSubject(loadedSettings[StateProperty.FOOD]);
    this.levels = new BehaviorSubject(loadedSettings[StateProperty.LEVELS] || new Levels());
    this.zooCoins = new BehaviorSubject(loadedSettings[StateProperty.ZOO_COINS]);
    this.zooName = new BehaviorSubject(loadedSettings[StateProperty.ZOO_NAME]);

    this.allAnimals$ = this.allAnimals.asObservable();
    this.allDecorations$ = this.allDecorations.asObservable();
    this.allZooAreas$ = this.allZooAreas.asObservable();

    this.animals$ = this.animals.asObservable();
    this.decorations$ = this.decorations.asObservable();
    this.zooAreas$ = this.zooAreas.asObservable();
    this.food$ = this.food.asObservable();
    this.levels$ = this.levels.asObservable();
    this.zooCoins$ = this.zooCoins.asObservable();
    this.zooName$ = this.zooName.asObservable();
    this.animalsAndAreas$ = combineLatest([this.allAnimals$, this.allZooAreas$]);

    Promise.all([
      dataService.getAnimals(),
      dataService.getDecorations(),
      dataService.getZooAreas(),
    ]).then(([animals, decorations, zooAreas]) => {
      this.allAnimals.next(animals);
      this.allDecorations.next(decorations);
      this.allZooAreas.next(zooAreas);

      this.ready.next(true);
    }).catch(err => console.log(err));
  }

  updateAnimal(animal: Animal) {
    const animals = this.updateArrayValue(animal, this.animals.getValue());

    this.animals.next(animals);
    storageService.updateSetting(StateProperty.ANIMALS, animals);
  }

  updateDecoration(decoration: Decoration) {
    const decorations = this.updateArrayValue(decoration, this.decorations.getValue());
    this.decorations.next(decorations);
    storageService.updateSetting(StateProperty.DECORATIONS, decorations);
  }

  updateFood(value: number) {
    this.food.next(value);
    storageService.updateSetting(StateProperty.FOOD, value);
  }

  updateLevel(level: Operator, difficulty: Difficulty) {
    const levels = {
      ...this.levels.getValue(),
      [level]: difficulty
    };
    this.levels.next(levels);
    storageService.updateSetting(StateProperty.LEVELS, levels);
  }

  updateZooArea(zooArea: ZooArea) {
    const zooAreas = this.updateArrayValue(zooArea, this.zooAreas.getValue());
    this.zooAreas.next(zooAreas);
    storageService.updateSetting(StateProperty.ZOO_AREAS, zooAreas);
  }

  updateZooCoins(value: number) {
    this.zooCoins.next(value);
    storageService.updateSetting(StateProperty.ZOO_COINS, value);
  }

  updateZooName(value: string) {
    this.zooName.next(value);
    storageService.updateSetting(StateProperty.ZOO_NAME, value);
  }

  private updateArrayValue<T extends BasicType>(item: T, array: T[]): T[] {
    const index = array.findIndex(x => x.id === item.id);
    if (index >= 0) {
      array.splice(index, 1);
    }
    array.push(item);
    array.sort((a, b) => a.id - b.id);
    return array;
  }
}

const stateService = new StateService();
export default stateService;