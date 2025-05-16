import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SafeFormattedPipe } from './safe-formatted-cell.pipe';
import { DataFormatFactoryService } from './services';
import { objectMocked } from './services/formatting.mock';

describe('SafeFormattedCellPipe', () => {
  let pipe: SafeFormattedPipe<typeof objectMocked>;
  let service: DataFormatFactoryService<typeof objectMocked>;

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

    service = TestBed.inject(DataFormatFactoryService<typeof objectMocked>);
    pipe = new SafeFormattedPipe<typeof objectMocked>(service);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format value properly', () => {
    pipe.transform(objectMocked, {
      key: objectMocked['id'],
      title: 'ID',
      pathToKey: 'id',
      formatting: {
        type: 'TEXT',
      },
    });

    expect(service.getFormattedValue).toHaveBeenCalledTimes(1);
  });
});
