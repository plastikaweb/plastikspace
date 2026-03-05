import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { axe } from 'jest-axe';
import { EcoStoreUnitChipComponent } from './eco-store-unit-chip.component';

describe('EcoStoreUnitChipComponent', () => {
  let component: EcoStoreUnitChipComponent;
  let fixture: ComponentFixture<EcoStoreUnitChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreUnitChipComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreUnitChipComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('unitType', 'unit');
    fixture.componentRef.setInput('unitBase', '1');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should return "balance" icon for weight types', () => {
    fixture.componentRef.setInput('unitType', 'weight');
    fixture.componentRef.setInput('unitBase', '1');
    fixture.detectChanges();
    expect((component as any).iconName()).toBe('balance');
  });

  it('should return "water_drop" icon for volume types', () => {
    fixture.componentRef.setInput('unitType', 'volume');
    fixture.componentRef.setInput('unitBase', '1');
    fixture.detectChanges();
    expect((component as any).iconName()).toBe('water_drop');
  });

  it('should return "package_2" icon for other types', () => {
    fixture.componentRef.setInput('unitType', 'unit');
    fixture.componentRef.setInput('unitBase', '1');
    fixture.detectChanges();
    expect((component as any).iconName()).toBe('package_2');
  });

  describe('Accessibility', () => {
    it('should have no violations with unit type', async () => {
      fixture.componentRef.setInput('unitType', 'unit');
      fixture.componentRef.setInput('unitBase', '1');
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.detectChanges();
      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with weight type', async () => {
      fixture.componentRef.setInput('unitType', 'weight');
      fixture.componentRef.setInput('unitBase', '1');
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.detectChanges();
      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });
  });
});
