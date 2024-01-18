import { Component, Input, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexStroke,
  ApexGrid,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexTheme
} from 'ng-apexcharts';
import { DarkThemeService } from 'src/app/dark-theme.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnInit {
  isDarkTheme = false;
  // @Input() title!: string;
  @Input() xValues!: any[];
  @Input() yValues!: number[];
  @Input() Width?: string = 'auto';
  @Input() Height: string = '350';
  @Input() set title(value: string) {
    this.chartTitleOptions.text = value;
  }

  public chartSeries: ApexAxisChartSeries;
  public chartOptions: ApexChart;
  public chartTitleOptions: ApexTitleSubtitle;
  public xAxisOptions: ApexXAxis;
  public strokeOptions: ApexStroke;
  public gridOptions: ApexGrid;
  public fillOptions: ApexFill;
  public markersOptions: ApexMarkers;
  public yAxisOptions: ApexYAxis;
  public dataLabelsOptions: ApexDataLabels;
  public tooltipOptions: ApexTooltip;
  theme: ApexTheme = {
    mode: 'light',
  };

  constructor(private darkThemeService: DarkThemeService, private cdr: ChangeDetectorRef) {
    this.tooltipOptions = {
      enabled: true,
      // theme: 'dark',

    };

    this.chartSeries = [
      {
        name: this.title,
        data: this.yValues,
      },
    ];

    this.chartOptions = {
      height: this.Height,
      type: 'line',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    };

    this.chartTitleOptions = {
      text: this.title,
      align: 'center',
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#044492',
      },
    };

    this.xAxisOptions = {
      categories: this.xValues,
      type: 'datetime',
      labels: {
        style: {
          fontSize: '12px',
          colors: '#4A4A4A',
        },
      },
    };

    this.strokeOptions = {
      curve: 'smooth',
      width: 3,
      colors: ['#92BBE1'],
    };

    this.gridOptions = {
      borderColor: '#E7E7E7',
    };

    this.fillOptions = {
      // colors: ['#007bff'],
      // type: 'gradient',
      // gradient: {
      //   shadeIntensity: 1,
      //   opacityFrom: 0.7,
      //   opacityTo: 0.9,
      //   stops: [0, 100],
      // },
      colors: ['#92BBE1'],
      type: 'solid',
    };

    this.markersOptions = {
      size: 5,
      colors: ['#044492'],
      strokeColors: '#ffffff',
      strokeWidth: 2,
    };

    this.yAxisOptions = {
      labels: {
        style: {
          fontSize: '12px',
          // colors: '#4A4A4A',
        },
      },
    };

    this.dataLabelsOptions = {
      enabled: false,
    };
  }

  ngOnInit(): void {
    this.darkThemeService.isDarkTheme$.subscribe((isDark) => {
      this.isDarkTheme = isDark;
      this.updateChartOptions();
      this.cdr.detectChanges();
    });
    this.chartSeries = [
      {
        name: this.title,
        data: this.yValues,
      },
    ];
    this.chartOptions.height = this.Height;
    this.xAxisOptions = {
      categories: this.xValues,
    };
  }

  updateChartOptions(): void {
    if (this.chartTitleOptions && this.chartTitleOptions.style) {
      this.chartTitleOptions.style.color = this.isDarkTheme ? '#ff8000' : '#044492';
    }
    if(this.theme){
      this.theme = {
        ...this.theme,
        mode: this.isDarkTheme ? 'dark' : 'light',
      };
    }
  }

}


// import { Component, Input, OnInit } from '@angular/core';
// import {
//   ApexAxisChartSeries,
//   ApexChart,
//   ApexTitleSubtitle,
//   ApexXAxis,
// } from 'ng-apexcharts';

// @Component({
//   selector: 'app-line-chart',
//   templateUrl: './line-chart.component.html',
//   styleUrls: ['./line-chart.component.css'],
// })
// export class LineChartComponent implements OnInit {
//   @Input() title!: string;
//   @Input() xValues!: any[];
//   @Input() yValues!: number[];

//   public chartSeries: ApexAxisChartSeries;
//   public chartOptions: ApexChart;
//   public chartTitleOptions: ApexTitleSubtitle;
//   public xAxisOptions: ApexXAxis;

//   constructor() {
//     this.chartSeries = [
//       {
//         name: this.title,
//         data: this.yValues,
//       },
//     ];

//     this.chartOptions = {
//       type: 'line',
//       height: 350,
//     };

//     this.chartTitleOptions = {
//       text: this.title,
//       align: 'left',
//     };

//     this.xAxisOptions = {
//       categories: this.xValues,
//     };
//   }

//   ngOnInit(): void {
//     this.chartSeries = [
//       {
//         name: this.title,
//         data: this.yValues,
//       },
//     ];

//     this.xAxisOptions = {
//       categories: this.xValues,
//     };
//   }
// }