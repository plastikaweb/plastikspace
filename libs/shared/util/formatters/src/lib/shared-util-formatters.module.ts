import { DatePipe, PercentPipe, TitleCasePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { SafeFormattedPipe } from './safe-formatted-cell.pipe';
import { DataFormatFactoryService, SharedUtilFormattersService } from './services';

@NgModule({
  declarations: [SafeFormattedPipe],
  providers: [SharedUtilFormattersService, DataFormatFactoryService, DatePipe, TitleCasePipe, PercentPipe],
  exports: [SafeFormattedPipe],
})
export class SharedUtilFormattersModule {}
