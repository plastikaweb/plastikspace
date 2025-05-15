import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SafeFormattedPipe } from './safe-formatted-cell.pipe';
import { DataFormatFactoryService } from './services';
import { objectMocked, TypeMocked } from './services/formatting.mock';

describe('SafeFormattedCellPipe', () => {
  let pipe: SafeFormattedPipe<TypeMocked>;
  let service: DataFormatFactoryService<TypeMocked>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafeFormattedPipe],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        {
          provide: DataFormatFactoryService,
          useValue: {
            getFormattedValue: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    service = TestBed.inject(DataFormatFactoryService);
    pipe = new SafeFormattedPipe<TypeMocked>(service);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format value properly', () => {
    pipe.transform(objectMocked, {
      key: objectMocked['id'] as string,
      title: 'ID',
      pathToKey: 'id',
      formatting: {
        type: 'TEXT',
      },
    });

    expect(service.getFormattedValue).toHaveBeenCalledTimes(1);
  });
});
