import { registerLocaleData } from '@angular/common';
import localeCa from '@angular/common/locales/ca';
import { Component } from '@angular/core';
import { CoreCmsLayoutFeatureComponent } from '@plastik/core/cms-layout';

registerLocaleData(localeCa, 'ca-ES');

@Component({
  standalone: true,
  selector: 'plastik-root',
  imports: [CoreCmsLayoutFeatureComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
