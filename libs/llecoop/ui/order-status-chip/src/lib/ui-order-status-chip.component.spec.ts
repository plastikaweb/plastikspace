import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { UiOrderStatusChipComponent } from './ui-order-status-chip.component';

describe('UiOrderStatusChipComponent', () => {
  let component: UiOrderStatusChipComponent;
  let fixture: ComponentFixture<UiOrderStatusChipComponent>;
  let componentRef: ComponentRef<UiOrderStatusChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiOrderStatusChipComponent, MatChipsModule, MatIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UiOrderStatusChipComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('icon', 'visibility');
    componentRef.setInput('label', 'test');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
