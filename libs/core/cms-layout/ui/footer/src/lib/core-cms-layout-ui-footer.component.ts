import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  standalone: true,
  selector: 'plastik-core-cms-layout-ui-footer',
  templateUrl: './core-cms-layout-ui-footer.component.html',
  styles: [
    `
      mat-toolbar {
        --mat-toolbar-standard-height: 35px;
      }
    `,
  ],
  imports: [MatToolbarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreCmsLayoutUiFooterComponent {}
