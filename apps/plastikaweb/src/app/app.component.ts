import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkillsFeatureComponent } from '@plastik/plastikaweb/skills';

@Component({
  selector: 'plastik-root',
  imports: [RouterModule, SkillsFeatureComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
