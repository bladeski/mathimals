import { BaseComponent } from './Base.component';
import { DomHelper } from '../helpers/DomHelper';
import { DomSelector } from '../enums';
import { StateService } from '../services';

export class HeaderComponent extends BaseComponent {
  private balance: HTMLDivElement;
  private menuButton?: HTMLButtonElement;
  
  constructor() {
    const parent = document.querySelector('main') as HTMLElement;
    super('header-component', parent, DomSelector.TEMPLATE_HEADER);

    this.balance = this.component.querySelector('.balance') as HTMLDivElement;

    this.subs.push(StateService.zooCoins$.subscribe(coins => this.balance.textContent = `${coins}`));
  }

  destroy() {
    super.destroy();
  }
}