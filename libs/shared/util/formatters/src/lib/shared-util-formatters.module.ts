import { DatePipe, PercentPipe, TitleCasePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { DataFormatFactoryService, SharedUtilFormattersService } from './services';

@NgModule({
  providers: [
    SharedUtilFormattersService,
    DataFormatFactoryService,
    DatePipe,
    TitleCasePipe,
    PercentPipe,
  ],
})
export class SharedUtilFormattersModule {}
