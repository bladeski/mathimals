import {
  AnimalCardComponent,
  GatesComponent,
  HeaderComponent,
  HomeComponent,
  SumComponent,
  ZooAreaComponent,
} from '../components';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { GateOpen, ViewType } from '../enums';

import { DomHelper } from '../helpers/DomHelper';
import { ZooArea } from '../models';

class ViewService {
  public currentViewType$: Observable<ViewType>;
  public gateState$: Observable<GateOpen>;

  private animalComponents: AnimalCardComponent[] = [];
  private currentViewType: BehaviorSubject<ViewType> =
    new BehaviorSubject<ViewType>(ViewType.GATES);

  private gatesComponent?: GatesComponent;
  private gateState: BehaviorSubject<GateOpen> = new BehaviorSubject<GateOpen>(
    GateOpen.CLOSED,
  );

  private headerComponent?: HeaderComponent;
  private homeComponent?: HomeComponent;
  private zooAreaComponent?: ZooAreaComponent;

  constructor() {
    this.gateState$ = this.gateState.asObservable();
    this.currentViewType$ = this.currentViewType.asObservable();
  }

  closeCurrentView() {
    let sub: Subscription;
    switch (this.currentViewType.getValue()) {
      case ViewType.ENCLOSURE:
        this.openView(ViewType.AREA);
        sub = this.currentViewType$.subscribe((viewType) => {
          if (viewType === ViewType.AREA) {
            this.animalComponents.forEach((component) => component.destroy());
            this.animalComponents = [];
            sub.unsubscribe();
          }
        });
        break;
      case ViewType.AREA:        
        this.openView(ViewType.HOME);
        sub = this.currentViewType$.subscribe((viewType) => {
          if (viewType === ViewType.HOME) {
            this.zooAreaComponent?.destroy();
            this.zooAreaComponent = undefined;
            sub.unsubscribe();
          }
        });
        break;
      case ViewType.GAME:
        this.openView(ViewType.HOME);
        break;
      case ViewType.HOME:
      case ViewType.GATES:
        break;
    }
  }

  closeGate() {
    this.gateState.next(GateOpen.CLOSING);
  }

  initialise() {
    this.headerComponent = new HeaderComponent();
    this.homeComponent = new HomeComponent();
    this.gatesComponent = new GatesComponent();
  }

  openGate() {
    this.gateState.next(GateOpen.OPENING);
  }

  openView(viewType: ViewType) {
    let callback: () => void = () => null;

    switch (viewType) {
      case ViewType.ENCLOSURE:
        this.setViewType(viewType)
        return;
      case ViewType.AREA:
        callback = () => this.setViewType(viewType);
        break;
      case ViewType.GATES:
        this.closeGate();
        this.setViewType(viewType);
        return;
      case ViewType.GAME:
        callback = () => {
          new SumComponent();
          this.setViewType(viewType);
        };
        break;
      case ViewType.HOME:
        callback = () => this.setViewType(viewType);
        break;
    }
    this.transitionView(callback);
  }

  openZooArea(zooArea: ZooArea) {
    this.zooAreaComponent?.destroy();
    this.zooAreaComponent = new ZooAreaComponent(zooArea);
    this.openView(ViewType.AREA);
  }

  setGateState(state: GateOpen) {
    this.gateState.next(state);
  }

  private setViewType(viewType: ViewType) {
    DomHelper.setMode(viewType);
    this.currentViewType.next(viewType);
  }

  private transitionView(transitionCallback: () => void) {
    this.closeGate();
    const sub = this.gateState$.subscribe((state) => {
      if (state === GateOpen.CLOSED) {
        transitionCallback();

        this.openGate();
      } else if (state === GateOpen.OPEN) {
        sub.unsubscribe();
      }
    });
  }
}

const viewService = new ViewService();
export default viewService;
