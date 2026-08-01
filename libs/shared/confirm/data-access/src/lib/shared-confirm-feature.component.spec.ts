import { DIALOG_DATA } from '@angular/cdk/dialog';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { SharedConfirmFeatureComponent } from './shared-confirm-feature.component';

describe('SharedConfirmFeatureComponent', () => {
  let component: SharedConfirmFeatureComponent;
  let fixture: ComponentFixture<SharedConfirmFeatureComponent>;
  let translate: TranslateService;

  const defaultData = {
    title: 'Title',
    message: 'test.message',
    params: { name: 'test' },
    ok: 'common.ok',
    ko: 'common.cancel',
  };

  /**
   * Configures the testing module and renders the component with the given dialog data.
   * @param {Record<string, unknown>} data The DIALOG_DATA payload (title, message, params, ok, ko).
   * @param {Record<string, string>} translations The translation map registered for the 'en' locale.
   * @returns {Promise<void>} Resolves once the component is created and rendered.
   */
  async function setup(
    data: Record<string, unknown> = defaultData,
    translations: Record<string, string> = { 'test.message': 'Hello {{name}}' }
  ): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [SharedConfirmFeatureComponent, TranslateModule.forRoot()],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: DIALOG_DATA,
          useValue: data,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedConfirmFeatureComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    translate.setTranslation('en', translations);
    fixture.detectChanges();
  }

  const messageOf = (): string | undefined =>
    (component as unknown as { message: () => string }).message()?.toString();

  it('should create', async () => {
    await setup();
    expect(component).toBeTruthy();
  });

  it('should compute the message signal correctly', async () => {
    await setup();
    expect(messageOf()).toContain('Hello test');
  });

  it('should escape HTML in user-controlled params to prevent XSS', async () => {
    await setup({
      ...defaultData,
      params: { name: '<img src=x onerror=alert(1)>' },
    });

    const rendered = messageOf();
    expect(rendered).not.toContain('<img');
    expect(rendered).toContain('&lt;img');
  });

  it('should preserve intentional HTML in the translation template while escaping params', async () => {
    await setup(
      { ...defaultData, params: { name: '<b>x</b>' } },
      {
        'test.message': '<strong>{{name}}</strong>',
      }
    );

    const rendered = messageOf();
    expect(rendered).toContain('<strong>');
    expect(rendered).toContain('&lt;b&gt;');
    expect(rendered).not.toContain('<b>x</b>');
  });

  it('should escape non-string params after stringifying them', async () => {
    await setup(
      {
        ...defaultData,
        params: { list: ['<img src=x>', 'safe'] },
      },
      { 'test.message': 'List: {{list}}' }
    );

    const rendered = messageOf();
    // ngx-translate stringifies arrays as comma-separated values
    // We want to ensure the <img part is escaped
    expect(rendered).toContain('&lt;img');
    expect(rendered).not.toContain('<img');
  });

  it('should not throw TypeError if message is SafeHtml (non-string)', async () => {
    const safeMessage = {
      changingThisBreaksApplicationSecurity: '<strong>Safe</strong>',
    };

    await setup({
      ...defaultData,
      message: safeMessage,
    });

    // If it didn't throw, we're good.
    // The current implementation calls instant() on it, which might throw.
    expect(messageOf()).toBeDefined();
  });
});
