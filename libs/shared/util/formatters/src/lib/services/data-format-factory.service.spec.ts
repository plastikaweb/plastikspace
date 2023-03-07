import { DatePipe, PercentPipe, TitleCasePipe } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { FormattingTypes } from '../formatting';
import { DataFormatFactoryService } from './data-format-factory.service';
import { objectMocked, TypeMocked } from './formatting.mock';
import { SharedUtilsFormattersService } from './shared-util-formatters.service';

describe('DataFormatFactoryService', () => {
  let service: DataFormatFactoryService<TypeMocked>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DataFormatFactoryService,
        SharedUtilsFormattersService,
        TitleCasePipe,
        DatePipe,
        PercentPipe,
        {
          provide: LOCALE_ID,
          useValue: 'en-EN',
        },
      ],
    });
    service = TestBed.inject(DataFormatFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a value with no custom formatting and sanitization', () => {
    const result = service.getFormattedValue(objectMocked, {
      key: 'a',
      title: 'Title',
      propertyPath: 'noFormatting.child.value',
      formatting: {
        type: FormattingTypes.TEXT,
      },
    });
    expect(result.toString()).toContain('12');
  });

  it('should return a value with text formatting', () => {
    const result = service.getFormattedValue(objectMocked, {
      key: 'a',
      title: 'Title',
      propertyPath: 'text.child.value',
      formatting: { type: FormattingTypes.TEXT },
    });
    expect(result).toEqual({ changingThisBreaksApplicationSecurity: 'value' });
  });

  it('should return a value with link formatting', () => {
    const result = service.getFormattedValue(objectMocked, {
      key: 'a',
      title: 'Title',
      propertyPath: 'link',
      formatting: { type: FormattingTypes.LINK },
    });
    expect(result).toBe('www.example.com');
  });

  it('should return a value with date formatting', () => {
    const result = service.getFormattedValue(objectMocked, {
      key: 'a',
      title: 'Title',
      propertyPath: 'time',
      formatting: { type: FormattingTypes.DATE },
    });
    expect(result).toBe('9/1/21');
  });

  it('should return a value with datetime formatting', () => {
    const result = service.getFormattedValue(objectMocked, {
      key: 'a',
      title: 'Title',
      propertyPath: 'time',
      formatting: { type: FormattingTypes.DATE_TIME },
    });
    expect(result).toBe('9/1/21, 04:10:06');
  });

  it('should return a value with percentage formatting', () => {
    const result = service.getFormattedValue(objectMocked, {
      key: 'a',
      title: 'Title',
      propertyPath: 'percentage',
      formatting: { type: FormattingTypes.PERCENTAGE },
    });
    expect(result).toBe('80.00%');
  });

  it('should return a value with booleanWithControl formatting', () => {
    const result = service.getFormattedValue(objectMocked, {
      key: 'a',
      title: 'Title',
      propertyPath: 'truthy',
      formatting: { type: FormattingTypes.BOOLEAN_WITH_CONTROL },
    });
    expect(result).toBeTruthy();
  });

  describe('currency formatting', () => {
    it('should return a value with default currency formatting', () => {
      const result = service.getFormattedValue(objectMocked, {
        key: 'a',
        title: 'Title',
        propertyPath: 'price',
        formatting: { type: FormattingTypes.CURRENCY },
      });
      expect(result).toBe('$3');
    });

    it('should return a value with custom digits info currency formatting', () => {
      const result = service.getFormattedValue(objectMocked, {
        key: 'a',
        title: 'Title',
        propertyPath: 'price',
        formatting: { type: FormattingTypes.CURRENCY, extras: { numberDigitsInfo: '1.2-2' } },
      });
      expect(result).toBe('$3.08');
    });
  });

  it('should return a value with number formatting', () => {
    let result = service.getFormattedValue(objectMocked, {
      key: 'a',
      title: 'Title',
      propertyPath: 'price',
      formatting: { type: FormattingTypes.NUMBER },
    });
    expect(result).toBe('3.08');

    result = service.getFormattedValue(objectMocked, {
      key: 'a',
      title: 'Title',
      propertyPath: 'price',
      formatting: { type: FormattingTypes.NUMBER, extras: { numberDigitsInfo: '1.0-0' } },
    });
    expect(result).toBe('3');
  });

  it('should return a value with percentage formatting', () => {
    const result = service.getFormattedValue(objectMocked, {
      key: 'a',
      title: 'Title',
      propertyPath: 'percentage',
      formatting: { type: FormattingTypes.PERCENTAGE },
    });
    expect(result).toBe('80.00%');
  });

  describe('image formatting', () => {
    it('should return a value with image formatting and static extras.title', () => {
      const result = service.getFormattedValue(objectMocked, {
        key: 'a',
        title: 'Title',
        propertyPath: 'image',
        formatting: {
          type: FormattingTypes.IMAGE,
          extras: {
            type: 'img',
            title: 'alt text',
          },
        },
      });
      expect(result).toEqual({ changingThisBreaksApplicationSecurity: '<img alt="alt text" src="thumb.png" class="">' });
    });

    it('should return a value with image formatting and dynamic extras.title', () => {
      const result = service.getFormattedValue(objectMocked, {
        key: 'a',
        title: 'Title',
        propertyPath: 'image',
        formatting: {
          type: FormattingTypes.IMAGE,
          extras: {
            type: 'img',
            title: item => item['title'] as string,
          },
        },
      });
      expect(result).toEqual({ changingThisBreaksApplicationSecurity: '<img alt="TITLE" src="thumb.png" class="">' });
    });
  });

  it('should return a value with titleCase formatting', () => {
    const result = service.getFormattedValue(objectMocked, {
      key: 'a',
      title: 'Title',
      propertyPath: 'text.child.value',
      formatting: {
        type: FormattingTypes.TITLE_CASE,
      },
    });
    expect(result).toBe(`Value`);
  });

  describe('custom formatter', () => {
    it('should return a value with no formatting if no execute method is present', () => {
      const result = service.getFormattedValue(objectMocked, {
        key: 'a',
        title: 'Title',
        propertyPath: 'custom',
        formatting: {
          type: FormattingTypes.CUSTOM,
        },
      });
      expect(result).toBe(`---`);
    });

    it('should return a value with formatting if execute method is present', () => {
      const result = service.getFormattedValue(objectMocked, {
        key: 'a',
        title: 'Title',
        propertyPath: 'title',
        formatting: {
          type: FormattingTypes.CUSTOM,
          execute: title => `This is the ${title}`,
        },
      });
      expect(result).toBe(`This is the TITLE`);
    });
  });
});
