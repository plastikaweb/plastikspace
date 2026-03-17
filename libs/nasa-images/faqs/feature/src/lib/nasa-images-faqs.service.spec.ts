import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideEnvironmentWithApiMock } from '@plastik/core/environments/testing';
import { firstValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';

import { FAQ } from './faq';
import { NasaImagesFaqsService } from './nasa-images-faqs.service';

describe('NasaImagesFaqsService', () => {
  let service: NasaImagesFaqsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideEnvironmentWithApiMock(),
        NasaImagesFaqsService,
      ],
    });
    service = TestBed.inject(NasaImagesFaqsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a method `getList` that handles the HTTP request that returns a list of FAQs', async () => {
    const faqs: FAQ[] = [
      { question: 'Q1', answer: 'A1' },
      { question: 'Q2', answer: 'A2' },
      { question: 'Q3', answer: 'A3' },
    ];
    const responsePromise = firstValueFrom(service.getList());

    const req = httpMock.expectOne({ method: 'GET', url: 'assets/json/faqs.json' });

    req.flush(faqs);
    const response = await responsePromise;
    expect(response).toStrictEqual(faqs);
    httpMock.verify();
  });
});
