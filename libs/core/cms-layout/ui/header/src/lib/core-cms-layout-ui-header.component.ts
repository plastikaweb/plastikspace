import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'plastik-core-cms-layout-ui-header',
  imports: [MatToolbarModule],
  template: `
    <mat-toolbar role="banner">
      <ng-content select="[start]"></ng-content>
      <span class="flex-auto"></span>
      <ng-content select="[end]"></ng-content>
    </mat-toolbar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreCmsLayoutUiHeaderComponent {}
