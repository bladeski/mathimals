import { Animal, BasicType, Decoration, Levels, ZooArea } from '../models';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { CorrectState, Difficulty, Operator } from '../enums';

import dataService from './DataService';

class StateService {
  public allAnimals$: Observable<Animal[]>;
  public allAnimalsAndAreas$: Observable<[Animal[], ZooArea[]]>;
  public allDecorations$: Observable<Decoration[]>;
  public allZooAreas$: Observable<ZooArea[]>;
  public currentDifficulty$: Observable<Difficulty>;
  public currentOperator$: Observable<Operator>;
  public ready$: Observable<boolean>;
  public userDecorations$: Observable<Decoration[]>;
  public userFood$: Observable<number>;
  public userLevels$: Observable<Levels>;
  public userZooCoins$: Observable<number>;
  public zooName$: Observable<string>;

  private allAnimals: BehaviorSubject<Animal[]> = new BehaviorSubject<Animal[]>(
    [],
  );

  private allDecorations: BehaviorSubject<Decoration[]> = new BehaviorSubject<
    Decoration[]
  >([]);

  private allZooAreas: BehaviorSubject<ZooArea[]> = new BehaviorSubject<
    ZooArea[]
  >([]);

  private currentDifficulty: BehaviorSubject<Difficulty> =
    new BehaviorSubject<Difficulty>(Difficulty.EASY);

  private currentOperator: BehaviorSubject<Operator> =
    new BehaviorSubject<Operator>(Operator.ADDITION);

  private ready: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private userDecorations: BehaviorSubject<Decoration[]> = new BehaviorSubject<
    Decoration[]
  >([]);

  private userFood: BehaviorSubject<number> = new BehaviorSubject(0);
  private userLevels: BehaviorSubject<Levels> = new BehaviorSubject(
    new Levels(),
  );

  private userZooCoins: BehaviorSubject<number> = new BehaviorSubject(0);
  private zooName: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() {
    this.ready$ = this.ready.asObservable();

    this.allAnimals$ = this.allAnimals.asObservable();
    this.allDecorations$ = this.allDecorations.asObservable();
    this.allZooAreas$ = this.allZooAreas.asObservable();

    this.currentDifficulty$ = this.currentDifficulty.asObservable();
    this.currentOperator$ = this.currentOperator.asObservable();
    this.userDecorations$ = this.userDecorations.asObservable();
    this.userFood$ = this.userFood.asObservable();
    this.userLevels$ = this.userLevels.asObservable();
    this.userZooCoins$ = this.userZooCoins.asObservable();
    this.zooName$ = this.zooName.asObservable();
    this.allAnimalsAndAreas$ = combineLatest([
      this.allAnimals$,
      this.allZooAreas$,
    ]);

    Promise.all([
      dataService.getAnimals(),
      dataService.getDecorations(),
      dataService.getZooAreas(),
      dataService.getZooCoins(),
      dataService.getCurrentDifficulty(),
      dataService.getCurrentOperator(),
      dataService.getLevels(),
    ])
      .then(
        ([
          animals,
          decorations,
          zooAreas,
          zooCoins,
          currentDifficulty,
          currentOperator,
          levels,
        ]) => {
          this.allAnimals.next(animals);
          this.allDecorations.next(decorations);
          this.allZooAreas.next(zooAreas);
          this.userZooCoins.next(zooCoins);
          this.currentDifficulty.next(currentDifficulty);
          this.currentOperator.next(currentOperator);
          this.userLevels.next(levels);

          this.ready.next(true);
        },
      )
      .catch((err) => console.log(err));
  }

  buyAnimal(animalId: number, areaId: number, count = 1) {
    const animal = this.allAnimals.getValue().find((an) => an.id === animalId);
    const zooArea = this.getZooArea(areaId);
    const enclosure = zooArea?.enclosures.find((enclosure) =>
      enclosure.animals.some((an) => an.id === animalId),
    );
    const enclosureAnimal = enclosure?.animals.find((an) => an.id === animalId);

    if (
      animal &&
      animal.cost <= this.userZooCoins.getValue() &&
      zooArea &&
      enclosureAnimal &&
      enclosureAnimal.count + count <= enclosureAnimal.maxCount
    ) {
      this.updateZooCoins(-animal.cost);
      enclosureAnimal.count += count;
      this.updateZooArea(zooArea);
    }
  }

  buyEnclosure(enclosureId: number, areaId: number) {
    const zooArea = this.getZooArea(areaId);
    const enclosure = zooArea?.enclosures.find((enclosure) =>
      enclosure.id === enclosureId
    );

    if (
      zooArea &&
      enclosure &&
      !enclosure.unlocked &&
      enclosure.cost <= this.userZooCoins.getValue()
    ) {
      this.updateZooCoins(-enclosure.cost);
      enclosure.unlocked = true;
      this.updateZooArea(zooArea);
    }
  }

  getAnimalById(animalId: number) {
    return this.allAnimals.getValue().find((animal) => animal.id === animalId);
  }

  getAnimalCount(animalId: number): number {
    return this.allZooAreas.getValue().reduce((curr, next) => {
      return (
        curr +
        next.enclosures.reduce((currEnc, nextEnc) => {
          return (
            currEnc +
            (nextEnc.animals.find((animal) => animal.id === animalId)?.count ||
              0)
          );
        }, 0)
      );
    }, 0);
  }

  getZooArea(areaId: number) {
    return this.allZooAreas.getValue().find((area) => area.id === areaId);
  }

  updateCurrentDifficulty(difficulty: Difficulty) {
    if (difficulty in Difficulty) {
      this.currentDifficulty.next(difficulty);
      dataService.updateCurrentDifficulty(difficulty);
    }
  }

  updateCurrentLevelCount(correctState: CorrectState) {
    const levels = {
      ...this.userLevels.getValue(),
    };
    const operator = this.currentOperator.getValue();
    const difficulty = this.currentDifficulty.getValue();

    levels[operator][difficulty][correctState]++;
    this.userLevels.next(levels);

    dataService.updateLevels(levels);
  }

  updateCurrentOperator(operator: Operator) {
    this.currentOperator.next(operator);
    dataService.updateCurrentOperator(operator);
  }

  updateDecoration(decoration: Decoration) {
    const decorations = this.updateArrayValue(
      decoration,
      this.userDecorations.getValue(),
    );
    this.userDecorations.next(decorations);
    dataService.updateDecorations(decorations);
  }

  updateFood(value: number) {
    this.userFood.next(value);
    dataService.updateFood(value);
  }

  updateZooArea(zooArea: ZooArea) {
    const zooAreas = this.updateArrayValue(
      zooArea,
      this.allZooAreas.getValue(),
    );
    this.allZooAreas.next(zooAreas);
    dataService.updateZooAreas(zooAreas);
  }

  updateZooCoins(value: number) {
    const newValue = this.userZooCoins.getValue() + value;
    this.userZooCoins.next(newValue);
    dataService.updateZooCoins(newValue);
  }

  updateZooName(value: string) {
    this.zooName.next(value);
    dataService.updateZooName(value);
  }

  private updateArrayValue<T extends BasicType>(item: T, array: T[]): T[] {
    const index = array.findIndex((x) => x.id === item.id);
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
