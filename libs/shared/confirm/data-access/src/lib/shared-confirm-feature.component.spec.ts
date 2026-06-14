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

  it('should escape HTML in params to prevent XSS', () => {
    const xssPayload = '<img src=x onerror=alert(1)>';
    const escapedPayload = '&lt;img src&#x3D;x onerror&#x3D;alert(1)&gt;';
    translate.setTranslation('en', { 'test.xss': 'Vulnerable {{payload}}' }, true);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [SharedConfirmFeatureComponent, TranslateModule.forRoot()],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: DIALOG_DATA,
          useValue: {
            title: 'Title',
            message: 'test.xss',
            params: { payload: xssPayload },
            ok: 'common.ok',
            ko: 'common.cancel',
          },
        },
      ],
    });

    const xssFixture = TestBed.createComponent(SharedConfirmFeatureComponent);
    const xssComponent = xssFixture.componentInstance;
    const xssTranslate = TestBed.inject(TranslateService);
    xssTranslate.use('en');
    xssTranslate.setTranslation('en', { 'test.xss': 'Vulnerable {{payload}}' });
    xssFixture.detectChanges();

    const message = (xssComponent as any).message().changingThisBreaksApplicationSecurity;
    expect(message).toContain(escapedPayload);
    expect(message).not.toContain(xssPayload);
  });
});
