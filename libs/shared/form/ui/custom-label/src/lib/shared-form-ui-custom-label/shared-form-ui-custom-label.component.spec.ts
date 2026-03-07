import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { SharedFormUiCustomLabelComponent } from './shared-form-ui-custom-label.component';

describe('SharedFormUiCustomLabelComponent', () => {
  let component: SharedFormUiCustomLabelComponent;
  let fixture: ComponentFixture<SharedFormUiCustomLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedFormUiCustomLabelComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedFormUiCustomLabelComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
