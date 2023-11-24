import { DomHelper } from './helpers/DomHelper';
import { HeaderComponent } from './components';
import { HomeComponent } from './components/Home.component';
import { StateService } from './services';
import { first } from 'rxjs';

document.addEventListener('DOMContentLoaded', () => {

  StateService.ready$.subscribe(ready => {
    ready && console.log('Ready');

    const headerComponent = new HeaderComponent();
    const homeComponent = new HomeComponent();

    // StateService.animalsAndAreas$.subscribe(([animals, areas]) => {
    //   const areaIndex = Math.round(Math.random() * (areas.length - 1));
    //   const animalIndex = Math.round(Math.random() * (areas[areaIndex].animals.length - 1));
    //   const animal = animals.find(animal => animal.id === areas[areaIndex].animals[animalIndex]);

    //   if (animal) {
    //     const wrapper = document.createElement('div');
    //     wrapper.className = 'animal-card-wrapper';

    //     const animalComponent = new AnimalCardComponent(animal, areas[areaIndex].name, wrapper);


    //   }
    // });
  });

  StateService.zooName$.pipe(first()).subscribe(name => {
    if (name) {
      DomHelper.updateTextContent('svg .zoo-name', name);
    } else {
      StateService.updateZooName('This is a zoo!')
    }
  })
});