import { Component, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { PushPipe } from '@ngrx/component';
import { NasaImagesFacade } from '@plastik/nasa-images/data-access';

import { NasaImagesFaqsService } from '../nasa-images-faqs.service';

@Component({
  selector: 'plastik-nasa-images-faqs-feature',
  imports: [MatExpansionModule, MatIconModule, PushPipe],
  templateUrl: './nasa-images-faqs-feature.component.html',
  styleUrls: ['./nasa-images-faqs-feature.component.scss'],
})
export class NasaImagesFaqsFeatureComponent {
  routeInfo$ = inject(NasaImagesFacade).routeInfo$;
  faqs$ = inject(NasaImagesFaqsService).getList();
}
