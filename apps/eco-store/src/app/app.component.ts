import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ENVIRONMENT } from '@plastik/core/environments';
import { EcoStoreEnvironment } from '@plastik/eco-store/entities';

@Component({
  imports: [RouterOutlet],
  selector: 'eco-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    class: 'w-full h-lvh block',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly #translate = inject(TranslateService);
  readonly #environment = inject(ENVIRONMENT) as EcoStoreEnvironment;

  constructor() {
    this.#translate.addLangs(this.#environment.languages);
  }
}
