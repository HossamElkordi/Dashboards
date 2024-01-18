import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DateSlicerComponent } from 'src/app/components/date-slicer/date-slicer.component';
import { GaugeComponent } from 'src/app/components/gauge/gauge.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { PdClient, Column } from 'src/app/interfaces/types';
import { PdServiceService } from 'src/app/services/pd-service.service';

@Component({
  selector: 'app-clients-filter',
  templateUrl: './clients-filter.component.html',
  styleUrls: ['./clients-filter.component.css'],
})
export class ClientsFilterComponent {
  constructor(private pdService: PdServiceService) {}

  @ViewChild(GaugeComponent) gauge!: GaugeComponent;
  @ViewChild(DateSlicerComponent) dateSlicer!: DateSlicerComponent;
  @ViewChild(TableComponent) table!: TableComponent;

  @Output() viewClient = new EventEmitter<any>();

  clients!: MatTableDataSource<PdClient>;
  columns: Column[] = [
    { name: 'Client ID', value: 'id', type: 'text' },
    { name: 'Job', value: 'job', type: 'text', filter: true },
    {
      name: 'Years of Employment',
      value: 'years_emp',
      type: 'text',
      filter: true,
    },
    {
      name: 'Marital Status',
      value: 'marital_status_str',
      type: 'text',
      filter: true,
    },
    {
      name: 'Number of Dependents',
      value: 'Num_Dependents',
      type: 'text',
      filter: true,
    },
    { name: 'PD (%)', value: 'PD', type: 'gauge', min: 0, max: 30 },
  ];

  gauge_value: number = 0;
  gauge_append: string = '%';
  gauge_label: string = 'PD';

  selectedClient: PdClient | null = null;
  viewedClient: PdClient | null = null;
  filters = { job: [] };

  pieChartTitle: string = 'Clients Across Different Industries';
  pieChartSeries!: number[];
  pieChartLabels!: string[];

  barChartTitle: string = 'PD Across Different Industries';
  barChartSeries!: { name: string; data: number[] }[];
  barChartLabels!: string[];

  ngOnInit() {
    this.getPossibleFilters();
    this.applyFilters();
  }

  ngOnChanges(ch: any) {
    console.log(ch);
  }

  applyFilters(newFilters: any = {}) {
    console.log(newFilters);
    this.selectedClient = null;
    this.filters = { ...this.filters, ...newFilters };
    this.pdService.applyFilterValues(this.filters).subscribe((data) => {
      this.clients! = new MatTableDataSource(
        data.map((client) => ({
          ...client,
          PD: +(client.PD * 100).toFixed(1),
          marital_status_str:
            client.Marital_Status === 1 ? 'Married' : 'Not Married',
        }))
      );
      this.gauge.gaugeValue = +(this.calculateAvgPd(data) * 100).toFixed(1);

      if (Object.keys(newFilters).length > 0) this.updateCharts(data);
      else {
        this.pdService
          .getJobsClientsCount()
          .subscribe((data) => this.fillPieChart(data));
        this.pdService
          .getJobsAvgPD()
          .subscribe((data) => this.fillBarChart(data));
      }
    });
  }

  getPossibleFilters() {
    this.pdService.getFilterValues().subscribe((filterValues) => {
      this.dateSlicer.min_val = new Date(filterValues.date[0]);
      this.dateSlicer.max_val = new Date(filterValues.date[1]);
      this.dateSlicer.cur_min = this.dateSlicer.min_val;
      this.dateSlicer.cur_max = this.dateSlicer.max_val;

      this.table.filterValues = {
        job: { filter: 'job', values: filterValues.job },
        years_emp: { filter: 'years_emp', values: filterValues.years_emp },
        marital_status_str: {
          filter: 'Marital_Status',
          values: filterValues.Marital_Status,
          labels: filterValues.Marital_Status.map((status) =>
            status ? 'Married' : 'Not Married'
          ),
        },
        Num_Dependents: {
          filter: 'Num_Dependents',
          values: filterValues.Num_Dependents,
        },
      };
    });
  }

  updateCharts(data: PdClient[]) {
    let countsData: { job: string; count: number }[] = [];
    let PDsData: { job: string; PD: number }[] = [];
    const jobs = new Set(data.map((client) => client.job));
    Array.from(jobs).forEach((job) => {
      const jobPD = data
        .filter((client) => client.job === job)
        .map((client) => client.PD);
      const avgPD = jobPD.reduce((prev, curr) => prev + curr, 0) / jobPD.length;
      countsData.push({ job, count: jobPD.length });
      PDsData.push({ job, PD: avgPD });
    });

    this.fillPieChart(countsData);
    this.fillBarChart(PDsData);
  }

  calculateAvgPd(clients: PdClient[]) {
    let sum = 0;
    for (const client of clients) {
      sum += client.PD;
    }
    return sum / clients.length;
  }

  selectClient(client: PdClient) {
    if (client) {
      this.gauge.gaugeValue = client.PD;
    } else {
      this.gauge.gaugeValue = +this.calculateAvgPd(this.clients.data).toFixed(
        1
      );
    }
  }

  fillPieChart(data: { job: string; count: number }[]) {
    data.sort((a, b) => b.count - a.count);
    const displayNumber = 5;
    let counts = data.map((entry) => entry.count);
    let jobs = data.map((entry) => entry.job);

    let series = [...counts.slice(0, displayNumber)];
    let labels = [...jobs.slice(0, displayNumber)];

    const notDisplayedNumber = data.length - displayNumber;
    if (notDisplayedNumber > 0) {
      const notDisplayedSum = counts
        .slice(displayNumber)
        .reduce((prev, curr) => prev + curr, 0);

      series.push(notDisplayedSum);
      labels.push('Other');
    }

    this.pieChartSeries = series;
    this.pieChartLabels = labels;
  }

  fillBarChart(data: { job: string; PD: number }[]) {
    data.sort((a, b) => b.PD - a.PD);
    const displayNumber = 10;
    let PDs = data.map((entry) => Math.round(entry.PD * 100) / 100);
    let jobs = data.map((entry) => entry.job);

    let series = [...PDs.slice(0, displayNumber)];
    let labels = [...jobs.slice(0, displayNumber)];

    const notDisplayedNumber = data.length - displayNumber;
    if (notDisplayedNumber > 0) {
      const notDisplayedSum = PDs.slice(displayNumber).reduce(
        (prev, curr) => prev + curr,
        0
      );
      const notDisplayedAvg = notDisplayedSum / notDisplayedNumber;
      series.push(notDisplayedAvg);
      labels.push('Other');
    }

    this.barChartSeries = [{ name: 'PDs', data: series }];
    this.barChartLabels = labels;
  }

  viewClientDetails(client: PdClient) {
    this.viewedClient = client;
    this.selectedClient = client;
    this.selectClient(client);
    this.viewClient.emit(this.viewedClient);
  }
}
