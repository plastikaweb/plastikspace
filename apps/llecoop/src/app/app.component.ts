import { Component } from '@angular/core';
import { CoreCmsLayoutFeatureComponent } from '@plastik/core/cms-layout';

@Component({
  standalone: true,
  selector: 'plastik-root',
  imports: [CoreCmsLayoutFeatureComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
