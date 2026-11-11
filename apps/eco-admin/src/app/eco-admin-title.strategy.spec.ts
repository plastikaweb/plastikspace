import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { TitleStrategy, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

import { EcoAdminTitleStrategy } from './eco-admin-title.strategy';

@Component({
  selector: 'eco-admin-title-probe',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TitleProbeComponent {}

describe('EcoAdminTitleStrategy', () => {
  let translate: TranslateService;
  let title: Title;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        provideRouter([
          { path: 'titled', title: 'probe.title', component: TitleProbeComponent },
          { path: 'untitled', component: TitleProbeComponent },
        ]),
        { provide: TitleStrategy, useExisting: EcoAdminTitleStrategy },
      ],
    });

    translate = TestBed.inject(TranslateService);
    title = TestBed.inject(Title);

    translate.setTranslation('ca', { probe: { title: 'Accés' } });
    translate.setTranslation('es', { probe: { title: 'Acceso' } });
    await firstValueFrom(translate.use('ca'));
  });

  it('writes the translated route title followed by the product name', async () => {
    await RouterTestingHarness.create('/titled');

    expect(title.getTitle()).toBe('Accés · Eco Admin');
  });

  it('writes only the product name for a route without a title', async () => {
    await RouterTestingHarness.create('/untitled');

    expect(title.getTitle()).toBe('Eco Admin');
  });

  it('writes the title again when the interface language changes', async () => {
    await RouterTestingHarness.create('/titled');

    await firstValueFrom(translate.use('es'));

    expect(title.getTitle()).toBe('Acceso · Eco Admin');
  });

  it('drops the previous route title when the next route has none', async () => {
    const harness = await RouterTestingHarness.create('/titled');

    await harness.navigateByUrl('/untitled');

    expect(title.getTitle()).toBe('Eco Admin');
  });
});
