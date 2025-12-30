import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoStoreCartComponent } from './eco-store-cart.component';
import { TranslateModule } from '@ngx-translate/core';

import { provideRouter } from '@angular/router';

describe('EcoStoreCartComponent', () => {
  let component: EcoStoreCartComponent;
  let fixture: ComponentFixture<EcoStoreCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreCartComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
