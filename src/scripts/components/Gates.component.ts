import { DomSelector, GateOpen } from '../enums';

import { BaseComponent } from './Base.component';
import { DomHelper } from '../helpers/DomHelper';
import { StateService } from '../services';

export class GatesComponent extends BaseComponent {
  private openState: GateOpen = GateOpen.CLOSED;
  
  constructor() {
    const parent = document.querySelector('main') as HTMLElement;
    super('gates-component', parent, DomSelector.TEMPLATE_GATES);
    
    this.subs.push(StateService.zooName$.subscribe(name => DomHelper.updateTextContent('.zoo-name', name, this.component)));

    this.subs.push(StateService.gateState$.subscribe(openState => {
      this.openState = openState;
      if (openState === GateOpen.OPENING) {
        this.openGate();
      } else if (openState === GateOpen.CLOSING) {
        this.closeGate();
      }
    }));

    DomHelper.addEventListener('.gates', 'click', (ev: Event) => {
      if (this.openState === GateOpen.CLOSED) {
        StateService.openGate();
      } else if (this.openState === GateOpen.OPEN) {
        StateService.closeGate();
      }
    });
  }

  private closeGate() {
    this.component.classList.remove('open');
    setTimeout(() => {
      StateService.setGateState(GateOpen.CLOSED);
    }, 1500);
  }

  private openGate() {
    this.component.classList.add('open');
    setTimeout(() => {
      StateService.setGateState(GateOpen.OPEN);
    }, 1500);
  }
}