import { BaseComponent } from './Base.component';
import { DomHelper } from '../helpers/DomHelper';
import { DomSelector } from '../enums';
import { StateService } from '../services';

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
      StateService.allZooAreas$.subscribe(areas => {
        const svgAreas = this.component.querySelectorAll('.grass-circle > svg text.area');

        svgAreas.forEach((svgArea, index) => {
          svgArea.textContent = ''// areas[index].name;
        });
      })
    );
  }

  destroy() {
    this.rotateLeftButton?.removeEventListener('click', rotate)
    this.rotateRightButton?.removeEventListener('click', rotate)
    super.destroy();
  }
}

function rotate(event: Event) {
  let angle = parseInt((event.currentTarget as HTMLButtonElement).dataset.angle || '30');
  const areasImage = document.querySelector('.grass-circle > svg') as SVGElement;

  const rotate = areasImage.style.transform.match(/rotate\((-?\d+)(.+)\)/);
  if (rotate) {
    const [num] = rotate.slice(1);  // slice is needed since first element contains entire match
    angle += parseInt(num);
  }
  areasImage.style.setProperty('transform', `rotate(${angle}deg)`);
}