import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { CoreCmsLayoutUiUserMenuComponent } from './core-cms-layout-ui-user-menu.component';

describe('CoreCmsLayoutUiUserMenuComponent', () => {
  let component: CoreCmsLayoutUiUserMenuComponent;
  let fixture: ComponentFixture<CoreCmsLayoutUiUserMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreCmsLayoutUiUserMenuComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CoreCmsLayoutUiUserMenuComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('userMenuConfig', {
      label: signal('label'),
      position: 'start',
      config: [],
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
