import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnInit
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Column } from 'src/app/interfaces/types';
import { DarkThemeService } from 'src/app/dark-theme.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {

  isDarkTheme = false;

  constructor(private darkThemeService: DarkThemeService) { }

  ngOnInit(): void {
    this.darkThemeService.isDarkTheme$.subscribe((isDark) => {
      this.isDarkTheme = isDark;
    });
  }

  displayedColumns!: string[];
  appliedFilters: any = {};
  thickness: number = 5;
  size: number = 45;
  pageSize: number = 25;
  totalData: number = 0;
  pageIndex: number = 0;
  selectedRowIdx: number | null = null;

  @Input() filterValues!: {
    [index: string]: { filter: string; values: any[]; labels?: string[] };
  };

  tableCols!: Column[];
  @Input() set columns(cols: Column[]) {
    this.tableCols = cols;
    this.displayedColumns = cols?.map((col) => col.value);
  }

  /* an array of objects where each object represents a row in the table. */
  tableData!: MatTableDataSource<any>;
  @Input() set dataSource(data: MatTableDataSource<any>) {
    this.tableData = data;
    if (this.tableData) {
      this.tableData.sort = this.sort;
      this.tableData.paginator = this.paginator;
    }
  }

  rowSelTime: number = 0;
  tableSelRow: any = null;
  @Input() set selectedRow(row: any) {
    this.tableSelRow = row;
    if (!row) this.selectedRowIdx = null;
  }

  @Output() selectedRowChange = new EventEmitter<any>();
  @Output() rowDoubleClick = new EventEmitter<any>();
  @Output() filterClients = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    if (this.tableData) {
      this.tableData.sort = this.sort;
      this.tableData.paginator = this.paginator;
    }
  }

  selectRow(index: number, row: any) {
    const currTime = new Date().getTime();
    if (currTime - this.rowSelTime < 400) {
      this.selectedRowIdx = index;
      this.rowDoubleClick.emit(row);
    } else if (this.selectedRowIdx === index) {
      this.selectedRowIdx = null;
      this.tableSelRow = null;
      this.selectedRowChange.emit(this.tableSelRow);
    } else {
      this.selectedRowIdx = index;
      this.tableSelRow = row;
      this.selectedRowChange.emit(this.tableSelRow);
    }
    this.rowSelTime = currTime;
  }

  clickColumnFilter(checked: boolean, filter: string, value: any) {
    if (!this.appliedFilters[filter]) this.appliedFilters[filter] = [];
    if (checked) {
      this.appliedFilters[filter]?.push(value);
    } else {
      this.appliedFilters[filter] = this.appliedFilters[filter].filter(
        (item: any) => item !== value
      );
    }
    this.filterClients.emit(this.appliedFilters);
  }
}
