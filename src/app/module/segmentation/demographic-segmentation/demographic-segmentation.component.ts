import { Component, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, shareReplay, tap } from 'rxjs';
import { DropdownComponent } from 'src/app/components/dropdown/dropdown.component';
import {
  Column,
  DemographicSegmentationData,
  DemographicSegmentationFilters,
  DemographicSegmentationClient,
  checkbox_list_items,
} from 'src/app/interfaces/types';
import { SegmentationServiceService } from 'src/app/services/segmentation-service.service';

@Component({
  selector: 'app-demographic-segmentation',
  templateUrl: './demographic-segmentation.component.html',
  styleUrls: ['./demographic-segmentation.component.css'],
})
export class DemographicSegmentationComponent {
  constructor(private segService: SegmentationServiceService) {}

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

  // TODO: remove when backend is edited...
  ageGroups = ['18 - 34', '35 - 44', '45 - 54', '55 - 64', '65 - 74', '> 74'];
  eduLevels = ['Childhood', 'Primary', 'Secondary', 'Tertiary'];

  @ViewChild('eduDropdown') eduDropdown!: DropdownComponent;
  @ViewChild('kidsCountDropdown') kidsCountDropdown!: DropdownComponent;
  @ViewChild('stateDropdown') stateDropdown!: DropdownComponent;

  selectedClient: DemographicSegmentationClient | null = null;

  columns: Column[] = [
    { name: 'Customer Name', value: 'Person', type: 'text' },
    { name: 'Gender', value: 'Gender', type: 'text', filter: true },
    { name: 'Demographic Segment', value: 'cluster_labels', type: 'text' },
    { name: 'City', value: 'City', type: 'text', filter: true },
    { name: 'Age', value: 'Age', type: 'text', filter: true },
    {
      name: 'Yearly Income',
      value: 'Yearly_Income_Person',
      type: 'text',
      filter: true,
    },
    { name: 'FICO Score', value: 'FICO_Score', type: 'text', filter: true },
  ];

  chartsDict = {
    ageSeg: 'ageSeg',
    eduLevel: 'eduLevel',
    kidsCount: 'kidsCount',
    income: 'income',
    demoSeg: 'demoSeg',
    genderDist: 'genderDist',
  };

  chartsInfo: {
    [index: string]: {
      title: string;
      labels: string[];
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
    [this.chartsDict.income]: {
      title: 'Yearly Income Histogram',
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
    [this.chartsDict.genderDist]: {
      title: 'Gender Distribution',
      labels: [],
      data: [],
      type: 'pie',
    },
  };

  displayedCharts: string[] = [];

  appliedFilters = {} as DemographicSegmentationFilters;

  filterValues!: {
    [index: string]: { filter: string; values: any[]; labels?: string[] };
  };
  filteredData$!: Observable<DemographicSegmentationData>;
  tableData!: MatTableDataSource<DemographicSegmentationClient>;

  ngOnInit() {
    this.getFilterValues();
    this.applyFilters();
  }

  getFilterValues() {
    this.segService.getFilterValues().subscribe((filterValues) => {
      this.filterValues = {
        Gender: { filter: 'Gender', values: filterValues.Gender },
        City: { filter: 'City', values: filterValues.City },
        Age: {
          filter: 'Age_Segment',
          values: filterValues.Age_Segment,
          labels: filterValues.Age_Segment.sort().map(
            (seg) => this.ageGroups[seg - 1]
          ),
        },
        Yearly_Income_Person: {
          filter: 'Yearly_Income_segment',
          values: filterValues.Yearly_Income_segment,
        },
        FICO_Score: { filter: 'FICO_Score', values: filterValues.FICO_Score },
      };
      this.eduDropdown.options = filterValues.Education_Level.sort().map(
        (level) => ({
          label: this.eduLevels[level - 1],
          value: level,
        })
      );
      this.kidsCountDropdown.options = filterValues.Num_Of_Kids.map((num) => ({
        label: num,
        value: num,
      }));
      this.stateDropdown.options = filterValues.State.map((state) => ({
        label: state,
        value: state,
      }));
    });
  }

  applyFilters(newFilters = {}) {
    this.appliedFilters = { ...this.appliedFilters, ...newFilters };
    this.filteredData$ = this.segService
      .demographicSegmentationInfo(this.appliedFilters)
      .pipe(
        tap((data) => {
          this.tableData = new MatTableDataSource(
            data.Demographic_Segmentation_Data
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

          this.chartsInfo[this.chartsDict.income].labels = Object.keys(
            data.Yearly_Income_counts
          );
          this.chartsInfo[this.chartsDict.income].data = Object.values(
            data.Yearly_Income_counts
          );

          this.chartsInfo[this.chartsDict.demoSeg].labels = Object.keys(
            data.cluster_labels_counts
          );
          this.chartsInfo[this.chartsDict.demoSeg].data = Object.values(
            data.cluster_labels_counts
          );

          this.chartsInfo[this.chartsDict.genderDist].labels = Object.keys(
            data.Gender_counts
          );
          this.chartsInfo[this.chartsDict.genderDist].data = Object.values(
            data.Gender_counts
          );
          this.selectedClient = null;
        }),
        shareReplay()
      );
  }

  selectClient() {
    if (this.selectedClient == null) {
      console.log(this.selectedClient);
      this.applyFilters();
    } else {
      this.filteredData$ = this.segService
        .demographicSegmentationIdInfo(this.selectedClient.user_id)
        .pipe(
          tap((data) => {
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

            this.chartsInfo[this.chartsDict.income].labels = Object.keys(
              data.Yearly_Income_counts
            );
            this.chartsInfo[this.chartsDict.income].data = Object.values(
              data.Yearly_Income_counts
            );

            this.chartsInfo[this.chartsDict.demoSeg].labels = Object.keys(
              data.cluster_labels_counts
            );
            this.chartsInfo[this.chartsDict.demoSeg].data = Object.values(
              data.cluster_labels_counts
            );
          }),
          shareReplay()
        );
    }
  }
}
