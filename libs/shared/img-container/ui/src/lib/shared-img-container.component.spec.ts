import { IMAGE_LOADER } from '@angular/common';
import { ComponentRef, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedImgContainerComponent } from './shared-img-container.component';

describe('SharedImgContainerComponent', () => {
  let component: SharedImgContainerComponent;
  let fixture: ComponentFixture<SharedImgContainerComponent>;
  let componentRef: ComponentRef<SharedImgContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),

        {
          provide: IMAGE_LOADER,
          useFactory: () => (src: string) => `https://test.io/${src}`,
        },
      ],
      imports: [SharedImgContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedImgContainerComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('src', 'test.jpg');
    componentRef.setInput('width', 100);
    componentRef.setInput('height', 100);
    componentRef.setInput('title', 'test');
    componentRef.setInput('lcpImage', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
