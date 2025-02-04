import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedUtilDynamicBgColorDirective } from '@plastik/shared/dynamic-bg-color';

@Component({
  imports: [RouterModule, SharedUtilDynamicBgColorDirective],
  selector: 'exp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = signal('Welcome experimental');
}
