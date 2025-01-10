import { Animal, Enclosure, ZooArea } from '../models';
import { DomSelector, ViewType } from '../enums';
import { StateService, ViewService } from '../services';

import { AnimalCardComponent } from './AnimalCard.component';
import { BaseComponent } from './Base.component';
import { DomHelper } from '../helpers/DomHelper';

export class ZooAreaComponent extends BaseComponent {
  private animals: Animal[] = [];

  constructor(private zooArea: ZooArea) {
    const parent = document.querySelector('.area-wrapper') as HTMLElement;
    super('zoo-area-component', parent, DomSelector.TEMPLATE_ZOO_AREA);

    this.component.classList.add(`area-${zooArea.className}`);
    this.component.style.setProperty('--area-bg', `var(--${zooArea.className}-bg)`)

    zooArea.enclosures?.forEach(this.createEnclosure.bind(this));
    DomHelper.addEventListener(
      '.area-shop',
      'click',
      this.openShop.bind(this),
      parent,
    );

    // TODO - sub to zooAreas and update UI here if this zooArea updates
  }

  private createEnclosure(enclosure: Enclosure) {
    // TODO - add enclosure to component along with animals
    const enclosureElement = document.createElement('button');
    enclosureElement.className = `enclosure enclosure-${enclosure.id}${enclosure.unlocked ? '' : ' locked'}`;


    enclosureElement.addEventListener('click', (event: Event) => {
      if (enclosure.unlocked) {
        this.showAnimals(enclosure);
      } else {
        console.log('You need to unlock this!');
        StateService.buyEnclosure(enclosure.id, this.zooArea.id);
      }
    });
    this.component.appendChild(enclosureElement);
    DomHelper.updateTextContent(
      `.enclosure-${enclosure.id}`,
      enclosure.name,
      this.component,
    );
    
    const lock = document.createElement('span');
    lock.className = 'material-symbols-outlined lock';
    lock.textContent = 'lock';
    
    const price = document.createElement('span');
    price.className = 'price lock';
    price.textContent = `$${enclosure.cost}`;

    enclosureElement.appendChild(price);
  }

  private openShop() {
    // TODO - open shop with list of each item;
  }

  private showAnimals(enclosure: Enclosure) {
    const animalContainer = this.parentElement.querySelector(
      '.animal-list',
    ) as HTMLElement;
    this.animals = enclosure.animals
      .map((enclosureAnimal) => {
        return StateService.getAnimalById(enclosureAnimal.id) as Animal;
      })
      .filter((animal) => animal !== undefined)
      .sort((a, b) => {
        if (a.cost < b.cost) {
          return 1;
        } else if (a.cost > b.cost) {
          return -1;
        }
        return a.name.localeCompare(b.name);
      });
    this.animals.forEach((animal) => {
      new AnimalCardComponent(animal, this.zooArea, animalContainer);
    });
    ViewService.openView(ViewType.ENCLOSURE);
  }
}
