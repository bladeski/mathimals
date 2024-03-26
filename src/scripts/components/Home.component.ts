import { DomSelector, GateOpen } from '../enums';
import { combineLatest, first } from 'rxjs';

import { BaseComponent } from './Base.component';
import { DomHelper } from '../helpers/DomHelper';
import { StateService } from '../services';
import { SumComponent } from './Sum.component';
import { ZooArea } from './../models/ZooArea';
import { ZooAreaComponent } from './ZooArea.component';

export class HomeComponent extends BaseComponent {
  private rotateLeftButton?: HTMLButtonElement;
  private rotateRightButton?: HTMLButtonElement;
  
  constructor() {
    const parent = document.querySelector('main') as HTMLElement;
    super('home-component', parent, DomSelector.TEMPLATE_MAIN_BG);

    this.rotateLeftButton =
      DomHelper.addEventListener(DomSelector.ROTATE_LEFT_BUTTON, 'click', rotate, this.component) as HTMLButtonElement;
    this.rotateRightButton =
      DomHelper.addEventListener(DomSelector.ROTATE_RIGHT_BUTTON, 'click', rotate, this.component) as HTMLButtonElement;
    
    this.subs.push(
      combineLatest([StateService.allZooAreas$]).subscribe(([areas]) => {
        const areaEls = this.component.querySelectorAll('.grass-circle > *[id^=area]');

        areaEls.forEach((svgArea) => this.initialiseArea(areas, svgArea as HTMLElement));
      })
    );

    DomHelper.addEventListener('.area.play', 'click', () => {
      StateService.closeGate();
      const sub = StateService.gateState$.subscribe(state => {
        if (state === GateOpen.CLOSED){
          DomHelper.setMode('game');
          new SumComponent(document.body);

          StateService.openGate();
        } else if (state === GateOpen.OPEN) {
          sub.unsubscribe();
        }});
    });
  }

  destroy() {
    this.rotateLeftButton?.removeEventListener('click', rotate)
    this.rotateRightButton?.removeEventListener('click', rotate)
    super.destroy();
  }

  initialiseArea(areas: ZooArea[], areaEl: HTMLElement) {
    areaEl.addEventListener('click', (event) => {
      const areaId = parseInt((event.currentTarget as HTMLElement).id?.slice(4));
      const area = areas.find(a => a.id === areaId);

      area && new ZooAreaComponent(area, this.parentElement);
      DomHelper.setMode('area');
    });
  }
}

function rotate(event: Event) {
  let angle = parseInt((event.currentTarget as HTMLButtonElement).dataset.angle || '30');
  const areasImage = document.querySelector('.grass-circle') as HTMLElement;

  const rotate = areasImage.style.transform.match(/rotate\((-?\d+)(.+)\)/);
  if (rotate) {
    const [num] = rotate.slice(1);  // slice is needed since first element contains entire match
    angle += parseInt(num);
  }
  areasImage.style.setProperty('transform', `rotate(${angle}deg)`);

  StateService.userLevels$.pipe(first()).subscribe(levels => {
    const hasUnlockedLegendary = 
      levels['+'][3][1] >= 10
      && levels['-'][3][1] >= 10
      && levels['×'][3][1] >= 10
      && levels['÷'][3][1] >= 10;
    const legendarySection = document.querySelector('.area.legendary');
  
    if (hasUnlockedLegendary && (angle % 360 === 180 || angle % 360 === -180)) {
      legendarySection && legendarySection.classList.add('show');
    } else {
      legendarySection && legendarySection.classList.remove('show');
    }
  });
}