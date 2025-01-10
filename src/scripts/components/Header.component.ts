import {
  CorrectState,
  Difficulty,
  DomSelector,
  Operator,
  ViewType,
} from '../enums';
import { StateService, ViewService } from '../services';

import { BaseComponent } from './Base.component';
import { DomHelper } from '../helpers/DomHelper';
import { LevelSelectComponent } from './LevelSelect.component';
import { Levels } from '../models';
import { combineLatest } from 'rxjs';

export class HeaderComponent extends BaseComponent {
  private currentViewType?: ViewType;

  constructor() {
    const parent = document.querySelector('.header-wrapper') as HTMLElement;
    super('header-component', parent, DomSelector.TEMPLATE_HEADER);

    const operatorSymbol = this.component.querySelector(
      '.operator-symbol',
    ) as HTMLDivElement;
    operatorSymbol.addEventListener(
      'click',
      this.openOperatorSelector.bind(this),
    );

    this.subs.push(
      combineLatest([
        StateService.userZooCoins$,
        StateService.currentDifficulty$,
        StateService.currentOperator$,
        StateService.userLevels$,
      ]).subscribe(([coins, difficulty, operator, levels]) => {
        this.animateBalance(coins);
        this.setLevel(operator, difficulty, levels);
      }),
    );

    DomHelper.addEventListener('.menu > button', 'click', () =>
      ViewService.closeCurrentView(),
    );
  }

  destroy() {
    super.destroy();
  }

  private animateBalance(value: number) {
    DomHelper.updateTextContent('.balance', `${value}`, this.component);
    DomHelper.updateTextContent('.balance-effect', `${value}`, this.component);
    const balance = this.component.querySelector('.balance-effect');
    balance?.classList.add('animate');
    setTimeout(() => {
      balance?.classList.remove('animate');
    }, 1000);
  }

  private getOperatorClassname(operator: Operator) {
    switch (operator) {
      case Operator.ADDITION:
        return 'add';
      case Operator.DIVISION:
        return 'divide';
      case Operator.MULTIPLICATION:
        return 'multiply';
      case Operator.SUBTRACTION:
        return 'subtract';
    }
  }

  private openOperatorSelector() {
    new LevelSelectComponent();
  }

  private setLevel(operator: Operator, difficulty: Difficulty, levels: Levels) {
    const progress = levels[operator][difficulty][CorrectState.CORRECT];
    const progressEl = this.component.querySelector(
      'progress',
    ) as HTMLProgressElement;
    this.setOperator(operator);

    progressEl.value = progress % 10;
    progressEl.dataset.difficulty = Difficulty[difficulty];
  }

  private setOperator(operator: Operator) {
    const operatorSymbol = this.component.querySelector(
      '.operator-symbol',
    ) as HTMLDivElement;
    operatorSymbol.className = `operator-symbol ${this.getOperatorClassname(
      operator,
    )}`;
  }
}
