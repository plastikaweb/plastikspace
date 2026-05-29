import { AfterViewInit, Directive, ElementRef, inject, input } from '@angular/core';

/**
 * Directive to add a title and aria-label to table cells based on their content.
 */
@Directive({
  selector: '[plastikTableCellTitle]',
})
export class TableCellTitleDirective implements AfterViewInit {
  /**
   * Whether to enable the automatic title generation.
   */
  readonly plastikTableCellTitle = input<boolean>(true);

  readonly #elementRefElement: HTMLTableCellElement = inject(ElementRef).nativeElement;

  /**
   * Initializes the directive after view initialization.
   */
  ngAfterViewInit(): void {
    if (this.#elementRefElement.children.length > 0 && this.plastikTableCellTitle()) {
      const childElement = this.#elementRefElement.children[0];

      const titleText = this.#getTextContent(childElement);
      this.#elementRefElement.setAttribute('title', titleText.trim());
      this.#elementRefElement.setAttribute('aria-label', titleText.trim());

      this.#addTitleToLiElements(childElement);
    }
  }

  /**
   * Recursively extracts text content from a DOM node.
   * @param {Node} node - The node to extract text from.
   * @returns {string} The extracted text content.
   */
  #getTextContent(node: Node): string {
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
          textContent += this.#getTextContent(childNode);
        });
      }
    }

    return textContent;
  }

  /**
   * Adds titles and aria-labels to <li> elements within a <ul>.
   * @param {Node} node - The root node to search from.
   */
  #addTitleToLiElements(node: Node): void {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      if (element.tagName.toLowerCase() === 'ul') {
        const liElements = element.getElementsByTagName('li');
        for (let i = 0; i < liElements.length; i++) {
          const liTextContent = this.#getTextContent(liElements[i]);
          liElements[i].setAttribute('title', liTextContent);
          liElements[i].setAttribute('aria-label', liTextContent);
        }
      }
      Array.from(node.childNodes).forEach(childNode => {
        this.#addTitleToLiElements(childNode);
      });
    }
  }
}
