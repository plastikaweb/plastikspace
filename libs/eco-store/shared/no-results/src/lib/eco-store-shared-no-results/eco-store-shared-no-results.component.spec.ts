import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoStoreSharedNoResultsComponent } from './eco-store-shared-no-results.component';
import { axe } from 'vitest-axe';
import { provideTranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';

@Component({
  imports: [EcoStoreSharedNoResultsComponent],
  template: `
    <eco-store-shared-no-results imgTitle="test title">
      <div no-results-title>Test Title</div>
      <div no-results-description>Test Description</div>
    </eco-store-shared-no-results>
  `,
})
class TestWrapperComponent {}

describe('EcoStoreSharedNoResultsComponent', () => {
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestWrapperComponent, EcoStoreSharedNoResultsComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestWrapperComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
