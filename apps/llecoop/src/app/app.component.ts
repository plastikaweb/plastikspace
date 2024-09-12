import { registerLocaleData } from '@angular/common';
import localeCa from '@angular/common/locales/ca';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

registerLocaleData(localeCa, 'ca-ES');

@Component({
  standalone: true,
  selector: 'plastik-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {}
