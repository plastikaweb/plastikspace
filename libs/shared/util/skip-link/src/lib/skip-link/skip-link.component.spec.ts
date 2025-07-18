import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkipLinkComponent } from './skip-link.component';

describe('SkipLinkComponent', () => {
  let component: SkipLinkComponent;
  let fixture: ComponentFixture<SkipLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [SkipLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkipLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
