import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

import { UiHeaderComponent } from './ui-header.component';

@NgModule({
  imports: [CommonModule, MatToolbarModule],
  declarations: [UiHeaderComponent],
  exports: [UiHeaderComponent],
})
export class SharedUiHeaderModule {}
