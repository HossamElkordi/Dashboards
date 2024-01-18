import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, shareReplay, tap } from 'rxjs';
import {
  Column,
  LifecycleClient,
  LifecycleData,
  checkbox_list_items,
  num_slicer_selection,
} from 'src/app/interfaces/types';
import { SegmentationServiceService } from 'src/app/services/segmentation-service.service';

@Component({
  selector: 'app-lifecycle',
  templateUrl: './lifecycle.component.html',
  styleUrls: ['./lifecycle.component.css'],
})
export class LifecycleComponent {
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

  selectedClient: LifecycleClient | null = null;

  columns: Column[] = [
    { name: 'Customer ID', value: 'User', type: 'text' },
    { name: 'Recency', value: 'Recency', type: 'text' },
    { name: 'Frequency', value: 'Frequency', type: 'text' },
    { name: 'Monetary', value: 'Monetary', type: 'text' },
    { name: 'Current Segment', value: 'Current_Segment', type: 'text' },
    { name: 'Batch 0 Segment', value: 'batch_0_segment', type: 'text' },
    { name: 'Batch 5 Segment', value: 'batch_5_segment', type: 'text' },
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

  filteredData$!: Observable<LifecycleData>;
  tableData!: MatTableDataSource<LifecycleClient>;

  chartsDict = {
    current: 'current',
    batch0: 'batch0',
    batch1: 'batch1',
    batch2: 'batch2',
    batch3: 'batch3',
    batch4: 'batch4',
    batch5: 'batch5',
  };

  displayedCharts: string[] = [];

  chartsInfo: {
    [index: string]: {
      title: string;
      labels: string[];
      data: any[];
    };
  } = {
    [this.chartsDict.current]: {
      title: 'Current Segment Histogram',
      labels: [],
      data: [],
    },
    [this.chartsDict.batch0]: {
      title: 'Batch 0 Histogram',
      labels: [],
      data: [],
    },
    [this.chartsDict.batch1]: {
      title: 'Batch 1 Histogram',
      labels: [],
      data: [],
    },
    [this.chartsDict.batch2]: {
      title: 'Batch 2 Histogram',
      labels: [],
      data: [],
    },
    [this.chartsDict.batch3]: {
      title: 'Batch 3 Histogram',
      labels: [],
      data: [],
    },
    [this.chartsDict.batch4]: {
      title: 'Batch 4 Histogram',
      labels: [],
      data: [],
    },
    [this.chartsDict.batch5]: {
      title: 'Batch 5 Histogram',
      labels: [],
      data: [],
    },
  };

  ngOnInit() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredData$ = this.service.lifecycleInfo(this.filters).pipe(
      tap((data) => {
        this.tableData = new MatTableDataSource(
          data.Segment_Life_Cycle_Data.map((client) => ({
            ...client,
            Monetary: +client.Monetary.toFixed(2),
          }))
        );

        this.chartsInfo[this.chartsDict.current].labels =
          data.Current_Segment_counts.map((entity) => entity.name);
        this.chartsInfo[this.chartsDict.current].data =
          data.Current_Segment_counts.map((entity) => entity.value);

        this.chartsInfo[this.chartsDict.batch0].labels =
          data.Batch_0_counts.map((entity) => entity.name);
        this.chartsInfo[this.chartsDict.batch0].data = data.Batch_0_counts.map(
          (entity) => entity.value
        );

        this.chartsInfo[this.chartsDict.batch1].labels =
          data.Batch_1_counts.map((entity) => entity.name);
        this.chartsInfo[this.chartsDict.batch1].data = data.Batch_1_counts.map(
          (entity) => entity.value
        );

        this.chartsInfo[this.chartsDict.batch2].labels =
          data.Batch_2_counts.map((entity) => entity.name);
        this.chartsInfo[this.chartsDict.batch2].data = data.Batch_2_counts.map(
          (entity) => entity.value
        );

        this.chartsInfo[this.chartsDict.batch3].labels =
          data.Batch_3_counts.map((entity) => entity.name);
        this.chartsInfo[this.chartsDict.batch3].data = data.Batch_3_counts.map(
          (entity) => entity.value
        );

        this.chartsInfo[this.chartsDict.batch4].labels =
          data.Batch_4_counts.map((entity) => entity.name);
        this.chartsInfo[this.chartsDict.batch4].data = data.Batch_4_counts.map(
          (entity) => entity.value
        );

        this.chartsInfo[this.chartsDict.batch5].labels =
          data.Batch_5_counts.map((entity) => entity.name);
        this.chartsInfo[this.chartsDict.batch5].data = data.Batch_5_counts.map(
          (entity) => entity.value
        );
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
