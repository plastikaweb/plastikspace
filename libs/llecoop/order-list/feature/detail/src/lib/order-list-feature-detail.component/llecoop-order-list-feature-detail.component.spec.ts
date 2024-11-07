import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LlecoopOrderListFeatureDetailComponent } from './llecoop-order-list-feature-detail.component';

describe('LlecoopOrderListFeatureDetailComponent', () => {
  let component: LlecoopOrderListFeatureDetailComponent;
  let fixture: ComponentFixture<LlecoopOrderListFeatureDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlecoopOrderListFeatureDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LlecoopOrderListFeatureDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
