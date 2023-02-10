import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PushModule } from '@ngrx/component';
import { NasaImagesDataAccessModule, NasaImagesFacade } from '@plastik/nasa-images/data-access';

@Component({
  selector: 'plastik-nasa-images-feature-search',
  standalone: true,
  imports: [NasaImagesDataAccessModule, JsonPipe, PushModule],
  templateUrl: './nasa-images-feature-search.component.html',
  styleUrls: ['./nasa-images-feature-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NasaImagesFeatureSearchComponent implements OnInit {
  images$ = this.facade.allNasaImages$;

  constructor(private readonly facade: NasaImagesFacade) {}

  ngOnInit(): void {
    this.facade.load();
  }
}
