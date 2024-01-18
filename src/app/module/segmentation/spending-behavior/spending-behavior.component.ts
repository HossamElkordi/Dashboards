import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, tap, shareReplay } from 'rxjs';
import {
  Column,
  SpendingBehaviorClient,
  SpendingBehaviorData,
  checkbox_list_items,
  num_slicer_selection,
} from 'src/app/interfaces/types';
import { SegmentationServiceService } from 'src/app/services/segmentation-service.service';

@Component({
  selector: 'app-spending-behavior',
  templateUrl: './spending-behavior.component.html',
  styleUrls: ['./spending-behavior.component.css'],
})
export class SpendingBehaviorComponent {
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

  selectedClient: SpendingBehaviorClient | null = null;

  // TODO: remove when backend is edited...
  ageGroups = ['18 - 34', '35 - 44', '45 - 54', '55 - 64', '65 - 74', '> 74'];
  eduLevels = ['Childhood', 'Primary', 'Secondary', 'Tertiary'];

  columns: Column[] = [
    { name: 'Customer ID', value: 'User', type: 'text' },
    { name: 'Recency', value: 'Recency', type: 'text' },
    { name: 'Frequency', value: 'Frequency', type: 'text' },
    { name: 'Monetary', value: 'Monetary', type: 'text' },
    { name: 'Gender', value: 'Gender_x', type: 'text' },
    { name: 'City', value: 'City_x', type: 'text' },
    { name: 'Yearly Income', value: 'Yearly_Income_segment', type: 'text' },
  ];

  filters: {
    Frequency: number[];
    Monetary: number[];
    Recency: number[];
    id?: number;
  } = {
    Recency: [-1017, 4551],
    Frequency: [15, 81346],
    Monetary: [136, 5043049],
  };

  slicers = [
    {
      title: 'Recency',
      min_val: this.filters.Recency[0],
      max_val: this.filters.Recency[1],
      step: 10,
    },
    {
      title: 'Frequency',
      min_val: this.filters.Frequency[0],
      max_val: this.filters.Frequency[1],
      step: 100,
    },
    {
      title: 'Monetary',
      min_val: this.filters.Monetary[0],
      max_val: this.filters.Monetary[1],
      step: 1000,
    },
  ];

  filteredData$!: Observable<SpendingBehaviorData>;
  tableData!: MatTableDataSource<SpendingBehaviorClient>;

  chartsDict = {
    eduLevel: 'eduLevel',
    ageSeg: 'ageSeg',
    kidsCount: 'kidsCount',
    valSeg: 'valSeg',
    demoSeg: 'demoSeg',
    clientsDist: 'clientsDist',
  };

  chartsInfo: {
    [index: string]: {
      title: string;
      labels?: string[];
      data: any[];
      type: string;
    };
  } = {
    [this.chartsDict.ageSeg]: {
      title: 'Age Segment Histogram',
      labels: [],
      data: [],
      type: 'bar',
    },
    [this.chartsDict.eduLevel]: {
      title: 'Education Level Histogram',
      labels: [],
      data: [],
      type: 'bar',
    },
    [this.chartsDict.kidsCount]: {
      title: 'Number of Kids Histogram',
      labels: [],
      data: [],
      type: 'bar',
    },
    [this.chartsDict.valSeg]: {
      title: 'Value Based Segmentation',
      labels: [],
      data: [],
      type: 'bar',
    },
    [this.chartsDict.demoSeg]: {
      title: 'Demographic Segment Histogram',
      labels: [],
      data: [],
      type: 'bar',
    },
    [this.chartsDict.clientsDist]: {
      title: 'Clients Distribution',
      data: [],
      type: 'geo',
    },
  };

  displayedCharts: string[] = [];

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredData$ = this.service.spendingBehaviorInfo(this.filters).pipe(
      tap((data) => {
        this.tableData = new MatTableDataSource(
          data.Spending_Behavior_Data.map((client) => ({
            ...client,
            Monetary: +client.Monetary.toFixed(2),
          }))
        );

        this.chartsInfo[this.chartsDict.ageSeg].labels = Object.keys(
          data.Age_Segment_counts
        ).map((seg) => this.ageGroups[parseInt(seg) - 1]);
        this.chartsInfo[this.chartsDict.ageSeg].data = Object.values(
          data.Age_Segment_counts
        );

        this.chartsInfo[this.chartsDict.eduLevel].labels = Object.keys(
          data.Education_Level_counts
        ).map((level) => this.eduLevels[parseInt(level) - 1]);
        this.chartsInfo[this.chartsDict.eduLevel].data = Object.values(
          data.Education_Level_counts
        );

        this.chartsInfo[this.chartsDict.kidsCount].labels = Object.keys(
          data.Num_Of_Kids_counts
        );
        this.chartsInfo[this.chartsDict.kidsCount].data = Object.values(
          data.Num_Of_Kids_counts
        );

        this.chartsInfo[this.chartsDict.valSeg].labels =
          data.Value_Based_Segment_counts.map((entity) => entity.name);
        this.chartsInfo[this.chartsDict.valSeg].data =
          data.Value_Based_Segment_counts.map((entity) => entity.value);

        this.chartsInfo[this.chartsDict.demoSeg].labels =
          data.Demographic_Segment_counts.map((entity) => entity.name);
        this.chartsInfo[this.chartsDict.demoSeg].data =
          data.Demographic_Segment_counts.map((entity) => entity.value);

        this.chartsInfo[this.chartsDict.clientsDist].data =
          data.Spending_Behavior_ID_Data.map((entity) => ({
            latitude: entity.Latitude,
            longitude: entity.Longitude,
          }));
      }),
      shareReplay()
    );
  }

  handleSlicerChange(slicers: num_slicer_selection[]) {
    slicers.forEach((slicer) => {
      if (slicer.title === 'Recency')
        this.filters.Recency = [slicer.cur_min!, slicer.cur_max!];
      if (slicer.title === 'Frequency')
        this.filters.Frequency = [slicer.cur_min!, slicer.cur_max!];
      if (slicer.title === 'Monetary')
        this.filters.Monetary = [slicer.cur_min!, slicer.cur_max!];
    });
    if (this.filters.id) delete this.filters.id;
    this.selectedClient = null;
    this.applyFilters();
  }

  selectClient() {
    if (this.selectedClient == null) {
      delete this.filters.id;
    } else {
      this.filters = { ...this.filters, id: this.selectedClient.User };
    }
    this.applyFilters();
  }
}
