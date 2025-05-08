import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PlastikawebSkillsService } from '@plastik/plastikaweb/skills/data-access';

@Component({
  selector: 'plastik-skills-feature',
  imports: [CommonModule],
  templateUrl: './skills-feature.component.html',
  styleUrl: './skills-feature.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsFeatureComponent {
  readonly skillService = inject(PlastikawebSkillsService);
}
