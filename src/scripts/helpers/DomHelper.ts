export class DomHelper {
  static addEventListener(selector: string, event: string, callback: (event: Event) => void, parent: HTMLElement = document.body) {
    const element = parent.querySelector(selector);
    element?.addEventListener(event, callback);
    return element;
  }

  static getTemplate(selector: string) {
    const template = document.querySelector(selector) as HTMLTemplateElement;
    if (template) {
      return template.content.cloneNode(true) as HTMLElement;
    }
    return document.createElement('div') as HTMLElement;
  }

  static setMode(mode: string) {
    document.body.className = mode;
  }

  static updateTextContent(selector: string, text: string, parent: HTMLElement = document.body) {
    const element = parent.querySelector(selector);
    if (element) {
      element.textContent = text;
    }
    return element;
  }
}