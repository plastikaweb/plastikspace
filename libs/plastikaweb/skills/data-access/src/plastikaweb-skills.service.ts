import { map, Observable } from 'rxjs';

import { inject, Injectable } from '@angular/core';
import { GetSkillsGQL, SkillNode } from '@plastik/plastikaweb/graphql-models';

@Injectable({
  providedIn: 'root',
})
export class PlastikawebSkillsService {
  readonly skillsGQL = inject(GetSkillsGQL);

  readonly allSkills$: Observable<(SkillNode | null)[]> = this.skillsGQL
    .watch()
    .valueChanges.pipe(map(result => result.data?.skills?.nodes ?? []));
}
