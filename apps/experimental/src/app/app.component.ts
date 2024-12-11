import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedUtilDynamicBgColorDirective } from '@plastik/shared/dynamic-bg-color';

@Component({
    imports: [RouterModule, SharedUtilDynamicBgColorDirective],
    selector: 'exp-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Welcome experimental';
}
