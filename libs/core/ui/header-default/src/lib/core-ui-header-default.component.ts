import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  standalone: true,
  selector: 'plastik-header-default',
  imports: [MatToolbarModule],
  templateUrl: './core-ui-header-default.component.html',
})
export class CoreUiHeaderDefaultComponent {}
