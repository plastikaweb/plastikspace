import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { PushModule } from '@ngrx/component';
import { FormattingTypes, SharedUtilFormattersModule } from '@plastik/shared/formatters';
import { TableColumnFormatting } from '@plastik/shared/table/entities';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'plastik-shared-table',
  standalone: true,
  imports: [
    CommonModule,
    PushModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CdkTableModule,
    MatTooltipModule,
    RouterModule,
    AngularSvgIconModule,
    SharedUtilFormattersModule,
  ],
  templateUrl: './shared-table-ui.component.html',
  styleUrls: ['./shared-table-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedTableUiComponent<T> implements OnChanges, AfterViewInit {
  /**
   * Data that will populate the table.
   */
  @Input() data: T[] = [];

  /**
   * Table columns structure.
   */
  @Input() columnProperties!: TableColumnFormatting<T, FormattingTypes>[];

  /**
   * The total number of items available for the current table data request.
   * Used for pagination and to show the total number of items.
   */
  @Input() resultsLength?: number;

  @ViewChild(MatTable) matTable!: MatTable<T>;

  dataSource = new MatTableDataSource();
  displayedColumns: (string | number | symbol)[] = [];
  formattingTypes = FormattingTypes;

  ngAfterViewInit() {
    this.displayedColumns = this?.columnProperties?.map(property => property.key) || [];
  }

  ngOnChanges({ data, columnProperties }: SimpleChanges) {
    if (columnProperties) {
      this.displayedColumns = this?.columnProperties?.map(property => property.key) || [];
    }

    if (data) {
      this.dataSource.data = this.data;
    }
  }
}
