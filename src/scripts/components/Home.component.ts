import { DomSelector, ViewType } from '../enums';
import { StateService, ViewService } from '../services';
import { combineLatest, first } from 'rxjs';

import { BaseComponent } from './Base.component';
import { DomHelper } from '../helpers/DomHelper';
import { ZooArea } from './../models/ZooArea';
import { ZooAreaComponent } from './ZooArea.component';

export class HomeComponent extends BaseComponent {
  private rotateLeftButton?: HTMLButtonElement;
  private rotateRightButton?: HTMLButtonElement;

  constructor() {
    const parent = document.querySelector('.home-wrapper') as HTMLElement;
    super('home-component', parent, DomSelector.TEMPLATE_MAIN_BG);

    this.rotateLeftButton = DomHelper.addEventListener(
      DomSelector.ROTATE_LEFT_BUTTON,
      'click',
      rotate,
      this.component,
    ) as HTMLButtonElement;
    this.rotateRightButton = DomHelper.addEventListener(
      DomSelector.ROTATE_RIGHT_BUTTON,
      'click',
      rotate,
      this.component,
    ) as HTMLButtonElement;

    this.subs.push(
      combineLatest([StateService.allZooAreas$]).pipe(first()).subscribe(([areas]) => {
        areas.forEach(this.initialiseArea.bind(this));
      }),
    );

    DomHelper.addEventListener('.area.play', 'click', () => {
      ViewService.openView(ViewType.GAME);
    });
  }

  destroy() {
    this.rotateLeftButton?.removeEventListener('click', rotate);
    this.rotateRightButton?.removeEventListener('click', rotate);
    super.destroy();
  }

  initialiseArea(area: ZooArea) {
    const areaEl = document.createElement('div');
    areaEl.id = `area${area.id}`;
    areaEl.className = `area ${area.className}`;

    if (area.id === 6) {
      const rainbow = document.createElement('div');
      rainbow.className = 'rainbow';

      const fgImage = document.createElement('img');
      fgImage.src = `assets/areas/rainbow.svg`;

      rainbow.appendChild(fgImage);

      areaEl.appendChild(rainbow);
    }

    if (area.bgImage?.length) {
      const areaBg = document.createElement('div');
      areaBg.className = 'area-bg';
  
      const bgImage = document.createElement('img');
      bgImage.src = `assets/areas/${area.bgImage}.svg`;

      areaBg.appendChild(bgImage);

      areaEl.appendChild(areaBg);
    }

    area.fgImageIds.forEach(id => {
      const areaFg = document.createElement('div');
      areaFg.className = `area-fg area-fg-${id}`;

      const fgImage = document.createElement('img');
      fgImage.src = `assets/animals/${id}.svg`;

      areaFg.appendChild(fgImage);

      areaEl.appendChild(areaFg);
    });

    const areaName = document.createElement('div');
    areaName.className = 'area-name';
    areaName.textContent = area.name;

    areaEl.appendChild(areaName);

    this.component.querySelector('.grass-circle')?.appendChild(areaEl);

    areaEl.addEventListener('click', (event) => {
      ViewService.openZooArea(area);
    });
  }
}

function rotate(event: Event) {
  let angle = parseInt(
    (event.currentTarget as HTMLButtonElement).dataset.angle || '30',
  );
  const areasImage = document.querySelector('.grass-circle') as HTMLElement;

  const rotate = areasImage.style.transform.match(/rotate\((-?\d+)(.+)\)/);
  if (rotate) {
    const [num] = rotate.slice(1); // slice is needed since first element contains entire match
    angle += parseInt(num);
  }
  areasImage.style.setProperty('transform', `rotate(${angle}deg)`);

  StateService.userLevels$.pipe(first()).subscribe((levels) => {
    const hasUnlockedLegendary =
      levels['+'][3][1] >= 10 &&
      levels['-'][3][1] >= 10 &&
      levels['×'][3][1] >= 10 &&
      levels['÷'][3][1] >= 10;
    const legendarySection = document.querySelector('.area.legendary');

    if (hasUnlockedLegendary && (angle % 360 === 180 || angle % 360 === -180)) {
      legendarySection && legendarySection.classList.add('show');
    } else {
      legendarySection && legendarySection.classList.remove('show');
    }
  });
}
