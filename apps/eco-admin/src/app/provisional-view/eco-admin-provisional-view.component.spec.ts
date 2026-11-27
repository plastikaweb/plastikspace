import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { axe } from 'vitest-axe';

import { EcoAdminProvisionalViewComponent } from './eco-admin-provisional-view.component';

describe('EcoAdminProvisionalViewComponent', () => {
  let fixture: ComponentFixture<EcoAdminProvisionalViewComponent>;
  let host: HTMLElement;

  const render = async (title: string | undefined): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [EcoAdminProvisionalViewComponent],
      providers: [
        provideTranslateService(),
        { provide: ActivatedRoute, useValue: { snapshot: { title } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoAdminProvisionalViewComponent);
    host = fixture.nativeElement;
    fixture.detectChanges();
  };

  it('heads the page with the section the route names', async () => {
    await render('shell.nav.socis');

    expect(host.querySelector('h1')?.textContent).toContain('shell.nav.socis');
    expect(host.querySelector('p')?.textContent).toContain('shell.placeholder.body');
  });

  it('falls back to a generic heading when the route names no section', async () => {
    await render(undefined);

    expect(host.querySelector('h1')?.textContent).toContain('shell.placeholder.title');
  });

  it('leaves the main landmark to the shell', async () => {
    await render('shell.nav.tauler');

    expect(host.querySelector('main')).toBeNull();
  });

  it('has no accessibility violations', async () => {
    await render('shell.nav.tauler');

    expect(await axe(host)).toHaveNoViolations();
  });
});
