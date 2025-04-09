import { of } from 'rxjs';

import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ApolloQueryResult } from '@apollo/client/core';
import { GetSkillsGQL, SkillNode } from '@plastik/plastikaweb/graphql-models';

import { PlastikawebSkillsService } from './plastikaweb-skills.service';

describe('PlastikawebSkillsService', () => {
  let service: PlastikawebSkillsService;
  let getSkillsGQLMock: Partial<GetSkillsGQL>;

  beforeEach(() => {
    const mockSkills: (SkillNode | null)[] = [
      { title: 'Skill 1', excerpt: 'Description 1', skillsData: { skillMainUrl: 'url1' } },
      { title: 'Skill 2', excerpt: 'Description 2', skillsData: { skillMainUrl: 'url2' } },
    ];

    getSkillsGQLMock = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      document: {} as any,
      watch: jest.fn().mockReturnValue({
        valueChanges: of({
          data: { skills: { nodes: mockSkills } },
          loading: false,
          networkStatus: 7,
        } as ApolloQueryResult<{ skills: { nodes: (SkillNode | null)[] } }>),
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: GetSkillsGQL, useValue: getSkillsGQLMock },
      ],
    });

    service = TestBed.inject(PlastikawebSkillsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
