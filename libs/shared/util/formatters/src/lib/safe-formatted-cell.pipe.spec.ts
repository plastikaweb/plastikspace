import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PropertyFormatting } from './formatting';
import { SafeFormattedPipe } from './safe-formatted-cell.pipe';
import { DataFormatFactoryService } from './services';
import { objectMocked } from './services/formatting.mock';

describe('SafeFormattedCellPipe', () => {
  let pipe: SafeFormattedPipe<typeof objectMocked>;
  let service: DataFormatFactoryService<typeof objectMocked>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
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

  it('should properly format text value using DataFormatFactoryService', () => {
    const expectedResult = 'formatted value';
    const mockParams: PropertyFormatting<typeof objectMocked, 'TEXT'> = {
      key: objectMocked['id'],
      title: 'ID',
      pathToKey: 'id',
      formatting: {
        type: 'TEXT',
      },
    };

    (service.getFormattedValue as jest.Mock).mockReturnValue(expectedResult);

    const result = pipe.transform(objectMocked, mockParams);

    expect(result).toBe(expectedResult);
    expect(service.getFormattedValue).toHaveBeenCalledWith(
      objectMocked,
      mockParams,
      undefined,
      undefined
    );
  });
  it('should handle optional parameters', () => {
    const index = 1;
    const extraConfig = { someConfig: 'value' };

    pipe.transform(
      objectMocked,
      {
        key: objectMocked['id'],
        title: 'ID',
        pathToKey: 'id',
        formatting: {
          type: 'TEXT',
        },
      },
      index,
      extraConfig
    );

    expect(service.getFormattedValue).toHaveBeenCalledWith(
      objectMocked,
      expect.any(Object),
      index,
      extraConfig
    );
  });
});
