import { Difficulty, DomSelector, Operator } from '../enums';

import { BaseComponent } from './Base.component';
import { DomHelper } from '../helpers/DomHelper';
import { StateService } from '../services';
import { combineLatest } from 'rxjs';

export class LevelSelectComponent extends BaseComponent {
  constructor() {
    const parent = document.querySelector('main') as HTMLElement;
    super('level-select-component', parent, DomSelector.TEMPLATE_LEVEL_SELECT);

    DomHelper.addEventListener(
      'button',
      'click',
      this.onClickPlay.bind(this),
      this.component,
    );
    this.component.addEventListener('click', this.onClickComponent.bind(this));

    this.subs.push(
      combineLatest([
        StateService.currentDifficulty$,
        StateService.currentOperator$,
      ]).subscribe(([difficulty, operator]) => {
        const difficultyEl = this.component.querySelector(
          '#difficulty',
        ) as HTMLSelectElement;
        const operatorEl = this.component.querySelector(
          '#operator',
        ) as HTMLSelectElement;
        difficultyEl.value = `${difficulty}`;
        operatorEl.value = `${operator}`;
      }),
    );
  }

  private onClickComponent(event: MouseEvent) {
    if (
      (event.target as HTMLElement).nodeName === 'FORM' ||
      (event.target as HTMLElement).closest('form')
    ) {
      return;
    }

    this.destroy();
  }

  private onClickPlay() {
    const form = this.component.querySelector('form') as HTMLFormElement;
    const formData = new FormData(form);
    StateService.updateCurrentOperator(formData.get('operator') as Operator);
    StateService.updateCurrentDifficulty(
      parseInt(formData.get('difficulty') as string) as Difficulty,
    );

    this.destroy();
  }
}
