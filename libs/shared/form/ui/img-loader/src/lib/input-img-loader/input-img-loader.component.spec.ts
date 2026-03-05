import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputImgLoaderComponent } from './input-img-loader.component';

describe('InputImgLoaderComponent', () => {
  let component: InputImgLoaderComponent;
  let fixture: ComponentFixture<InputImgLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [InputImgLoaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputImgLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
