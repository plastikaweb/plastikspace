import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { UiProductNameCellComponent } from './ui-product-name-cell.component';

describe('UiProductNameCellComponent', () => {
  let component: UiProductNameCellComponent;
  let fixture: ComponentFixture<UiProductNameCellComponent>;
  let componentRef: ComponentRef<UiProductNameCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiProductNameCellComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UiProductNameCellComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('product', {
      name: 'test',
      id: 1,
      description: 'test',
      info: 'test',
      provider: 'test',
      origin: 'test',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
