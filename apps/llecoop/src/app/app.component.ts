import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { CoreCmsLayoutFeatureComponent } from '@plastik/core/cms-layout';

@Component({
  standalone: true,
  selector: 'plastik-root',
  imports: [CoreCmsLayoutFeatureComponent, JsonPipe],
  templateUrl: './app.component.html',
})
export class AppComponent {}
