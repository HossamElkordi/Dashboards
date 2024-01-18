import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AssetServiceService } from 'src/app/services/asset-service.service';
import { tile, Column, house_data_table_row, house_field_values_response, get_id_house_info_response } from 'src/app/interfaces/types';
import { MatTableDataSource } from '@angular/material/table';
import { num_slicer_init, DropdownOption } from 'src/app/interfaces/types';
import { DateSlicerComponent } from 'src/app/components/date-slicer/date-slicer.component';
import { AreaChartComponent } from 'src/app/components/area-chart/area-chart.component';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-house-asset',
  templateUrl: './house-asset.component.html',
  styleUrls: ['./house-asset.component.css'],
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
export class HouseAssetComponent {
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

  required_house_columns: string[] = ['City', 'Type', 'Area', 'Bedrooms', 'Bathrooms'];
  table_data!: MatTableDataSource<house_data_table_row>;
  table_cols_names: Column[] = [
    { name: 'ID', value: 'Unit_Id', type: 'text' },
    { name: 'City', value: 'City', type: 'text' },
    { name: 'Type', value: 'Type', type: 'text' },
    { name: 'Area', value: 'Area', type: 'text' },
    { name: 'Bedrooms', value: 'Bedrooms', type: 'text' },
    { name: 'Bathrooms', value: 'Bathrooms', type: 'text' },
  ];

  dataset_name: string = 'syn_houses';

  area_minValue!: number;
  area_maxValue!: number;
  num_slicers!: num_slicer_init[];
  predict_area_minValue!: number;
  predict_area_maxValue!: number;
  predict_num_slicers!: num_slicer_init[];
  slicers_ready: boolean = false;

  type_items!: DropdownOption[];
  selectedItem_type!: string[];
  city_items!: DropdownOption[];
  selectedItem_city!: string[];
  bedrooms_items!: DropdownOption[];
  selectedItem_bedrooms!: string[];
  bathrooms_items!: DropdownOption[];
  selectedItem_bathrooms!: string[];
  private_garden_items!: DropdownOption[];
  selectedItem_private_garden!: string[];
  parking_items!: DropdownOption[];
  selectedItem_parking!: string[];
  security_items!: DropdownOption[];
  selectedItem_security!: string[];

  min_date!: Date;
  max_date!: Date;
  cur_min_date!: Date;
  cur_max_date!: Date;

  gauge_value!: number;
  min_gauge_value: number = 0;
  max_gauge_value: number = 100000;
  predict_gauge_value: number = 0;

  predict_selectedItem_type!: string[];
  predict_selectedItem_city!: string[];
  predict_selectedItem_bedrooms!: string[];
  predict_selectedItem_bathrooms!: string[];
  predict_selectedItem_private_garden!: string[];
  predict_selectedItem_parking!: string[];
  predict_selectedItem_security!: string[];
  is_predict: boolean = false;


  house_data: house_data_table_row = {
    Unit_Id: 0,
    City: '',
    Type: '',
    Area: 0,
    Bedrooms: 0,
    Bathrooms: 0,
    Security: 0,
    Parking: 0,
    Private_Garden: 0,
    Prox_Hospital: 0,
    Prox_School: 0,
    Prox_Main_Street: 0
  }
  house_information: any[] = [];
  is_asset_visible: boolean = false;

  view_asset(selected: any){
    let selectedId = selected.Unit_Id;
    this.house_information = [];
    this.http.get_id_house_info(this.dataset_name, selectedId).subscribe(res => {
      this.house_data = res.info;

      this.house_information.push({name: 'Asset ID', value: this.house_data.Unit_Id.toLocaleString()});
      this.house_information.push({name: 'Type', value: this.house_data.Type});
      this.house_information.push({name: 'City', value: this.house_data.City});
      this.house_information.push({name: 'Area', value: (this.house_data.Area + "m\u00B2").toLocaleString()});
      this.house_information.push({name: 'Bedrooms', value: this.house_data.Bedrooms.toLocaleString()});
      this.house_information.push({name: 'Bathrooms', value: this.house_data.Bathrooms.toLocaleString()});
      this.house_information.push({name: 'Security', value: this.house_data.Security ? "Available" : "Not Available"});
      this.house_information.push({name: 'Parking', value: this.house_data.Parking ? "Available" : "Not Available"});
      this.house_information.push({name: 'Private Garden', value: this.house_data.Private_Garden ? "Available" : "Not Available"});
      this.house_information.push({name: 'Hospital Proximity', value: this.house_data.Prox_Hospital ? "Near" : "Far"});
      this.house_information.push({name: 'School Proximity', value: this.house_data.Prox_School ? "Near" : "Far"});
      this.house_information.push({name: 'Main Street Proximity', value: this.house_data.Prox_Main_Street ? "Near" : "Far"});

      let yaxis = [{ 'name': 'Price', 'data': res.predictions.PredictedPrice }]
      this.asset_area_chart.setChartSeries(res.predictions.date, yaxis, '', '')
      this.toggle_asset_div();
    })
  }

  toggle_asset_div() {
    this.is_asset_visible = !this.is_asset_visible;
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
  ngOnInit(): void {

    // Get table data
    this.http.get_house_data_table(this.dataset_name, { "cols": this.required_house_columns }).subscribe(res => {
      this.table_data = new MatTableDataSource(res);
    })

    let body = {
      'Area': ["min", "max"],
      "City": ["unique"],
      "Type": ["unique"],
      "Bedrooms": ["unique"],
      "Bathrooms": ["unique"],
      "Private Garden": ["unique"],
      "Security": ["unique"],
      "Parking": ["unique"],
      "PredictedPrice": ["min", "max"],
      'date': ["min", "max"],
    }
    this.http.get_house_field_values(this.dataset_name, body).subscribe(res => {
      this.min_gauge_value = res.PredictedPrice[0] / 1e6;
      this.max_gauge_value = res.PredictedPrice[1] / 1e6;
      this.area_minValue = this.predict_area_minValue = res.Area[0];
      this.area_maxValue = this.predict_area_maxValue = res.Area[1];
      this.num_slicers = [{
        "title": "Area",
        "step": 1,
        "min_val": this.area_minValue,
        "max_val": this.area_maxValue,
        "cur_min": this.area_minValue,
        "cur_max": this.area_maxValue,
      }]

      this.predict_num_slicers = [{
        "title": "Area",
        "step": 1,
        "min_val": this.area_minValue,
        "max_val": this.area_maxValue,
        "cur_min": this.area_minValue,
        "cur_max": this.area_maxValue,
      }]
      this.slicers_ready = true;

      this.type_items = res.Type.map((item: string) => { return { label: item, value: item } })
      this.selectedItem_type = this.type_items.map((item: DropdownOption) => { return item.value })
      this.city_items = res.City.map((item: string) => { return { label: item, value: item } })
      this.selectedItem_city = this.city_items.map((item: DropdownOption) => { return item.value })
      this.bedrooms_items = res.Bedrooms.map((item: number) => { return { label: item, value: item } })
      this.selectedItem_bedrooms = this.bedrooms_items.map((item: DropdownOption) => { return item.value })
      this.bathrooms_items = res.Bathrooms.map((item: number) => { return { label: item, value: item } })
      this.selectedItem_bathrooms = this.bathrooms_items.map((item: DropdownOption) => { return item.value })
      this.private_garden_items = res.Private_Garden.map((item: number) => { return { label: item, value: item } })
      this.selectedItem_private_garden = this.private_garden_items.map((item: DropdownOption) => { return item.value })
      this.parking_items = res.Parking.map((item: number) => { return { label: item, value: item } })
      this.selectedItem_parking = this.parking_items.map((item: DropdownOption) => { return item.value })
      this.security_items = res.Security.map((item: number) => { return { label: item, value: item } })
      this.selectedItem_security = this.security_items.map((item: DropdownOption) => { return item.value })
      this.predict_selectedItem_type = this.type_items[0].value;
      this.predict_selectedItem_city = this.city_items[0].value;
      this.predict_selectedItem_bedrooms = this.bedrooms_items[0].value;
      this.predict_selectedItem_bathrooms = this.bathrooms_items[0].value;
      this.predict_selectedItem_private_garden = this.private_garden_items[0].value;
      this.predict_selectedItem_parking = this.parking_items[0].value;
      this.predict_selectedItem_security = this.security_items[0].value;


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


  filter_type(selected: any) {
    if (!this.is_predict) {
      this.selectedItem_type = selected;
      this.get_charts_values();
    }
    else {
      this.predict_selectedItem_type = selected;
      this.get_predict_values();
    }
  }

  filter_city(selected: any) {
    if (!this.is_predict) {
      this.selectedItem_city = selected;
      this.get_charts_values();
    }
    else {
      this.predict_selectedItem_city = selected;
      this.get_predict_values();
    }
  }

  filter_bedrooms(selected: any) {
    if (!this.is_predict) {
      this.selectedItem_bedrooms = selected;
      this.get_charts_values();
    }
    else {
      this.predict_selectedItem_bedrooms = selected;
      this.get_predict_values();
    }
  }

  filter_bathrooms(selected: any) {
    if (!this.is_predict) {
      this.selectedItem_bathrooms = selected;
      this.get_charts_values();
    }
    else {
      this.predict_selectedItem_bathrooms = selected;
      this.get_predict_values();
    }
  }

  filter_private_garden(selected: any) {
    if (!this.is_predict) {
      this.selectedItem_private_garden = selected;
      this.get_charts_values();
    }
    else {
      this.predict_selectedItem_private_garden = selected;
      this.get_predict_values();
    }
  }

  filter_parking(selected: any) {
    if (!this.is_predict) {
      this.selectedItem_parking = selected;
      this.get_charts_values();
    }
    else {
      this.predict_selectedItem_parking = selected;
      this.get_predict_values();
    }
  }

  filter_security(selected: any) {
    if (!this.is_predict) {
      this.selectedItem_security = selected;
      this.get_charts_values();
    }
    else {
      this.predict_selectedItem_security = selected;
      this.get_predict_values();
    }
  }

  filter_num_slicers(selected: any) {
    if (!this.is_predict) {
      this.area_minValue = selected[0].cur_min;
      this.area_maxValue = selected[0].cur_max;
      this.get_charts_values();
    }
    else {
      this.predict_area_minValue = selected[0].cur_min;
      this.predict_area_maxValue = selected[0].cur_max;
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
      'num_filters': { "Area": [this.area_minValue, this.area_maxValue] },
      'date_filters': { "date": [this.cur_min_date.toLocaleDateString(), this.cur_max_date.toLocaleDateString()] },
      'cat_filters': {
        "City": this.selectedItem_city, "Type": this.selectedItem_type, "Bedrooms": this.selectedItem_bedrooms, "Bathrooms": this.selectedItem_bathrooms,
        "Security": this.selectedItem_security, "Parking": this.selectedItem_parking, "Private Garden": this.selectedItem_private_garden,
      }
    };

    this.http.get_predicted_price(this.dataset_name, body).subscribe(res => {
      this.gauge_value = +((res / 1e6).toPrecision(2))
    })

    this.http.get_predicted_price_over_time(this.dataset_name, body).subscribe(res => {
      let yaxis = [{ 'name': 'Price', 'data': res.PredictedPrice }]
      this.area_chart.setChartSeries(res.date, yaxis, '', '')
    })
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------->

  predict() {
    if (this.is_predict)
      this.get_predict_values();
    else
      this.get_charts_values();
  }

  get_predict_values() {
    const predict_body = {
      "City": this.predict_selectedItem_city,
      "Type": this.predict_selectedItem_type,
      "Area": this.predict_area_minValue,
      "Security": this.predict_selectedItem_security,
      "Parking": this.predict_selectedItem_parking,
      "Private_Garden": this.predict_selectedItem_private_garden,
      "Bedrooms": this.predict_selectedItem_bedrooms,
      "Bathrooms": this.predict_selectedItem_bathrooms,
      "Prox_School": 1,
      "Prox_Hospital": 1,
      "Prox_Main_Street": 1
    };
    console.log(predict_body)
    this.http.predict(this.dataset_name, predict_body).subscribe(res => {
      console.log(res)
      var keyName = Object.keys(res[0]["Request_1"])[0];
      this.predict_gauge_value = res[0]["Request_1"][keyName].toPrecision(2) / 1e6  as unknown as number;
    })

  }
}
