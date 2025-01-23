import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { UiCategoryNameCellComponent } from './ui-category-name-cell.component';

describe('UiCategoryNameCellComponent', () => {
  let component: UiCategoryNameCellComponent;
  let fixture: ComponentFixture<UiCategoryNameCellComponent>;
  let componentRef: ComponentRef<UiCategoryNameCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCategoryNameCellComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UiCategoryNameCellComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('category', {
      name: 'test',
      id: 1,
      color: '#FF0000',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
