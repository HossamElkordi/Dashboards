// pie-chart.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { ChartSeriesEventArgs } from 'igniteui-angular-charts';
import { ChartType } from 'ng-apexcharts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements OnInit {
  @Input() title: string = '';
  @Input() series: number[] = [];
  @Input() labels: string[] = [];
  @Input() set type(t: string) {
    this.chart.type = t as ChartType;
  }
  @Input() set width(w: number) {
    this.chart.width = w;
    this.chart.height = w;
  }
  // @Input() set colors(c: string[]) {
  //   this.chart.colors = c;
  // } 
  chart: {
    width: number;
    height: number;
    type: ChartType;
    toolbar: {
      show: boolean;
      tools: {
        download: boolean;
        selection: boolean;
        zoom: boolean;
        zoomin: boolean;
        zoomout: boolean;
        pan: boolean;
        reset: boolean;
      };
    };
  } = {
    width: 300,
    height: 300,
    type: 'pie' as ChartType,
    toolbar: {
      show: true,
      tools: {
        download: false,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false,
      },
    },
  };

  colors: string[] = ['#044492', '#3A7AC1', '#5F9FB2', '#92BBE1', '#B0D5C0', '#D0EBC5', '#1FED93'];

  ngOnInit(): void {  }
}
