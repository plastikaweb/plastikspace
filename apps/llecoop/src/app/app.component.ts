import { Component } from '@angular/core';
import { CoreCmsLayoutFeatureComponent } from '@plastik/core/cms-layout';

@Component({
  standalone: true,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'plastik-root',
  imports: [CoreCmsLayoutFeatureComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
