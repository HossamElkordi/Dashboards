import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AssetServiceService } from 'src/app/services/asset-service.service';
import { tile, Column, car_data_table_row, car_field_values_response, get_id_car_info_response } from 'src/app/interfaces/types';
import { MatTableDataSource } from '@angular/material/table';
import { num_slicer_init, DropdownOption } from 'src/app/interfaces/types';
import { DateSlicerComponent } from 'src/app/components/date-slicer/date-slicer.component';
import { AreaChartComponent } from 'src/app/components/area-chart/area-chart.component';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-car-asset',
  templateUrl: './car-asset.component.html',
  styleUrls: ['./car-asset.component.css'],
  animations: [
    trigger('rightSlideInOut', [
      state('in', style({
        transform: 'translateX(0)',
        opacity: 1,
        visibility: 'visible'
      })),
      state('out', style({
        transform: 'translateX(100%)',
        opacity: 0,
        visibility: 'hidden'
      })),
      transition('in => out', animate('300ms ease-out')),
      transition('out => in', animate('300ms ease-in'))
    ]),
    trigger('overlay', [
      state('in', style({
        opacity: 1,
      })),
      state('out', style({
        opacity: 0,
        zIndex: -1
      })),
      transition('in => out', animate('300ms ease-out')),
      transition('out => in', animate('300ms ease-in')),
    ]),
  ]
})
export class CarAssetComponent {
  @ViewChild('date_slicer') date_slicer!: DateSlicerComponent;
  @ViewChild('area_chart') area_chart!: AreaChartComponent;
  @ViewChild('asset_area_chart') asset_area_chart!: AreaChartComponent;

  constructor(private http: AssetServiceService) { }

  tiles: tile[] = [
    { cols: 2, rows: 6, color: '#FFFFFF' },
    { cols: 2, rows: 3, color: '#FFFFFF' },
    { cols: 1, rows: 2, color: '#FFFFFF' },
    { cols: 1, rows: 1, color: '#FFFFFF' },
    { cols: 3, rows: 3, color: '#FFFFFF' },
  ];

  required_car_columns: string[] = ['model', 'transmission', 'fuelType', 'engineSize', 'mpg'];
  table_data!: MatTableDataSource<car_data_table_row>;
  table_cols_names: Column[] = [
    { name: 'ID', value: 'Unit_Id', type: 'text' },
    { name: 'Model', value: 'model', type: 'text' },
    { name: 'Transmission', value: 'transmission', type: 'text' },
    { name: 'Fuel Type', value: 'fuelType', type: 'text' },
    { name: 'Engine Size', value: 'engineSize', type: 'text' },
    { name: 'Miles per Galon', value: 'mpg', type: 'text' },
  ];

  dataset_name: string = 'ford_panel';

  age_minValue!: number;
  age_maxValue!: number;
  mpg_minValue!: number;
  mpg_maxValue!: number;
  mileage_minValue!: number;
  mileage_maxValue!: number;
  num_slicers!: num_slicer_init[];
  slicers_ready: boolean = false;
  predict_age_minValue!: number;
  predict_age_maxValue!: number;
  predict_mpg_minValue!: number;
  predict_mpg_maxValue!: number;
  predict_mileage_minValue!: number;
  predict_mileage_maxValue!: number;
  predict_num_slicers!: num_slicer_init[];

  model_items!: DropdownOption[];
  selectedItem_model!: string[];
  transmission_items!: DropdownOption[];
  selectedItem_transmission!: string[];
  fuel_items!: DropdownOption[];
  selectedItem_fuel!: string[];
  engine_items!: DropdownOption[];
  selectedItem_engine!: string[];

  min_date!: Date;
  max_date!: Date;
  cur_min_date!: Date;
  cur_max_date!: Date;

  gauge_value!: number;
  min_gauge_value: number = 0;
  max_gauge_value: number = 100000;
  predict_gauge_value: number = 0;

  is_predict: boolean = false;
  predict_selectedItem_model!: string[];
  predict_selectedItem_transmission!: string[];
  predict_selectedItem_fuel!: string[];
  predict_selectedItem_engine!: string[];

  is_asset_visible:boolean = false;
  car_data: car_data_table_row = {
    Unit_Id: 0,
    model: '',
    transmission: '',
    fuelType: '',
    engineSize: 0,
    mpg: 0,
    tax: 0,
    age: 0,
    mileage: 0
  }
  car_information: any[] = [];
  
  view_asset(selected: any){
    let selectedId = selected.Unit_Id;
    this.car_information = [];
    this.http.get_id_car_info(this.dataset_name, selectedId).subscribe(res => {
      this.car_data = res.info;
      this.car_information.push({name: 'Asset ID', value: this.car_data.Unit_Id.toLocaleString()});
      this.car_information.push({name: 'Make', value: "Ford"});
      this.car_information.push({name: 'Model', value: this.car_data.model});
      this.car_information.push({name: 'Average Mileage Per Year', value: (this.car_data.mileage/this.car_data.age).toLocaleString()});
      this.car_information.push({name: 'Mileage', value: this.car_data.mileage.toLocaleString()});
      this.car_information.push({name: 'Tax', value: this.car_data.tax.toLocaleString()});
      this.car_information.push({name: 'MPG', value: this.car_data.mpg.toLocaleString()});
      this.car_information.push({name: 'Engine Size', value: this.car_data.engineSize});
      this.car_information.push({name: 'Fuel Type', value: this.car_data.fuelType});
      let yaxis = [{ 'name': 'Price', 'data': res.predictions.PredictedPrice }]
      this.asset_area_chart.setChartSeries(res.predictions.date, yaxis, '', '')
      this.toggle_asset_div();
    })
  }

  toggle_asset_div(){
    this.is_asset_visible = !this.is_asset_visible;
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  ngOnInit(): void {

    // Get table data
    this.http.get_car_data_table(this.dataset_name, { "cols": this.required_car_columns }).subscribe(res => {
      this.table_data = new MatTableDataSource(res);
    })

    let num_body = {
      'age': ["min", "max"],
      'mpg': ["min", "max"],
      'mileage': ["min", "max"],
      'PredictedPrice': ["min", "max"],
      'date': ["min", "max"],
      "model": ["unique"],
      "transmission": ["unique"],
      "fuelType": ["unique"],
      "engineSize": ["unique"]
    }
    this.http.get_car_field_values(this.dataset_name, num_body).subscribe(res => {
      this.min_gauge_value = res.PredictedPrice[0];
      this.max_gauge_value = res.PredictedPrice[1];

      this.age_minValue = this.predict_age_minValue = res.age[0];
      this.age_maxValue = this.predict_age_maxValue = res.age[1];
      this.mpg_minValue = this.predict_mpg_minValue = res.mpg[0];
      this.mpg_maxValue = this.predict_mpg_maxValue = res.mpg[1];
      this.mileage_minValue = this.predict_mileage_minValue = res.mileage[0];
      this.mileage_maxValue = this.predict_mileage_maxValue = res.mileage[1];
      this.num_slicers = [{
        "title": "Age",
        "step": 1,
        "min_val": this.age_minValue,
        "max_val": this.age_maxValue,
        "cur_min": this.age_minValue,
        "cur_max": this.age_maxValue,
      },
      {
        "title": "Miles per Galon",
        "step": 1,
        "min_val": this.mpg_minValue,
        "max_val": this.mpg_maxValue,
        "cur_min": this.mpg_minValue,
        "cur_max": this.mpg_maxValue,
      },
      {
        "title": "Mileage",
        "step": 10,
        "min_val": this.mileage_minValue,
        "max_val": this.mileage_maxValue,
        "cur_min": this.mileage_minValue,
        "cur_max": this.mileage_maxValue,
      }]
      this.predict_num_slicers = [{
        "title": "Age",
        "step": 1,
        "min_val": this.age_minValue,
        "max_val": this.age_maxValue,
        "cur_min": this.age_minValue,
        "cur_max": this.age_maxValue,
      },
      {
        "title": "Miles per Galon",
        "step": 1,
        "min_val": this.mpg_minValue,
        "max_val": this.mpg_maxValue,
        "cur_min": this.mpg_minValue,
        "cur_max": this.mpg_maxValue,
      },
      {
        "title": "Mileage",
        "step": 10,
        "min_val": this.mileage_minValue,
        "max_val": this.mileage_maxValue,
        "cur_min": this.mileage_minValue,
        "cur_max": this.mileage_maxValue,
      }]
      this.slicers_ready = true;

      this.model_items = res.model.map((item: string) => { return { label: item, value: item } })
      this.transmission_items = res.transmission.map((item: string) => { return { label: item, value: item } })
      this.fuel_items = res.fuelType.map((item: string) => { return { label: item, value: item } })
      this.engine_items = res.engineSize.map((item: number) => { return { label: item, value: item } })
      this.selectedItem_model = this.model_items.map((item: DropdownOption) => { return item.value })
      this.selectedItem_transmission = this.transmission_items.map((item: DropdownOption) => { return item.value })
      this.selectedItem_fuel = this.fuel_items.map((item: DropdownOption) => { return item.value })
      this.predict_selectedItem_engine = this.engine_items[0].value;
      this.predict_selectedItem_fuel = this.fuel_items[0].value;
      this.predict_selectedItem_model = this.model_items[0].value;
      this.predict_selectedItem_transmission = this.transmission_items[0].value;

      this.min_date = new Date(res.date[0]);
      this.max_date = new Date(res.date[1]);
      this.cur_min_date = this.min_date;
      this.cur_max_date = this.max_date;
      this.date_slicer.min_val = this.min_date;
      this.date_slicer.max_val = this.max_date;
      this.date_slicer.cur_min = this.min_date;
      this.date_slicer.cur_max = this.max_date;

      this.get_charts_values();
    });
  }

  ngAfterViewInit(): void {
    this.area_chart.chart_options.chart.height = 270;
    this.area_chart.chart_options.chart.width = 540;
    this.asset_area_chart.chart_options.chart.height = 240;
    this.asset_area_chart.chart_options.chart.width = 800;
  }


  filter_model(selected: any) {
    if (!this.is_predict) {
      this.selectedItem_model = selected;
      this.get_charts_values();
    }
    else {
      this.predict_selectedItem_model = selected;
      this.get_predict_values();
    }
  }

  filter_transmission(selected: any) {
    if (!this.is_predict) {
      this.selectedItem_transmission = selected;
      this.get_charts_values();
    }
    else {
      this.predict_selectedItem_transmission = selected;
      this.get_predict_values();
    }
  }

  filter_fuel(selected: any) {
    if (!this.is_predict) {
      this.selectedItem_fuel = selected;
      this.get_charts_values();
    }
    else {
      this.predict_selectedItem_fuel = selected;
      this.get_predict_values();
    }
  }

  filter_engine(selected: any) {
    if (!this.is_predict) {
      this.selectedItem_engine = selected;
      this.get_charts_values();
    }
    else {
      this.predict_selectedItem_engine = selected;
      this.get_predict_values();
    }
  }

  filter_num_slicers(selected: any) {
    if(!this.is_predict){
      this.age_minValue = selected[0].cur_min;
      this.age_maxValue = selected[0].cur_max;
      this.mpg_minValue = selected[1].cur_min;
      this.mpg_maxValue = selected[1].cur_max;
      this.mileage_minValue = selected[2].cur_min;
      this.mileage_maxValue = selected[2].cur_max;
      this.get_charts_values();
    }
    else{
      this.predict_age_minValue = selected[0].cur_min;
      this.predict_age_maxValue = selected[0].cur_max;
      this.predict_mpg_minValue = selected[1].cur_min;
      this.predict_mpg_maxValue = selected[1].cur_max;
      this.predict_mileage_minValue = selected[2].cur_min;
      this.predict_mileage_maxValue = selected[2].cur_max;
      this.get_predict_values();
    }
  }

  filter_date(selected: any) {
    this.cur_min_date = new Date(selected[0]);
    this.cur_max_date = new Date(selected[1]);
    this.get_charts_values();
  }

  get_charts_values() {
    const body = {
      'num_filters': { "age": [this.age_minValue, this.age_maxValue], "mileage": [this.mileage_minValue, this.mileage_maxValue], "mpg": [this.mpg_minValue, this.mpg_maxValue] },
      'date_filters': { "date": [this.cur_min_date.toLocaleDateString(), this.cur_max_date.toLocaleDateString()] },
      'cat_filters': { "model": this.selectedItem_model, "transmission": this.selectedItem_transmission, "fuelType": this.selectedItem_fuel, "engineSize": this.selectedItem_engine }
    };

    this.http.get_predicted_price(this.dataset_name, body).subscribe(res => {
      this.gauge_value = +(res.toPrecision(5))
    })

    this.http.get_predicted_price_over_time(this.dataset_name, body).subscribe(res => {
      let yaxis = [{ 'name': 'Price', 'data': res.PredictedPrice }]
      this.area_chart.setChartSeries(res.date, yaxis, '', '')
    })
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------->

  predict(){
    if(this.is_predict)
      this.get_predict_values();
    else
      this.get_charts_values();
  }

  get_predict_values() {
    const predict_body = {
      "model": this.predict_selectedItem_model,
      "transmission": this.predict_selectedItem_transmission,
      "fuelType": this.predict_selectedItem_fuel,
      "tax": 150,
      "mpg": this.predict_mpg_minValue,
      "age": this.predict_age_minValue,
      "mileage": this.predict_mileage_minValue,
      "engineSize": this.predict_selectedItem_engine

    };

    this.http.predict(this.dataset_name, predict_body).subscribe(res => {
      var keyName = Object.keys(res[0]["Request_1"])[0];
      this.predict_gauge_value = res[0]["Request_1"][keyName].toPrecision(4) as unknown as number;

    })
  }

}
