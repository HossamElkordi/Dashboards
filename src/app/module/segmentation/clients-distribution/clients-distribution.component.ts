import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, tap } from 'rxjs';
import {
  Column,
  DistClient,
  checkbox_list_items,
} from 'src/app/interfaces/types';
import { SegmentationServiceService } from 'src/app/services/segmentation-service.service';

@Component({
  selector: 'app-clients-distribution',
  templateUrl: './clients-distribution.component.html',
  styleUrls: ['./clients-distribution.component.css'],
})
export class ClientsDistributionComponent {
  constructor(private service: SegmentationServiceService) {}

  @Input() set state(newState: checkbox_list_items[]) {
    for (const item of newState) {
      if (this.displayedCharts.includes(item.name) && !item.checked) {
        this.displayedCharts = this.displayedCharts.filter(
          (chart) => chart !== item.name
        );
      } else if (!this.displayedCharts.includes(item.name) && item.checked) {
        this.displayedCharts = [item.name, ...this.displayedCharts];
      }
    }
  }

  selectedClient: DistClient | null = null;

  columns: Column[] = [
    { name: 'Customer Name', value: 'Person', type: 'text' },
    { name: 'Current Age', value: 'Current_Age', type: 'text' },
    { name: 'Retirement Age', value: 'Retirement_Age', type: 'text' },
    { name: 'Longitude', value: 'Longitude', type: 'text' },
    { name: 'Latitude', value: 'Latitude', type: 'text' },
    { name: 'City', value: 'City', type: 'text', filter: true },
    { name: 'Gender', value: 'Gender', type: 'text', filter: true },
  ];
  tableFilters!: { [index: string]: { filter: string; values: any[] } };
  dropdownFilters: { state: { label: string; value: string }[] } = {
    state: [],
  };
  appliedFilters = {};

  filteredData$!: Observable<DistClient[]>;
  tableData!: MatTableDataSource<DistClient>;

  chartsDict = {
    clientsDist: 'clientsDist',
  };
  chartsInfo: { [index: string]: { title: string; data: any[] } } = {
    [this.chartsDict.clientsDist]: {
      title: 'Clients Distribution',
      data: [],
    },
  };
  displayedCharts: string[] = [];

  ngOnInit() {
    this.getFilterValues();
    this.applyFilters();
  }

  getFilterValues() {
    this.service.getClientsDistFilterValues().subscribe((values) => {
      this.tableFilters = {
        City: { filter: 'City', values: values.City },
        Gender: { filter: 'Gender', values: values.Gender },
      };
      this.dropdownFilters.state = values.State.map((state) => ({
        label: state,
        value: state,
      }));
    });
  }

  applyFilters() {
    this.filteredData$ = this.service.clientsDistInfo(this.appliedFilters).pipe(
      tap((data) => {
        this.tableData = new MatTableDataSource(data);
        this.chartsInfo[this.chartsDict.clientsDist].data = data.map(
          (client) => ({
            longitude: client.Longitude,
            latitude: client.Latitude,
          })
        );
        this.selectedClient = null;
      })
    );
  }

  setFilters(someFilters: { [index: string]: any[] }) {
    this.appliedFilters = { ...this.appliedFilters, ...someFilters };
    this.applyFilters();
  }

  selectClient() {
    if (this.selectedClient == null) {
      this.applyFilters();
    } else {
      this.filteredData$ = this.service
        .clientsDistIdInfo(this.selectedClient.User)
        .pipe(
          tap((data) => {
            this.chartsInfo[this.chartsDict.clientsDist].data = data.map(
              (client) => ({
                longitude: client.Longitude,
                latitude: client.Latitude,
              })
            );
          })
        );
    }
  }
}
