import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

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
export class AppComponent {}
