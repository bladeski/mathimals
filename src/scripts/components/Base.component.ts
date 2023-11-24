import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { DomHelper } from '../helpers/DomHelper';
import { DomSelector } from '../enums';

export class BaseComponent {
  protected component: HTMLElement;
  protected componentReady$: Observable<boolean>;
  protected subs: Subscription[] = [];

  private componentReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  

  constructor(protected className: string, protected parentElement: HTMLElement, templateName: DomSelector) {
    this.componentReady$ = this.componentReady.asObservable();
    const component = DomHelper.getTemplate(templateName);
    this.component = document.createElement('div');
    this.component.className = className;
    this.component.appendChild(component);
    parentElement.appendChild(this.component);

    setTimeout(() => this.componentReady.next(true));
  }

  destroy() {
    this.subs.forEach(sub => sub.unsubscribe());
    this.parentElement.removeChild(this.component);
  }
}