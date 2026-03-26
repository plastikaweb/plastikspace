import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'plastik-language-switcher',
  templateUrl: './language-switcher.component.html',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  /**
   * The list of supported languages by code (e.g., ['ca', 'es', 'en']).
   */
  readonly languages = input.required<string[]>();

  /**
   * The currently active language code.
   */
  readonly current = input.required<string>();

  /**
   * Event emitted when a new language is selected.
   */
  readonly languageChange = output<string>();

  onSelect(language: string): void {
    if (language !== this.current()) {
      this.languageChange.emit(language);
    }
  }
}
