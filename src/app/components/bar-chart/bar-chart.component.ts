import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexLegend,
  ApexYAxis,
  ApexTheme
} from 'ng-apexcharts';
import { DarkThemeService } from 'src/app/dark-theme.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
})
export class BarChartComponent {

  isDarkTheme = false;

  constructor(private darkThemeService: DarkThemeService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.darkThemeService.isDarkTheme$.subscribe((isDark) => {
      this.isDarkTheme = isDark;
      this.updateChartOptions();
      this.cdr.detectChanges();
    });
  }

  updateChartOptions(): void {
    if (this.title && this.title.style) {
      this.title.style.color = this.isDarkTheme ? '#ff8000' : '#044492';
    }
    if(this.theme){
      this.theme = {
        ...this.theme,
        mode: this.isDarkTheme ? 'dark' : 'light',
      };
    }
  }

  @Input() chartLabels: string[] = [''];
  @Input() chartSeries: ApexAxisChartSeries = [{ name: '', data: [0] }];

  @Input() set chartTitle(value: string) {
    this.title.text = value;
  }

  @Input() set chartWidth(value: number | string) {
    this.options.width = value;
  }
  @Input() set chartHeight(value: number | string) {
    this.options.height = value;
  }

  @Input() set yAxisLabel(value: string) {
    if (this.yaxis) {
      this.yaxis.title = this.yaxis.title || {};
      this.yaxis.title.text = value;
    }
  }

  @Input() xaxis!: ApexXAxis;


  colors: string[] = ['#92BBE1'];

  theme: ApexTheme = {
    mode: 'light',
  };

  options: ApexChart = {
    width: 370,
    height: 280,
    type: 'bar',
    toolbar: {
      show: false,
    },
    
  };

  title: ApexTitleSubtitle = {
    text: this.chartTitle,
    align: 'center',
    style: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#000000',
    },
  };

  dataLabels: ApexDataLabels = {
    enabled: true,
    textAnchor: 'start',
    formatter: function (value, { seriesIndex, dataPointIndex, w }) {
      return '';
    },
  };

  chartlegend: ApexLegend = {
    show: true,
  };

  yaxis: ApexYAxis = {
    labels: {
      formatter: function (val) {
        if(val == undefined)
          return ""
        return  Number(val.toFixed(3)).toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 3,
        });
      },
    },
    title: {
      text: '',
    }
  };

}
