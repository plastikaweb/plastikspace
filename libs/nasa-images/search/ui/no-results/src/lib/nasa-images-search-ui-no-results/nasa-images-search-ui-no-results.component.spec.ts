import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NasaImagesSearchUiNoResultsComponent } from './nasa-images-search-ui-no-results.component';

describe('NasaImagesSearchUiNoResultsComponent', () => {
  let component: NasaImagesSearchUiNoResultsComponent;
  let fixture: ComponentFixture<NasaImagesSearchUiNoResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NasaImagesSearchUiNoResultsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NasaImagesSearchUiNoResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
