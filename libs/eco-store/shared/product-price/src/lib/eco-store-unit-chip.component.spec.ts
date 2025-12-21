import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EcoStoreUnitChipComponent } from './eco-store-unit-chip.component';

describe('EcoStoreUnitChipComponent', () => {
  let component: EcoStoreUnitChipComponent;
  let fixture: ComponentFixture<EcoStoreUnitChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreUnitChipComponent, TranslateModule.forRoot()],
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', { 'products.unit.weight': '{{value}}' });
    translate.use('en');

    fixture = TestBed.createComponent(EcoStoreUnitChipComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('unitBase', 1);
    fixture.componentRef.setInput('unitType', 'weight');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the unit base', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('kg');
  });
});
