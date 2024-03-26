import { Animal, Enclosure, ZooArea } from '../models';

import { AnimalCardComponent } from './AnimalCard.component';
import { BaseComponent } from './Base.component';
import { DomHelper } from '../helpers/DomHelper';
import { DomSelector } from '../enums';
import { StateService } from '../services';

export class ZooAreaComponent extends BaseComponent {
  private animals: Animal[] = [];
  
  constructor(private zooArea: ZooArea, parent: HTMLElement) {
    super('zoo-area-component', parent, DomSelector.TEMPLATE_ZOO_AREA);

    this.component.classList.add(`area-${zooArea.id}`);


    zooArea.enclosures.forEach(this.createEnclosure.bind(this));
    DomHelper.addEventListener('.area-shop', 'click', this.openShop.bind(this), parent);
  }

  private createEnclosure(enclosure: Enclosure) {
    // TODO - add enclosure to component along with animals
    const enclosureElement = document.createElement('div');
    enclosureElement.className = `enclosure enclosure-${enclosure.id}`;

    enclosureElement.addEventListener('click', (event: Event) => {
      this.showAnimals(enclosure);
    });
    this.component.appendChild(enclosureElement);
    DomHelper.updateTextContent(`.enclosure-${enclosure.id}`, enclosure.name, this.component);
  }

  private openShop() {
    // TODO - open shop with list of each item;
  }

  private showAnimals(enclosure: Enclosure) {
    const animalContainer = this.parentElement.querySelector('.animal-list') as HTMLElement;
    this.animals = enclosure.animals.map(enclosureAnimal => {
      return StateService.getAnimalById(enclosureAnimal.id) as Animal;
    }).filter(animal => animal !== undefined)
      .sort((a, b) => {
        if (a.cost < b.cost) {
          return 1;
        } else if (a.cost > b.cost) {
          return -1
        }
        return a.name.localeCompare(b.name);
    });
    this.animals.forEach(animal => {
      new AnimalCardComponent(animal, this.zooArea, animalContainer);
    });
  }
}