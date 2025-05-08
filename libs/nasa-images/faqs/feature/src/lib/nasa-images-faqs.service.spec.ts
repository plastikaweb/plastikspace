import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideEnvironmentMock } from '@plastik/core/environments';

import { FAQ } from './faq';
import { NasaImagesFaqsService } from './nasa-images-faqs.service';

describe('NasaImagesFaqsService', () => {
  let service: NasaImagesFaqsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideEnvironmentMock(),
        NasaImagesFaqsService,
      ],
    });
    service = TestBed.inject(NasaImagesFaqsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a method `getList` that handles the HTTP request that returns a list of FAQs', done => {
    const faqs: FAQ[] = [
      { question: 'Q1', answer: 'A1' },
      { question: 'Q2', answer: 'A2' },
      { question: 'Q3', answer: 'A3' },
    ];
    service.getList().subscribe(response => {
      expect(response).toStrictEqual(faqs);
      done();
    });

    const req = httpMock.expectOne({ method: 'GET', url: 'assets/json/faqs.json' });

    req.flush(faqs);
    httpMock.verify();
  });
});
