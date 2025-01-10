import { StateService, ViewService } from './services';

import { DomHelper } from './helpers/DomHelper';
import { first } from 'rxjs';

document.addEventListener('DOMContentLoaded', () => {
  StateService.ready$.subscribe((ready) => {
    if (ready) {
      ViewService.initialise();
    }
  });

  StateService.zooName$.pipe(first()).subscribe((name) => {
    if (name) {
      DomHelper.updateTextContent('svg .zoo-name', name);
    } else {
      StateService.updateZooName('This is a zoo!');
    }
  });
});
