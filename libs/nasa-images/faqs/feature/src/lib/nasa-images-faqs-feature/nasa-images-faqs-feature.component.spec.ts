import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';

import { NasaImagesFacade } from '@plastik/nasa-images/data-access';
import { NasaImagesFaqsService } from '../nasa-images-faqs.service';
import { NasaImagesFaqsFeatureComponent } from './nasa-images-faqs-feature.component';
import { toHaveNoViolations, axe } from 'jest-axe';

describe('NasaImagesFaqsFeatureComponent', () => {
  let component: NasaImagesFaqsFeatureComponent;
  let fixture: ComponentFixture<NasaImagesFaqsFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NasaImagesFaqsFeatureComponent, HttpClientTestingModule],
      providers: [provideMockStore(), { provide: VIEW_CONFIG, useValue: null }, NasaImagesFacade, NasaImagesFaqsService],
    }).compileComponents();

    fixture = TestBed.createComponent(NasaImagesFaqsFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    expect.extend(toHaveNoViolations);
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
