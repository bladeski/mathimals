import { GatesComponent, HeaderComponent } from './components';

import { DomHelper } from './helpers/DomHelper';
import { GateOpen } from './enums';
import { HomeComponent } from './components/Home.component';
import { StateService } from './services';
import { first } from 'rxjs';

document.addEventListener('DOMContentLoaded', () => {

  StateService.ready$.subscribe(ready => {
    ready && console.log('Ready');

    const headerComponent = new HeaderComponent();
    const homeComponent = new HomeComponent();
    const gatesComponent = new GatesComponent();

    
  });

  StateService.zooName$.pipe(first()).subscribe(name => {
    if (name) {
      DomHelper.updateTextContent('svg .zoo-name', name);
    } else {
      StateService.updateZooName('This is a zoo!')
    }
  })
});