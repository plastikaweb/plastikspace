import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressCardComponent } from './address-card.component';
import { UserContact } from '@plastik/core/entities';
import { describe, expect, it, beforeEach, vi } from 'vitest';

describe('AddressCardComponent', () => {
  let component: AddressCardComponent;
  let fixture: ComponentFixture<AddressCardComponent>;

  const mockAddress: UserContact = {
    id: '1',
    name: 'Home',
    fullName: 'Carlos Matheu',
    address: 'Main Street 123',
    zip: '08001',
    city: 'Barcelona',
    country: 'Spain',
    phone: '123456789',
    default: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('address', mockAddress);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit selectionChange event when clicked', () => {
    const emitSpy = vi.spyOn(component.selectionChange, 'emit');
    const cardElement = fixture.nativeElement.querySelector('.address-card');

    cardElement.click();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should apply selected class when selected is true', () => {
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();
    const cardElement = fixture.nativeElement.querySelector('.address-card');

    expect(cardElement.classList.contains('selected')).toBe(true);
  });

  it('should apply opacity-50 class when disabled is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const cardElement = fixture.nativeElement.querySelector('.address-card');

    expect(cardElement.classList.contains('opacity-50')).toBe(true);
  });

  it('should compute fullAriaLabel correctly', () => {
    fixture.detectChanges();
    const cardElement = fixture.nativeElement.querySelector('.address-card');

    expect(cardElement.getAttribute('aria-label')).toBe('Home, Main Street 123, 08001 Barcelona');
  });

  it('should emit selectionChange on keydown.space and prevent default', () => {
    const emitSpy = vi.spyOn(component.selectionChange, 'emit');
    const cardElement = fixture.nativeElement.querySelector('.address-card');
    const event = new KeyboardEvent('keydown', { key: ' ', code: 'Space', cancelable: true });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    cardElement.dispatchEvent(event);
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalled();
  });


  it('should set aria-hidden="true" on inner decorative icons', () => {
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();
    const icons = fixture.nativeElement.querySelectorAll('mat-icon');

    expect(icons.length).toBeGreaterThan(0);
    icons.forEach((icon: HTMLElement) => {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
