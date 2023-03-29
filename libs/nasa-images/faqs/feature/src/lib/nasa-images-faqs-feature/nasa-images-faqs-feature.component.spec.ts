import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';

import { NasaImagesFaqsService } from '../nasa-images-faqs.service';
import { NasaImagesFaqsFeatureComponent } from './nasa-images-faqs-feature.component';

describe('NasaImagesFaqsFeatureComponent', () => {
  let component: NasaImagesFaqsFeatureComponent;
  let fixture: ComponentFixture<NasaImagesFaqsFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NasaImagesFaqsFeatureComponent, HttpClientTestingModule],
      providers: [provideMockStore(), { provide: VIEW_CONFIG, useValue: null }, NasaImagesFaqsService],
    }).compileComponents();

    fixture = TestBed.createComponent(NasaImagesFaqsFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
