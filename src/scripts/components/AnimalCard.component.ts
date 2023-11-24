import { Animal } from '../models';
import { BaseComponent } from './Base.component';
import { DomHelper } from '../helpers/DomHelper';
import { DomSelector } from '../enums';

export class AnimalCardComponent extends BaseComponent {
  
  constructor(private animal: Animal, areaName: string, parent: HTMLElement) {
    super('animal-card-component', parent, DomSelector.TEMPLATE_ANIMAL_CARD);

    DomHelper.updateTextContent('.animal-name', animal.name, this.component);
    DomHelper.updateTextContent('.area-name', areaName, this.component);
    const image = this.component.querySelector('img') as HTMLImageElement;
    image.src = `assets/animals${animal.id >= 1000 ? '/legendary' : ''}/${animal.id}.svg`;
  }
}