import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { EcoStoreProductCategoriesApiService } from '@plastik/eco-store/product-categories/data-access';

@Component({
  imports: [RouterOutlet, JsonPipe],
  selector: 'eco-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    class: 'w-full h-lvh block',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  s = inject(EcoStoreProductCategoriesApiService);

  categories = toSignal(this.s.getFullList());
}
