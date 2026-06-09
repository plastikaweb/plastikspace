import { DIALOG_DATA } from '@angular/cdk/dialog';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { SharedConfirmFeatureComponent } from './shared-confirm-feature.component';

describe('SharedConfirmFeatureComponent', () => {
  let component: SharedConfirmFeatureComponent;
  let fixture: ComponentFixture<SharedConfirmFeatureComponent>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedConfirmFeatureComponent, TranslateModule.forRoot()],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: DIALOG_DATA,
          useValue: {
            title: 'Title',
            message: 'test.message',
            params: { name: 'test' },
            ok: 'common.ok',
            ko: 'common.cancel',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedConfirmFeatureComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    translate.setTranslation('en', { 'test.message': 'Hello {{name}}' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute the message signal correctly', () => {
    expect((component as unknown as { message: () => string }).message()?.toString()).toContain(
      'Hello test'
    );
  });

  it('should escape XSS in params', async () => {
    const maliciousName = '<img src=x onerror=alert(1)>';
    const escapedName = '&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;';

    // We create a new fixture to ensure the injected data is fresh
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [SharedConfirmFeatureComponent, TranslateModule.forRoot()],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: DIALOG_DATA,
          useValue: {
            title: 'Title',
            message: 'test.message',
            params: { name: maliciousName },
            ok: 'common.ok',
            ko: 'common.cancel',
          },
        },
      ],
    }).compileComponents();

    const newFixture = TestBed.createComponent(SharedConfirmFeatureComponent);
    const newComponent = newFixture.componentInstance;
    const newTranslate = TestBed.inject(TranslateService);
    newTranslate.use('en');
    newTranslate.setTranslation('en', { 'test.message': 'Hello {{name}}' });
    newFixture.detectChanges();

    // To verify what the component's message() returns:
    const messageValue = (newComponent as any).message();
    // In Angular testing, SafeHtml has this internal property
    const actualHtml = (messageValue as any).changingThisBreaksApplicationSecurity;
    expect(actualHtml).not.toContain(maliciousName);
    expect(actualHtml).toContain(escapedName);
  });

  it('should handle non-string params correctly', async () => {
    // We create a new fixture to ensure the injected data is fresh
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [SharedConfirmFeatureComponent, TranslateModule.forRoot()],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: DIALOG_DATA,
          useValue: {
            title: 'Title',
            message: 'test.message',
            params: { name: 'test', count: 123 },
            ok: 'common.ok',
            ko: 'common.cancel',
          },
        },
      ],
    }).compileComponents();

    const newFixture = TestBed.createComponent(SharedConfirmFeatureComponent);
    const newComponent = newFixture.componentInstance;
    const newTranslate = TestBed.inject(TranslateService);
    newTranslate.use('en');
    newTranslate.setTranslation('en', { 'test.message': 'Hello {{name}} {{count}}' });
    newFixture.detectChanges();

    const messageValue = (newComponent as any).message();
    const actualHtml = (messageValue as any).changingThisBreaksApplicationSecurity;
    expect(actualHtml).toContain('Hello test 123');
  });

  it('should handle null params correctly', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [SharedConfirmFeatureComponent, TranslateModule.forRoot()],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: DIALOG_DATA,
          useValue: {
            title: 'Title',
            message: 'test.message',
            params: null,
            ok: 'common.ok',
            ko: 'common.cancel',
          },
        },
      ],
    }).compileComponents();

    const newFixture = TestBed.createComponent(SharedConfirmFeatureComponent);
    const newComponent = newFixture.componentInstance;
    const newTranslate = TestBed.inject(TranslateService);
    newTranslate.use('en');
    newTranslate.setTranslation('en', { 'test.message': 'Hello world' });
    newFixture.detectChanges();

    const messageValue = (newComponent as any).message();
    const actualHtml = (messageValue as any).changingThisBreaksApplicationSecurity;
    expect(actualHtml).toContain('Hello world');
  });
});
