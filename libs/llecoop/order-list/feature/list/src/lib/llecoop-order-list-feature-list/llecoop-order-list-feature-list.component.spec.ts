import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LlecoopOrderListFeatureListComponent } from './llecoop-order-list-feature-list.component';

describe('LlecoopOrderListFeatureListComponent', () => {
  let component: LlecoopOrderListFeatureListComponent;
  let fixture: ComponentFixture<LlecoopOrderListFeatureListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlecoopOrderListFeatureListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LlecoopOrderListFeatureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
