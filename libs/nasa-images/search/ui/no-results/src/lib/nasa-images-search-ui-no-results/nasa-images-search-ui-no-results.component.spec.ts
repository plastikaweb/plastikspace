import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Component } from '@angular/core';
import { axe, toHaveNoViolations } from 'jest-axe';
import { NasaImagesSearchUiNoResultsComponent } from './nasa-images-search-ui-no-results.component';

@Component({
  selector: 'plastik-test',
  template: `<plastik-nasa-images-search-ui-no-results>
    <span icon> search_on </span>
    <span title>NASA images search</span>
    <span message
      >Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto assumenda ad ipsam.
      Deserunt eligendi quos exercitationem, earum officiis eum, quod repellat eos quae id et?</span
    >
  </plastik-nasa-images-search-ui-no-results>`,
})
class TestHostComponent {}

describe('NasaImagesSearchUiNoResultsComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, NasaImagesSearchUiNoResultsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
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
