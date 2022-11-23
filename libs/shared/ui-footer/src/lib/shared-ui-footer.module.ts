import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UiFooterComponent } from './ui-footer.component';

@NgModule({
  declarations: [UiFooterComponent],
  imports: [CommonModule],
  exports: [UiFooterComponent],
})
export class SharedUiFooterModule {}
