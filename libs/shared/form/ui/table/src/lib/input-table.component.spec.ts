import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseEntity } from '@plastik/core/entities';

import { InputTableComponent } from './input-table.component';

describe('InputTableComponent', () => {
  let component: InputTableComponent<BaseEntity>;
  let fixture: ComponentFixture<InputTableComponent<BaseEntity>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [InputTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
