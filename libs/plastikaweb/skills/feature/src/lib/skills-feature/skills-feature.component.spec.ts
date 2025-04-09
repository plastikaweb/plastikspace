import { of } from 'rxjs';

import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlastikawebSkillsService } from '@plastik/plastikaweb/skills/data-access';

import { SkillsFeatureComponent } from './skills-feature.component';

describe('SkillsFeatureComponent', () => {
  let component: SkillsFeatureComponent;
  let fixture: ComponentFixture<SkillsFeatureComponent>;

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
      imports: [SkillsFeatureComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: PlastikawebSkillsService, useValue: skillsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
