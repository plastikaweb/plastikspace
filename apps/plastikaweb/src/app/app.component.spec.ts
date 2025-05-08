import { of } from 'rxjs';

import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SkillsFeatureComponent } from '@plastik/plastikaweb/skills';
import { PlastikawebSkillsService } from '@plastik/plastikaweb/skills/data-access';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    const skillsServiceMock = {
      allSkills$: of([
        {
          title: 'Angular',
          excerpt: 'Framework JavaScript',
          skillsData: { skillMainUrl: 'url-angular' },
        },
        {
          title: 'React',
          excerpt: 'Biblioteca JavaScript',
          skillsData: { skillMainUrl: 'url-react' },
        },
      ]),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent, SkillsFeatureComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter([]),
        { provide: PlastikawebSkillsService, useValue: skillsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
