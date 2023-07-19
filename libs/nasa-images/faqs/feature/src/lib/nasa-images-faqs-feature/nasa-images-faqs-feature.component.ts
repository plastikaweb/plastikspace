import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { PushPipe } from '@ngrx/component';
import { NasaImagesFacade } from '@plastik/nasa-images/data-access';

import { NasaImagesFaqsService } from '../nasa-images-faqs.service';

@Component({
  selector: 'plastik-nasa-images-faqs-feature',
  standalone: true,
  imports: [NgFor, NgIf, MatExpansionModule, MatIconModule, PushPipe],
  templateUrl: './nasa-images-faqs-feature.component.html',
})
export class NasaImagesFaqsFeatureComponent {
  routeInfo$ = inject(NasaImagesFacade).routeInfo$;
  faqs$ = inject(NasaImagesFaqsService).getList();

  trackFaqs(index: number): number {
    return index;
  }
}
