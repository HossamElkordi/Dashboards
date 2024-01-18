import { Component, EventEmitter, Output } from '@angular/core';
import { ApexAxisChartSeries, ChartType } from 'ng-apexcharts';
import { area_chart_options } from 'src/app/interfaces/types';

@Component({
  selector: 'app-area-chart',
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.css']
})
export class AreaChartComponent {
  @Output() zoom: EventEmitter<string[]> = new EventEmitter<string[]>();
  chart_options: area_chart_options = {
    series: [{name: "Line Chart", data: [null], color:'#0744A2'}],
    
    chart: {
      type: "area",
      height: 300, 
      zoom: {
        enabled: true,
        type: 'x',  
        autoScaleYaxis: false,  
        zoomedArea: {
          fill: { color: '#92BBE1', opacity: 0.4 },
          stroke: { color: '#044492', opacity: 0.4, width: 1 }
        }
      },
      events: {
        beforeZoom : (e, {xaxis}) => {
          let dmin = new Date(xaxis.min)
          let dmax = new Date(xaxis.max)
          this.zoom.emit([
            `${dmin.toLocaleString("default", { year: "numeric" })}-${dmin.toLocaleString("default", { month: "2-digit"})}-${dmin.toLocaleString("default", { day: "2-digit" })}`,
            `${dmax.toLocaleString("default", { year: "numeric" })}-${dmax.toLocaleString("default", { month: "2-digit"})}-${dmax.toLocaleString("default", { day: "2-digit" })}`,
          ])
        }
      }
    },

    dataLabels: {enabled: false},

    stroke: {curve: "smooth"},

    title: {text: "", align: "left", style:{'color': '#044492', 'fontWeight': 'bold'}},

    subtitle: {},
    
    labels: [],
    
    xaxis: {type: "datetime", labels: {style:{colors: '#044492'}}},
    
    yaxis: {opposite: false, labels: {
      "formatter": function (val) { return Number(val.toFixed(0)).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 3}) },
      "style": {'colors': '#044492'}}},

    legend: {horizontalAlign: "left"},
    
    annotations: {},
    
    tooltip: {enabled: true},
    
    markers: {size: 0}
  }

  setChartAnnotation(start: string, end:string, lbl: string){
    this.chart_options.annotations.xaxis = [
      {
        x: new Date(start).getTime(), 
        x2: new Date(end).getTime(), 
        fillColor: 'grey',
        borderColor: 'black', 
        borderWidth: 2,
        label: {orientation: 'horizontal', text: lbl, offsetX: 40}
      }
    ]
  }

  setChartSeries(xaxis: any, yaxis: ApexAxisChartSeries, title: string, yaxisTitle: string){
    // yaxis list of object of the format {name: "xxx", data: list_of_values, color:'#......'}
    this.chart_options.series = yaxis
    this.chart_options.labels = xaxis
    this.chart_options.title.text = title
    this.chart_options.yaxis.title = {"text": yaxisTitle, "style": {"color": '#044492'}}
  }

  setChartType(type: ChartType){
    this.chart_options.chart.type = type
  }

  setChartMarkers(markerSize: number){
    this.chart_options.markers.size = markerSize
  }

}
