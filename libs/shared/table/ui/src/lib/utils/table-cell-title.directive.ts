import { AfterViewInit, Directive, ElementRef, inject, Input } from '@angular/core';

@Directive({
  selector: '[plastikTableCellTitle]',
})
export class TableCellTitleDirective implements AfterViewInit {
  @Input({ required: true }) plastikTableCellTitle = true;

  readonly #elementRefElement: HTMLTableCellElement = inject(ElementRef).nativeElement;

  ngAfterViewInit(): void {
    if (this.#elementRefElement.children.length > 0 && this.plastikTableCellTitle) {
      const childElement = this.#elementRefElement.children[0];

      this.getTextContent(childElement);

      const titleText = this.getTextContent(childElement);
      this.#elementRefElement.setAttribute('title', titleText.trim());
      this.#elementRefElement.setAttribute('aria-label', titleText.trim());

      this.addTitleToLiElements(childElement);
    }
  }

  private getTextContent(node: Node): string {
    let textContent = '';

    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent?.trim() ?? '';
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      if ((node as HTMLElement).tagName.toLowerCase() === 'br') {
        return ' - '; // Return a separation for <br> elements
      }

      if (!(node as HTMLElement).classList.contains('material-icons')) {
        Array.from(node.childNodes).forEach(childNode => {
          textContent += this.getTextContent(childNode);
        });
      }
    }

    return textContent;
  }

  private addTitleToLiElements(node: Node): void {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      if (element.tagName.toLowerCase() === 'ul') {
        const liElements = element.getElementsByTagName('li');
        for (let i = 0; i < liElements.length; i++) {
          const liTextContent = this.getTextContent(liElements[i]);
          liElements[i].setAttribute('title', liTextContent);
          liElements[i].setAttribute('aria-label', liTextContent);
        }
      }
      Array.from(node.childNodes).forEach(childNode => {
        this.addTitleToLiElements(childNode);
      });
    }
  }
}
