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

  it('should escape HTML in parameters', () => {
    const data = TestBed.inject(DIALOG_DATA);
    (data as any).params = { name: '<script>alert("xss")</script>' };
    // Trigger effect by recreating component or manually updating if it was a signal,
    // but here it's injected data, so we might need to recreate.
    // However, SharedConfirmFeatureComponent uses computed based on this.data.

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [SharedConfirmFeatureComponent, TranslateModule.forRoot()],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: DIALOG_DATA,
          useValue: {
            title: 'Title',
            message: 'test.message',
            params: { name: '<script>alert("xss")</script>' },
            ok: 'ok',
            ko: 'ko',
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

    const message = (component as unknown as { message: () => any }).message();
    // Use value if it's SafeHtml, otherwise string
    const messageContent = message?.changingThisBreaksApplicationSecurity || message?.toString();

    expect(messageContent).toContain(
      'Hello &lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
    );
  });
});
