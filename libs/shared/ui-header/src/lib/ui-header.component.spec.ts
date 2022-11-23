import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';

import { UiHeaderComponent } from './ui-header.component';

describe('UiHeaderComponent', () => {
  let component: UiHeaderComponent;
  let fixture: ComponentFixture<UiHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiHeaderComponent],
      imports: [MatToolbarModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UiHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
