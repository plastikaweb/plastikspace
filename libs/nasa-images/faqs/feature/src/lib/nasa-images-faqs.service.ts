import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { FAQ } from './faq';

@Injectable()
export class NasaImagesFaqsService {
  readonly #httpClient = inject(HttpClient);

  getList() {
    return this.#httpClient.get<FAQ[]>('assets/json/faqs.json');
  }
}
