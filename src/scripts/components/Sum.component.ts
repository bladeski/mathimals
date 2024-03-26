import { CorrectState, DomSelector } from '../enums';

import { BaseComponent } from './Base.component';
import { DomHelper } from '../helpers/DomHelper';
import { StateService } from '../services';
import { Sum } from '../models';
import { combineLatest } from 'rxjs';
import confetti from 'canvas-confetti';

export class SumComponent extends BaseComponent {
  private confettiOptions: confetti.Options = {
    particleCount: 100,
    spread: 60,
    ticks: 125
  };

  private reward = 0;
  private sum: Sum = new Sum();
  
  constructor(parent: HTMLElement) {
    super('sum-component', parent, DomSelector.TEMPLATE_SUM);

    this.subs.push(
      combineLatest([
        StateService.currentDifficulty$,
        StateService.currentOperator$
      ]).subscribe(([difficulty, operator]) => {
        this.sum = new Sum(operator, difficulty);

        DomHelper.updateTextContent('.summand1', this.sum.summands[0].toString(), this.component);
        DomHelper.updateTextContent('.summand2', this.sum.summands[1].toString(), this.component);
        DomHelper.updateTextContent('.operator', this.sum.operator, this.component);

        const options = this.component.querySelector('span.options');
        options?.replaceChildren();
        
        this.sum.answers.forEach((answer, index) => {
          const answerEl = document.createElement('span');
          answerEl.className = `option-${index} card`;
          answerEl.textContent = answer.toString();
          options?.appendChild(answerEl);

          DomHelper.addEventListener(`.option-${index}`, 'click', this.onClickOption.bind(this), this.component);
        });

        this.updateReward(50 * (this.sum.answers.length - 1));
      })
    );
  }

  private nextSum() {
    new SumComponent(document.body);
    this.destroy();
  }

  private onClickOption(event: Event) {
    if (this.reward > 0) {
      const answer = (event.target as HTMLSpanElement).textContent || '';
      DomHelper.updateTextContent('.answer', answer, this.component);
      if (parseInt(answer) === this.sum.result) {
        this.component.classList.add('correct');
        this.component.classList.remove('incorrect');
        StateService.updateZooCoins(this.reward);
        StateService.updateCurrentLevelCount(CorrectState.CORRECT);
        confetti(this.confettiOptions)?.then(() => {
          this.nextSum();
        }).catch(err => {
          console.log(err);
          this.nextSum();
        });
      } else {
        this.component.classList.add('incorrect');

        this.updateReward(this.reward - 50);
        StateService.updateCurrentLevelCount(CorrectState.INCORRECT);
        
        if (this.reward <= 0) {
          this.nextSum();
        }
      }
    }
  }

  private updateReward(reward: number) {
    this.reward = reward;
    DomHelper.updateTextContent('.reward', `$${this.reward.toString()}`, this.component);
  }
}