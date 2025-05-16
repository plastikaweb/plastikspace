import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'plastik-core-cms-layout-ui-footer',
  imports: [MatToolbarModule],
  templateUrl: './core-cms-layout-ui-footer.component.html',
  styles: [
    `
      mat-toolbar {
        --mat-toolbar-standard-height: 35px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreCmsLayoutUiFooterComponent {}
