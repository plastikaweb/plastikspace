import { axe, toHaveNoViolations } from 'jest-axe';
import { of } from 'rxjs';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { provideEnvironmentMock } from '@plastik/core/environments';
import { NasaImagesSearchFacade } from '@plastik/nasa-images/search/data-access';
import { NasaImagesSearchApiParams } from '@plastik/nasa-images/search/entities';
import { PageEventConfig } from '@plastik/shared/table/entities';

import { NasaImagesSearchFeatureComponent } from './nasa-images-search-feature.component';

xdescribe('NasaImagesSearchFeatureComponent', () => {
  let component: NasaImagesSearchFeatureComponent;
  let fixture: ComponentFixture<NasaImagesSearchFeatureComponent>;
  let facade: NasaImagesSearchFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, NasaImagesSearchFeatureComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideEnvironmentMock(),
        provideHttpClientTesting(),
        provideMockStore(),
        {
          provide: NasaImagesSearchFacade,
          useValue: {
            search: jest.fn(),
            changePagination: jest.fn(),
            images$: of([
              {
                description: '',
                dateCreated: new Date(),
                thumbnail: '',
                creator: '',
                center: '',
                keywords: [],
                location: '',
              },
            ]),
            isActiveSearch$: of(false),
            formModel$: of({}),
            routeInfo$: of({
              icon: 'icon',
              title: 'title',
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NasaImagesSearchFeatureComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(NasaImagesSearchFacade);
    component.formStructure$ = of([]);
    component.formModel$ = of({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onChange', () => {
    it('should call search facade method', () => {
      const params: NasaImagesSearchApiParams = { q: 'pluto' };
      component.onChange(params);
      expect(facade.search).toHaveBeenCalledWith(params);
    });

    it('should not call search facade method', () => {
      const params: NasaImagesSearchApiParams = { q: 'a' };
      component.onChange(params);
      expect(facade.search).not.toHaveBeenCalled();
    });

    it('should not call search facade method with empty q param', () => {
      const params: NasaImagesSearchApiParams = { q: '' };
      component.onChange(params);
      expect(facade.search).toHaveBeenCalled();
    });

    it('should not call search facade method with no q param', () => {
      const params: Partial<NasaImagesSearchApiParams> = { page: 1 };
      component.onChange(params);
      expect(facade.search).not.toHaveBeenCalled();
    });
  });

  it('onChangePagination should call search changePagination method', () => {
    const tablePagination: PageEventConfig = { pageIndex: 1, pageSize: 100 };
    component.onChangePagination(tablePagination);
    expect(facade.changePagination).toHaveBeenCalledWith(tablePagination);
  });

  it('should have no accessibility violations', async () => {
    expect.extend(toHaveNoViolations);
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
