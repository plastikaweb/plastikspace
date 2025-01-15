import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { MatThemeToggleService } from './mat-theme-toggle.service';

@Component({
  selector: 'plastik-mat-theme-toggle',
  imports: [MatIconModule, MatButtonModule, MatMenuModule],
  providers: [MatThemeToggleService],
  templateUrl: './mat-theme-toggle.component.html',
  styleUrl: './mat-theme-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatThemeToggleComponent {
  protected readonly matThemeToggleService = inject(MatThemeToggleService);
}
