import { Animal, ZooArea } from '../models';
import { DomSelector, getClassFromEndangeredStatus } from '../enums';

import { BaseComponent } from './Base.component';
import { DomHelper } from '../helpers/DomHelper';
import { StateService } from '../services';

export class AnimalCardComponent extends BaseComponent {
  private buyButton: HTMLButtonElement;
  
  constructor(private animal: Animal, private area: ZooArea, parent: HTMLElement) {
    super('animal-card-component card', parent, DomSelector.TEMPLATE_ANIMAL_CARD);

    DomHelper.updateTextContent('.animal-name', animal.name, this.component);
    DomHelper.updateTextContent('.area-name', area.name, this.component);
    const image = this.component.querySelector('img') as HTMLImageElement;
    image.src = `assets/animals${animal.id >= 1000 ? '/legendary' : ''}/${animal.id}.svg`;

    const endangeredSpan = DomHelper.updateTextContent('.endangered-status', animal.endangeredStatus, this.component) as HTMLSpanElement;
    endangeredSpan.classList.add(
      getClassFromEndangeredStatus(animal.endangeredStatus)
    );
    DomHelper.updateTextContent('span.cost', `Cost: $${animal.cost}`, this.component);

    this.buyButton = DomHelper.addEventListener('button.buy-animal', 'click', this.buyAnimal.bind(this), this.component) as HTMLButtonElement;
  }

  destroy(): void {
    this.buyButton.removeEventListener('click', this.buyAnimal.bind(this));
    super.destroy();
  }

  private buyAnimal() {
    StateService.buyAnimal(this.animal.id, this.area.id);
  }
}