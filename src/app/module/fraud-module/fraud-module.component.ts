import { Component, OnInit, ViewChild } from '@angular/core';
import { tile, DropdownOption } from 'src/app/interfaces/types';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { DateSlicerComponent } from 'src/app/components/date-slicer/date-slicer.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { Column, card_information, FraudTransTableRow, FraudTransTable } from 'src/app/interfaces/types';
import { FraudServiceService } from 'src/app/services/fraud-service.service';
import { TableComponent } from 'src/app/components/table/table.component';
import { SliderComponent } from 'src/app/components/slider/slider.component';
import { Observable, catchError, forkJoin, map, min, startWith, switchMap } from 'rxjs';
import { DarkThemeService } from '../../dark-theme.service';

@Component({
  selector: 'app-fraud-module',
  templateUrl: './fraud-module.component.html',
  styleUrls: ['./fraud-module.component.css'],
  // animations: [
  //   trigger('rightSlideInOut', [
  //     state('in', style({
  //       transform: 'translateX(0)',
  //       opacity: 1,
  //       visibility: 'visible'
  //     })),
  //     state('out', style({
  //       transform: 'translateX(100%)',
  //       opacity: 0,
  //       visibility: 'hidden'
  //     })),
  //     transition('in => out', animate('300ms ease-out')),
  //     transition('out => in', animate('300ms ease-in'))
  //   ]),
  //   trigger('overlay', [
  //     state('in', style({
  //       opacity: 1,
  //     })),
  //     state('out', style({
  //       opacity: 0,
  //       zIndex: -1
  //     })),
  //     transition('in => out', animate('300ms ease-out')),
  //     transition('out => in', animate('300ms ease-in')),
  //   ]),
  // ]
})
export class FraudModuleComponent implements OnInit {
  @ViewChild('trans_date_slicer') trans_date_slicer!: DateSlicerComponent;
  @ViewChild(TableComponent) table!: TableComponent;
  @ViewChild('low') low_risk_slider!: SliderComponent;
  @ViewChild('high') high_risk_slider!: SliderComponent;


  constructor(private http: FraudServiceService, private darkThemeService: DarkThemeService) { }
  shouldRender: boolean = false;
  isDarkTheme = false;
  
  chartWidth = window.innerWidth > 1200 ? 850 : window.innerWidth - 550;

  tiles: tile[] = [
    { cols: 2, rows: 5, color: '#FFFFFF' },
    { cols: 3, rows: 1, color: '#FFFFFF' },
    { cols: 1, rows: 1, color: '#FFFFFF' },
    { cols: 4, rows: 2, color: '#FFFFFF' },
    { cols: 4, rows: 2, color: '#FFFFFF' },
  ];


  // Transaction table and cards data
  columns: Column[] = [
    { name: 'User', value: 'User', type: 'text' },
    { name: 'Card', value: 'Card', type: 'text' },
    { name: 'Amount', value: 'Amount', type: 'text' },
    { name: 'Fraud Probability', value: 'FraudProbability', type: 'text' },
  ];
  transData!: FraudTransTableRow[];
  transTable!: MatTableDataSource<FraudTransTableRow>;
  selectedTrans: FraudTransTableRow | null = null;
  user_info!: card_information[];
  card_info!: card_information[];
  trans_info!: card_information[];


  interpret_labels!: string[];
  interpret_values!: number[];
  cur_interpret_labels!: string[];
  bar_chart_series!: ApexAxisChartSeries;
  ready_shapl_bar_chart: boolean = false;
  
  high_risk_cnt: number = 0;
  low_risk_cnt: number = 0;
  high_risk_cur!: number;
  low_risk_cur!: number;
  allStates!: string[];
  initDates!: string[];
 

  // Dropdown and date filters
  merchant_place!: DropdownOption[];
  selected_merchant_place!: string[];
  from_date!: Date;
  to_date!: Date;
  trans_from_date!: Date;
  trans_to_date!: Date;

  // Main screen charts
  bar1_chart_data: ApexAxisChartSeries = [{ name: 'Total', data: [] }];
  bar2_chart_data: ApexAxisChartSeries = [{ name: 'Non-Fraud', data: [] }, { name: 'Fraud', data: [], color: '#FF0000'}];
  bar1_labels: string[] = [""];
  bar2_labels: string[] = [""];

  // Cards tab charts
  cards_bar1_chart_data: ApexAxisChartSeries = [{ name: 'Non-Fraud', data: [] }, { name: 'Fraud', data: [], color: '#FF0000' }];
  cards_bar2_chart_data: ApexAxisChartSeries = [{ name: 'Non-Fraud', data: [] }, { name: 'Fraud', data: [], color: '#FF0000' }];
  fraud_rate_in_time: number[] = []
  cards_bar1_labels: string[] = [""];
  cards_bar2_labels: string[] = [""];
  fraud_rate_in_time_labels: string[] = [""];
  ready_cards_bar1_chart: boolean = false;
  ready_cards_bar2_chart: boolean = false;
  ready_cards_line_chart: boolean = false;

  // Model metrics tab charts
  model_feature_importance: ApexAxisChartSeries = [{ name: 'Importance', data: [] }];
  model_feature_importance_labels!: string[];
  ready_model_chart: boolean = false;

  // Model metrics tab cards
  model_metrics: any[] = [];
  model_confusion_matrix: any[] = [];

  // Side tabs toggles
  activate_drawer: boolean = false;
  is_model_div_visible: boolean = false
  is_cards_div_visible: boolean = false;
  is_trans_div_visible: boolean = false;

  gauge_value: number = 0;

  ngOnInit() {
    this.darkThemeService.isDarkTheme$.subscribe((isDark) => {
      this.isDarkTheme = isDark;
      this.shouldRender = false;
      setTimeout(() => this.shouldRender = true, 0);
    });


    // <-------------------------------------------------------------Date and dropdown filter values------------------------------------------------------------->
    this.http.get_filter_values().subscribe((result) => {

      this.getTransTable();

      this.selected_merchant_place = [];
      this.merchant_place = [];
      for (let i = 0; i < result['Merchant State'].length; i++) {
        this.merchant_place.push({ label: result['Merchant State'][i], value: result['Merchant State'][i] });
        this.selected_merchant_place.push(result['Merchant State'][i]);
      }

      this.trans_date_slicer.min_val = new Date(result['Datetime'][0]);
      this.trans_date_slicer.max_val = new Date(result['Datetime'][1]);
      this.from_date = new Date(result['Datetime'][0]);
      this.to_date = new Date(result['Datetime'][1]);

      this.trans_from_date = new Date(result['Datetime'][0]);
      this.trans_to_date = new Date(result['Datetime'][1]);

      this.trans_from_date.setFullYear(this.trans_to_date.getFullYear() - 1);

      this.trans_date_slicer.cur_min = this.trans_from_date;
      this.trans_date_slicer.cur_max = this.trans_to_date;

      // this.cards_from_date = this.trans_from_date;
      // this.cards_to_date = this.trans_to_date;
      this.get_trans_chart_data();
      this.get_cards_chart_data();
    });

    // <-------------------------------------------------------------Model Metrics Tab------------------------------------------------------------->
    this.http.get_model_metrics().subscribe((result) => {
      this.model_metrics.push({ name: 'Precision', value: (result['precision'].toFixed(4) * 100).toLocaleString() + "%" });
      this.model_metrics.push({ name: 'Recall', value: (result['recall'].toFixed(4) * 100).toLocaleString() + "%" });
      this.model_metrics.push({ name: 'F1 Score', value: (result['f1-score'].toFixed(4) * 100).toLocaleString() + "%" });
      this.model_metrics.push({ name: 'AUC', value: (result['auc'].toFixed(4) * 100).toLocaleString() + "%" });
    });

    this.http.get_confusion_matrix().subscribe((result) => {
      this.model_confusion_matrix.push({ name: 'True Positive', value: result['tp'].toLocaleString() });
      this.model_confusion_matrix.push({ name: 'True Negative', value: result['tn'].toLocaleString() });
      this.model_confusion_matrix.push({ name: 'False Positive', value: result['fp'].toLocaleString() });
      this.model_confusion_matrix.push({ name: 'False Negative', value: result['fn'].toLocaleString() });
    });

    this.http.get_model_feature_importance().subscribe((result) => {
      let filteredData: number[] = []
      let filteredLabels: string[] = []
      for (let i = 0; i < result.FeatureImportance.length; i++) {
        if (result.FeatureImportance[i] > 800) {
          filteredData.push(result.FeatureImportance[i]);
          filteredLabels.push(result.FeatureName[i]);
        }
      }
      this.model_feature_importance_labels = filteredLabels;
      this.model_feature_importance[0].data = filteredData;
      this.ready_model_chart = true;
    });
  }

  select_trans(e: FraudTransTableRow){
    this.gauge_value = e.FraudProbability;
    console.log("ehre")
  }

  getTransTable() {
    this.table.paginator.page.pipe(
      startWith({}),
      switchMap(() => {
        return this.http.get_table(
          this.table.paginator.pageIndex + 1,
          this.table.paginator.pageSize
        ).pipe(catchError(() => new Observable<FraudTransTable>()));
      }),
      map((res) => {
        if (res == null) return [];
          this.table.totalData = res.total
          setTimeout(()=>{this.table.paginator.length = res.total; this.table.pageIndex = res.page - 1}) 
        return res.data;
      })
    )
    .subscribe((trans_data) => {
      this.transData = trans_data;
      this.transData.forEach(element => {
        element.FraudProbability = element.FraudProbability.toExponential(2) as unknown as number
      });
      this.transTable = new MatTableDataSource(this.transData);
    });
  }


  // Transaction details tab
  viewTransDetails(trans: FraudTransTableRow){
    
    this.selectedTrans = trans

    this.http.get_user_info(this.selectedTrans.User.toFixed()).subscribe(res => {
      res = res[0]
      this.user_info = [
        {name: 'Age', value: res['Current Age']},
        {name: 'Retirement Age', value: res['Retirement Age']},
        {name: 'Gender', value: res['Gender']},
        {name: 'Annual Income', value: res['Yearly Income - Person']},
        {name: 'FICO Score', value: res['FICO Score']},
        {name: 'Total Debt', value: res['Total Debt']},
        {name: 'Credit Cards Count', value: res['Num Credit Cards']}
      ]

    })

    this.http.get_card_info(this.selectedTrans.User.toFixed(), this.selectedTrans.Card.toFixed()).subscribe(res => {
      res = res[0]
      this.card_info = [
        {name: 'Brand', value: res['Brand']},
        {name: 'Type', value: res['Type']},
        {name: 'Open Date', value: new Date(res['Acct Open Date']).toLocaleDateString()},
        {name: 'Expiry Date', value: new Date(res['Expires']).toLocaleDateString()},
        {name: 'Card Duration', value: res['Card Duration']},
        {name: 'Credit Limit', value: res['Credit Limit']}
      ]
    })

    this.http.get_trans_info(this.selectedTrans.trans_id.toFixed()).subscribe(res => {
      res = res[0]
      this.trans_info = [
        {name: 'Date', value: new Date(res['date']).toLocaleDateString()},
        {name: 'Amount', value: res['Amount']},
        {name: 'Merchant City', value: res['Merchant City']},
        {name: 'Merchant State', value: res['Merchant State']},
        {name: 'Category', value: res['MCC']},
      ]
    })

    this.http.get_interpretability(this.selectedTrans.trans_id.toFixed()).subscribe(res => {
      this.interpret_labels = res.map((e) => e.variable)
      this.interpret_values = res.map((e) => e.value)
      this.interpret_values.forEach(element => {
        if(element < 0) ++this.low_risk_cnt
        else ++this.high_risk_cnt
      });
      
      this.set_interpretability_chart(
        this.low_risk_cnt < 3 ? this.low_risk_cnt : 3,
        this.high_risk_cnt < 3 ? this.high_risk_cnt : 3
      )
      
    })

    this.toggle_trans_div();
  }

  set_interpretability_chart(low: number, high: number){
    this.low_risk_cur = low
    this.high_risk_cur = high

    this.cur_interpret_labels = this.interpret_labels.slice(0, this.low_risk_cur)
    this.cur_interpret_labels.push(...this.interpret_labels.slice(this.interpret_labels.length - this.high_risk_cur, this.interpret_labels.length))
    let vals: number[] = []
    vals = this.interpret_values.slice(0, this.low_risk_cur)
    vals.push(...this.interpret_values.slice(this.interpret_values.length - this.high_risk_cur, this.interpret_values.length))
    this.bar_chart_series = [{ name: 'Feature Interpretability', data: vals }]
    this.ready_shapl_bar_chart = true;
  }

  low_risk_cnt_change(e: number){
    this.set_interpretability_chart(e, this.high_risk_cur)
  }

  high_risk_cnt_change(e: number){
    this.set_interpretability_chart(this.low_risk_cur, e)
  }

  // Overall transactions data
  get_trans_chart_data() {
    const body = {
      'Merchant State': this.selected_merchant_place,
      Datetime: [
        this.trans_from_date.toLocaleDateString(),
        this.trans_to_date.toLocaleDateString()
      ]
    }
    this.http.get_amount_per_category(body).subscribe((result) => {
      let data = [];
      let f_nf = result['fraud_non_fraud'];
      f_nf.sort((a: any, b: any) => a.Category.localeCompare(b.Category));
      for (let i = 0; i < f_nf.length; i = i + 2) {
        let name1 = f_nf[i].Category;
        let name2 = f_nf[i + 1].Category;
        if (name1 == name2) {
          let data_element = new data_point(name1, 0, 0);
          if (f_nf[i]['Is Fraud?'] == 0) {
            data_element.non_fraud = f_nf[i]['Amount'];
            data_element.fraud = f_nf[i + 1]['Amount'];
          }
          else {
            data_element.fraud = f_nf[i]['Amount'];
            data_element.non_fraud = f_nf[i + 1]['Amount'];
          }
          data.push(data_element);
        }
      }
      data.sort((a: any, b: any) => b.fraud + b.non_fraud - a.fraud - a.non_fraud);
      this.bar1_labels = this.bar2_labels = data.map((data: any) => data.category);
      this.bar1_chart_data[0].data = data.map((data: any) => (data.fraud + data.non_fraud) / 1000000);
      this.bar2_chart_data[0].data = data.map((data: any) => data.non_fraud / 1000000);
      this.bar2_chart_data[1].data = data.map((data: any) => data.fraud / 1000000);
    });
  }

  // Overall cards data
  get_cards_chart_data() {
    let body = {
      Datetime: [
        this.trans_from_date.toLocaleString(),
        this.trans_to_date.toLocaleString()
      ]
    }

    // Line chart
    this.http.get_fraud_rate_in_time(body).subscribe((result) => {
      result = result.filter((x: any) => x['Is Fraud?'] > 0);
      let data = [];
      result.sort((a: any, b: any) => a['datetime'] > b['datetime']);
      for (let i = 0; i < result.length; i = i + 4) {
        let name1 = result[i]['datetime']
        let data_element = new data_point(name1, 0, 0);
        data_element.fraud = result[i]['Is Fraud?'];
        data.push(data_element);
      }
      this.fraud_rate_in_time_labels = data.map((data: any) => new Date(data['category']).getMonth() + 1 + '/' + new Date(data['category']).getFullYear());
      this.fraud_rate_in_time = data.map((data: any) => data.fraud.toFixed(3));
      this.ready_cards_line_chart = true;
    });

    // First cards bar chart
    this.http.get_fraud_cnt_by_card_type(body).subscribe((result) => {
      let data = [];
      result.sort((a: any, b: any) => a['Card Type'].localeCompare(b['Card Type']));
      for (let i = 0; i < result.length; i = i + 2) {
        let name1 = result[i]['Card Type'];
        let name2 = result[i + 1]['Card Type'];
        if (name1 == name2) {
          let data_element = new data_point(name1, 0, 0);
          if (result[i]['Is Fraud?'] == 0) {
            data_element.non_fraud = result[i]['Count'];
            data_element.fraud = result[i + 1]['Count'];
          }
          else {
            data_element.fraud = result[i]['Count'];
            data_element.non_fraud = result[i + 1]['Count'];
          }
          data.push(data_element);
        }
      }
      data.sort((a: any, b: any) => b.value + b.value2 - a.value - a.value2);
      this.cards_bar1_labels = data.map((data: any) => data['category']);
      this.cards_bar1_chart_data[0].data = data.map((data: any) => data.non_fraud);
      this.cards_bar1_chart_data[1].data = data.map((data: any) => data.fraud);
      this.ready_cards_bar1_chart = true;
    });

    // Second cards bar chart
    this.http.get_fraud_cnt_per_card_number(body).subscribe((result) => {
      let data = [];
      result.sort((a: any, b: any) => a['Num Credit Cards'] - b['Num Credit Cards']);
      for (let i = 0; i < result.length; i = i + 2) {
        let name1 = result[i]['Num Credit Cards'];
        let name2 = result[i + 1]['Num Credit Cards'];
        if (name1 == name2) {
          let data_element = new data_point(name1, 0, 0);
          if (result[i]['Is Fraud?'] == 0) {
            data_element.non_fraud = result[i]['Amount'];
            data_element.fraud = result[i + 1]['Amount'];
          } else {
            data_element.fraud = result[i]['Amount'];
            data_element.non_fraud = result[i + 1]['Amount'];
          }
          data.push(data_element);
        }
      }
      this.cards_bar2_labels = data.map((data: any) => data['category']);
      this.cards_bar2_chart_data[0].data = data.map((data: any) => data.non_fraud);
      this.cards_bar2_chart_data[1].data = data.map((data: any) => data.fraud);
      this.ready_cards_bar2_chart = true;
    });
  }

  // Apply selected filters
  filter_merchant_place(selected: any) {
    this.selected_merchant_place = selected;
    this.get_trans_chart_data();
  }

  filter_date(selected: any) {
    this.trans_from_date = new Date(selected[0]);
    this.trans_to_date = new Date(selected[1]);
    this.get_trans_chart_data();
    this.get_cards_chart_data();
  }

  // Toggle side tabs
  toggle_model_div() {
    this.activate_drawer = true;
    this.is_model_div_visible = true;
    this.is_cards_div_visible = false;
    this.is_trans_div_visible = false;
  }

  toggle_cards_div() {
    this.activate_drawer = true;
    this.is_cards_div_visible = true;
    this.is_model_div_visible = false;
    this.is_trans_div_visible = false;
  }
  
  toggle_trans_div(){
    this.activate_drawer = true;
    this.is_trans_div_visible = true;
    this.is_cards_div_visible = false;
    this.is_model_div_visible = false;
  }
}

class data_point {
  category!: string;
  fraud!: number;
  non_fraud!: number;
  constructor(category: string = '', fraud: number = 0, non_fraud: number = 0) {
    this.category = category;
    this.fraud = fraud;
    this.non_fraud = non_fraud;
  }
}