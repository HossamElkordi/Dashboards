import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tile, Column } from 'src/app/interfaces/types';
import { MatTableDataSource } from '@angular/material/table';
import { ApexAxisChartSeries} from 'ng-apexcharts';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { num_slicer_init, DropdownOption} from 'src/app/interfaces/types';
import { DarkThemeService } from '../../dark-theme.service';

@Component({
  selector: 'app-approval-module',
  templateUrl: './approval-module.component.html',
  styleUrls: ['./approval-module.component.css'],
  animations: [
    trigger('topSlideInOut', [
      state('in', style({
        transform: 'translateY(0)',
        opacity: 1,
        visibility: 'visible'
      })),
      state('out', style({
        transform: 'translateY(-100%)',
        opacity: 0,
        visibility: 'hidden'
      })),
      transition('in => out', animate('300ms ease-out')),
      transition('out => in', animate('300ms ease-in'))
    ]),

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
    ])
  ]
})
export class ApprovalModuleComponent implements OnInit {

  chart_height = window.innerWidth > 1200 ? 380 : 320;
  isDarkTheme = false;

  constructor(private http: HttpClient, private darkThemeService: DarkThemeService) { }
  shouldRender: boolean = false;

  ngOnInit(): void {
    this.darkThemeService.isDarkTheme$.subscribe((isDark) => {
      this.isDarkTheme = isDark;
      this.shouldRender = false;
      setTimeout(() => this.shouldRender = true, 0);
    });

    this.reset = false;
    this.filters_error = false;
    this.cat_filters_value = {};
    this.selectedItem_Gender = [];
    this.selectedItem_Education_Level = [];
    this.selectedItem_Family_Status = [];
    this.selectedItem_House_Type = [];
    this.selectedItem_Occupation_Type = [];
    this.average_risk = { Risk: 0 };
    // Get table data
    const agg_body = {
      BUR: ['AMT_CREDIT_SUM_DEBT_sum'],
      CCB: ['AMT_BAL_DRAW_DIFF_mean'],
      PREV: ['SK_ID_PREV_nunique', 'AMT_CREDIT_sum'],
      INS: ['PAID_OVER_sum', 'DBD_sum', 'DPD_30_sum', 'DPD_60_sum', 'DPD_90_sum', 'DPD_120_sum', 'DPD_120_MORE_sum'],
      ACTIVE: ['Active_REMAINING_DEBT_sum'],
    };
    const agg_url = 'http://localhost:7051/get_data_with_risks_and_aggs';
    this.http.post<columns_table_data[]>(agg_url, agg_body).subscribe(
      (data: columns_table_data[]) => {
        // Adding % to risk 
        for (let i = 0; i < data.length; i++)
          data[i].Risk = Math.round(Number(data[i].Risk) * 100) + "%"
        this.table_data = new MatTableDataSource(data);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Property
  title: string = 'Credit Card Approval';
  module_name: string = 'approval';

  gauge_value: number = 0;
  gauge_append: string = "%"
  gauge_label: string = "Risk"

  current_id!: number;
  current_id_data!: id_data;
  current_id_subsets!: id_subsets;

  selected_subset!: string;
  selected_subset_title!: string;
  ACTIVE: boolean = false;
  APP: boolean = false;
  BUR: boolean = false;
  CCB: boolean = false;
  INS: boolean = false;
  PREV: boolean = false;

  min_slider = 1;
  max_slider = 1;
  table_data!: MatTableDataSource<columns_table_data>;

  interpret_button_disabled:boolean = true;

  client_details: any[] = [
    {name: 'Occupation Type', value: '_'},
    {name: 'Age', value: '_'},
    {name: 'Income', value: '_'},
    {name: 'House Type', value: '_'},
    {name: 'Gender', value: '_'},
    {name: 'Years of Employment', value: '_'},
    {name: 'Family Status', value: '_'},
    {name: 'Education Level', value: '_'},
    {name: 'Number Of Children', value: '_'}
  ]
  historical_details: any[] = [
    {name: 'Previous Credit', value: '_'},
    {name: 'Number of Previous Apps', value: '_'},
    {name: 'Active Loans Debt', value: '_'},
    {name: 'Installments Status', value: '_'},
    {name: 'Bureau Debt', value: '_'},
    {name: 'Credit Cards Status', value: '_'},
    {name: 'Days Past Due', value: '_'},
    {name: 'Days Before Due', value: '_'},
  ];

  bar1_chart_data: ApexAxisChartSeries = [{ name: 'value', data: [] }];
  bar2_chart_data: ApexAxisChartSeries = [{ name: 'value', data: [] }];

  bar1_labels: string[] = [""];
  bar2_labels: string[] = [""];

  bar1_backend_data!: backend_chart_data[];
  bar2_backend_data!: backend_chart_data[];


  tiles: tile[] = [
    { cols: 3, rows: 6, color: 'white' },
    { cols: 3, rows: 3, color: 'white' },
    { cols: 1, rows: 2, color: 'white' },
    { cols: 1, rows: 1, color: 'white' },
    { cols: 4, rows: 3, color: 'white' },
    { cols: 2, rows: 3, color: 'white' },
    { cols: 2, rows: 3, color: 'white' },
  ];
  table_cols_names: Column[] = [
    { name: 'Client Name', value: 'customer_name', type: 'text' },
    { name: 'Client ID', value: 'SK_ID_CURR', type: 'text' },
    { name: 'Loan Type', value: 'NAME_CONTRACT_TYPE', type: 'text' },
    { name: 'Credit Amount', value: 'AMT_CREDIT', type: 'text' },
    { name: 'Credit Score', value: 'CREDIT_SCORE', type: 'text' },
    { name: 'Risk', value: 'Risk', type: 'text' },
  ];

  // Methods
  select_id(data: columns_table_data) {
    if(data == undefined){
      this.gauge_value = 0;
      this.client_details = [
        {name: 'Occupation Type', value: '_'},
        {name: 'Age', value: '_'},
        {name: 'Income', value: '_'},
        {name: 'House Type', value: '_'},
        {name: 'Gender', value: '_'},
        {name: 'Years of Employment', value: '_'},
        {name: 'Family Status', value: '_'},
        {name: 'Education Level', value: '_'},
        {name: 'Number Of Children', value: '_'}
      ]
      this.historical_details = [
        {name: 'Previous Credit', value: '_'},
        {name: 'Number of Previous Apps', value: '_'},
        {name: 'Active Loans Debt', value: '_'},
        {name: 'Installments Status', value: '_'},
        {name: 'Bureau Debt', value: '_'},
        {name: 'Credit Cards Status', value: '_'},
        {name: 'Days Past Due', value: '_'},
        {name: 'Days Before Due', value: '_'},
      ];
      this.interpret_button_disabled = true;
      return;
    }
    this.interpret_button_disabled = false;
    this.current_id = data.SK_ID_CURR;

      
    let temp: string = data.Risk.toString().slice(0, -1)
    this.gauge_value = Number(temp);
    this.selected_subset = 'APP';
    this.selected_subset_title = 'Application Data';

    // Get id data
    const id_data_body = {
      "client_info": [
        "SK_ID_CURR",
        "DAYS_BIRTH",
        "CNT_CHILDREN",
        "NAME_HOUSING_TYPE",
        "OCCUPATION_TYPE",
        "DAYS_EMPLOYED",
        "CODE_GENDER",
        "AMT_INCOME_TOTAL",
        "NAME_EDUCATION_TYPE",
        "NAME_FAMILY_STATUS"
      ],
      "hist_info": [
        "AMT_CREDIT_SUM_DEBT_sum",
        "AMT_BAL_DRAW_DIFF_mean",
        "SK_ID_PREV_nunique",
        "AMT_CREDIT_sum",
        "PAID_OVER_sum",
        "DBD_sum",
        "DPD_sum",
        "Active_REMAINING_DEBT_sum"
      ],
      "id": this.current_id
    }
    const id_data_url = 'http://localhost:7051/id_info';
    this.http.post<id_data>(id_data_url, id_data_body).subscribe(
      (data: id_data) => {
        this.current_id_data = data;
        this.update_cards();
        this.update_charts();
      },
      (error) => {
        console.error('Error: ');
        console.error(error);
      }
    );

    // Get bar1 data
    const bar1_body = {
      'sub': 'APP',
      'id': this.current_id
    };
    const bar1_url = 'http://localhost:7051/get_init_shap';
    this.http.post<backend_chart_data[]>(bar1_url, bar1_body).subscribe(
      (data: backend_chart_data[]) => {
        this.bar1_backend_data = [];
        this.bar1_backend_data = this.bar1_backend_data.concat(data)

        let temp: backend_chart_data[] = []
        temp =  temp.concat(data.slice(0, 1), data.slice(-1));

        this.bar1_chart_data[0].name = 'value'
        this.bar1_chart_data[0].data = temp.map(record => Number(record.value.toFixed(1)));
        this.bar1_labels = temp.map(record => record.variable);
      },
      (error) => {
        console.error(error);
      }
    );

    // Get bar2 data
    const bar2_body = {
      'id': this.current_id
    };
    const bar2_url = 'http://localhost:7051/get_blend_shap';
    this.http.post<backend_chart_data[]>(bar2_url, bar2_body).subscribe(
      (data: backend_chart_data[]) => {
        this.bar2_backend_data = data.map(record => ({
          variable: (record.variable == 'APP' ? "Application Data" :
            record.variable == 'ACTIVE' ? "Active Loans" :
              record.variable == 'BUR' ? "Bureau Data" :
                record.variable == 'INS' ? "Installment Payments" :
                  record.variable == 'PREV' ? "Previous Applications" :
                    record.variable == 'CCB' ? "Credit Card Balance" : record.variable
          ),
          value: record.value
        }));
        console.log(data)
        if(data.length == 0){
          this.bar2_chart_data[0].name = 'value'
          this.bar2_chart_data[0].data = [1]
          this.bar2_labels = ['Application Data']
        }
        else{
          this.bar2_chart_data[0].name = 'value'
          this.bar2_chart_data[0].data = this.bar2_backend_data.map(record => Number(record.value.toFixed(1)));
          this.bar2_labels = this.bar2_backend_data.map(record => record.variable);
        }
      },
      (error) => {
        console.error(error);
      }
    );

  }

  update_bar1_chart(selected: number, slider: string) {
    if(slider == 'min'){
      this.min_slider = selected;

      let temp: backend_chart_data[] = []
      temp =  temp.concat(this.bar1_backend_data.slice(0, this.max_slider), this.bar1_backend_data.slice(-1 * this.min_slider));

      this.bar1_chart_data[0].name = 'value'
      this.bar1_chart_data[0].data = temp.map(record => Number(record.value.toFixed(1)));
      this.bar1_labels = temp.map(record => record.variable);
    }
    else{
      this.max_slider = selected;

      let temp: backend_chart_data[] = []
      temp =  temp.concat(this.bar1_backend_data.slice(0, this.max_slider), this.bar1_backend_data.slice(-1 * this.min_slider));

      this.bar1_chart_data[0].name = 'value'
      this.bar1_chart_data[0].data = temp.map(record => Number(record.value.toFixed(1)));
      this.bar1_labels = temp.map(record => record.variable);
    
    }
  }

  update_cards() {
    this.client_details = [
      { name: 'Occupation Type', value: this.current_id_data.OCCUPATION_TYPE },
      { name: 'Age', value: this.current_id_data.DAYS_BIRTH },
      { name: 'Income', value: this.current_id_data.AMT_INCOME_TOTAL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
      { name: 'House Type', value: this.current_id_data.NAME_HOUSING_TYPE },
      { name: 'Gender', value: this.current_id_data.CODE_GENDER },
      { name: 'Years of Employment', value: this.current_id_data.DAYS_EMPLOYED },
      { name: 'Family Status', value: this.current_id_data.NAME_FAMILY_STATUS },
      { name: 'Education Level', value: this.current_id_data.NAME_EDUCATION_TYPE },
      { name: 'Number Of Children', value: this.current_id_data.CNT_CHILDREN }
    ]

    this.historical_details = [
      this.adjust_cards_labels(this.current_id_data.AMT_CREDIT_sum, "Previous Credit", "Previous Credit", "Previous Credit"),
      { name: 'Number of Previous Apps', value: this.current_id_data.SK_ID_PREV_nunique },
      this.adjust_cards_labels(this.current_id_data.Active_REMAINING_DEBT_sum, "Active Loans", "Active Loans Debt", "Overpayment for Active Loans"),
      this.adjust_cards_labels(this.current_id_data.PAID_OVER_sum, "Installments Status", "Installments Underpayment", "Installments Overpayment"),
      this.adjust_cards_labels(this.current_id_data.AMT_CREDIT_SUM_DEBT_sum, "Bureau Debt", "Bureau Debt", "Bureau Debt"),
      this.adjust_cards_labels(this.current_id_data.AMT_BAL_DRAW_DIFF_mean, "Credit Cards Status", "Credit Card Overdrawing", "Credit Card Underdrawing"),
      { name: 'Days Past Due', value: this.current_id_data.DPD_sum },
      { name: 'Days Before Due', value: this.current_id_data.DBD_sum },
    ]
  }

  update_charts() {
    const id_subsets_body = {
      'id': this.current_id
    };
    const id_subsets_url = 'http://localhost:7051/get_id_subsets';
    this.http.post<id_subsets>(id_subsets_url, id_subsets_body).subscribe(
      (data: id_subsets) => {
        this.current_id_subsets = data;
        this.APP = (this.current_id_subsets.includes('APP'))
        this.CCB = (this.current_id_subsets.includes('CCB'))
        this.PREV = (this.current_id_subsets.includes('PREV'))
        this.INS = (this.current_id_subsets.includes('INS'))
        this.ACTIVE = (this.current_id_subsets.includes('ACTIVE'))
        this.BUR = (this.current_id_subsets.includes('BUR'))
      },
      (error) => {
        console.error(error);
      }
    );
  }

  adjust_cards_labels(property: any, st1: string, st2: string, st3: string) {
    let ans !: any;
    if (typeof property === 'number') {
      if (property < 0)
        ans = { name: st2, value: Math.abs(property).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
      else if (property > 0)
        ans = { name: st3, value: property.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
    }
    if ((typeof property === 'number' && property == 0) || property === "_" || property === "--")
      ans = { name: st1, value: property }
    return ans;
  }

  onclick_ACTIVE_button() {
    this.onclick__button('ACTIVE', "Active Loans");
    this.selected_subset_title = "Active Loans";
    this.selected_subset = 'ACTIVE';
  }

  onclick_APP_button() {
    this.onclick__button('APP', "Application Data");
    this.selected_subset_title = "Application Data";
    this.selected_subset = "APP";
  }

  onclick_BUR_button() {
    this.onclick__button('BUR', "Bureau Data");
    this.selected_subset_title = "Bureau Data";
    this.selected_subset = "BUR";
  }

  onclick_CCB_button() {
    this.onclick__button('CCB', "Credit Card Balance");
    this.selected_subset_title = "Credit Card Balance";
    this.selected_subset = "CCB";
  }

  onclick_INS_button() {
    this.onclick__button('INS', "Installment Payments");
    this.selected_subset_title = "Installment Payments";
    this.selected_subset = "INS";
  }

  onclick_PREV_button() {
    this.onclick__button('PREV', "Previous Applications");
    this.selected_subset_title = "Previous Applications";
    this.selected_subset = "PREV";
  }

  onclick__button(sub: string, message: string) {
    const bar1_body = {
      'sub': sub,
      'id': this.current_id
    };
    const bar1_url = 'http://localhost:7051/get_init_shap';
    this.http.post<backend_chart_data[]>(bar1_url, bar1_body).subscribe(
      (data: backend_chart_data[]) => {
        this.bar1_backend_data = [];
        this.bar1_backend_data = this.bar1_backend_data.concat(data.slice(0, 3), data.slice(-3));
        this.bar1_chart_data[0].name = 'value'
        this.bar1_chart_data[0].data = this.bar1_backend_data.map(record => Number(record.value.toFixed(1)));
        this.bar1_labels = this.bar1_backend_data.map(record => record.variable);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Analysis
  is_top_div_visible: boolean = false;
  is_right_div_visible: boolean = false;
  cat_filters_value: any;
  average_risk!: average_risk_analysis;
  gauge_average_risk: number = 0;
  filters_error!: boolean;
  reset!: boolean;

  Credit_Score_minValue: number = 350;
  Credit_Score_maxValue: number = 800;

  Age_minValue: number = 21;
  Age_maxValue: number = 60;

  Income_minValue: number = 45000;
  Income_maxValue: number = 900000;

  Years_Employed_minValue: number = 0;
  Years_Employed_maxValue: number = 33;

  Days_Before_minValue: number = 18;
  Days_Before_maxValue: number = 1734;

  Days_Past_minValue: number = 0;
  Days_Past_maxValue: number = 55;


  Occupation_Type_items: DropdownOption[] = [
    { label: 'Accountants', value: 'Accountants' },
    { label: 'Cleaning staff', value: 'Cleaning staff' },
    { label: 'Cooking staff', value: 'Cooking staff' },
    { label: 'Core staff', value: 'Core staff' },
    { label: 'Drivers', value: 'Drivers' },
    { label: 'High skill tech staff', value: 'High skill tech staff' },
    { label: 'Laborers', value: 'Laborers' },
    { label: 'Low-skill Laborers', value: 'Low-skill Laborers' },
    { label: 'Managers', value: 'Managers' },
    { label: 'Medicine staff', value: 'Medicine staff' },
    { label: 'Sales staff', value: 'Sales staff' },
    { label: 'Secretaries', value: 'Secretaries' },
    { label: 'Security staff', value: 'Security staff' },
    { label: 'Waiters/barmen staff', value: 'Waiters/barmen staff' },
  ];
  selectedItem_Occupation_Type!: string[];

  Family_Status_items: DropdownOption[] = [
    { label: 'Civil Marriage', value: 'Civil marriage' },
    { label: 'Married', value: 'Married' },
    { label: 'Separated', value: 'Separated' },
    { label: 'Single', value: 'Single / not married' },
    { label: 'Widow', value: 'Widow' },
  ];
  selectedItem_Family_Status!: string[];

  House_Type_items: DropdownOption[] = [
    { label: 'House / apartment', value: 'House / apartment'},
    { label: 'Municipal apartment', value: 'Municipal apartment' },
    { label: 'Rented apartment', value: 'Rented apartment' },
    { label: 'With parents', value: 'With parents'},
  ];
  selectedItem_House_Type!: string[];

  Gender_items: DropdownOption[] = [
    { label: 'M', value: 'M' },
    { label: 'F', value: 'F' },
  ];
  selectedItem_Gender!: string[];

  Education_Level_items: DropdownOption[] = [
    { label: 'Higher Education', value: 'Higher education' },
    { label: 'Incomplete Higher', value: 'Incomplete Higher' },
    { label: 'Lower Secondary', value: 'Lower Secondary' },
    { label: 'Secondary', value: 'Secondary / secondary special' },
  ];
  selectedItem_Education_Level!: string[];

  init_slicers1: num_slicer_init[] = [{
    "title": "Credit Score",
    "step": 1,
    "min_val": this.Credit_Score_minValue,
    "max_val": this.Credit_Score_maxValue,
    "cur_min": this.Credit_Score_minValue,
    "cur_max": this.Credit_Score_maxValue
  },
  {
    "title": "Age",
    "step": 1,
    "min_val": this.Age_minValue,
    "max_val": this.Age_maxValue,
    "cur_min": this.Age_minValue,
    "cur_max": this.Age_maxValue

  },
  {
    "title": "Years Employed",
    "step": 1,
    "min_val": this.Years_Employed_minValue,
    "max_val": this.Years_Employed_maxValue,
    "cur_min": this.Years_Employed_minValue,
    "cur_max": this.Years_Employed_maxValue

  }]

  init_slicers2: num_slicer_init[] = [{
    "title": "Income",
    "step": 10000,
    "min_val": this.Income_minValue,
    "max_val": this.Income_maxValue,
    "cur_min": this.Income_minValue,
    "cur_max": this.Income_maxValue
  },
  {
    "title": "Days Before",
    "step": 1,
    "min_val": this.Days_Before_minValue,
    "max_val": this.Days_Before_maxValue,
    "cur_min": this.Days_Before_minValue,
    "cur_max": this.Days_Before_maxValue

  },
  {
    "title": "Days Past",
    "step": 1,
    "min_val": this.Days_Past_minValue,
    "max_val": this.Days_Past_maxValue,
    "cur_min": this.Days_Past_minValue,
    "cur_max": this.Days_Past_maxValue

  }]

  toggle_top_div() {
    this.is_top_div_visible = !this.is_top_div_visible;
  }

  toggle_right_div(){
    this.is_right_div_visible = !this.is_right_div_visible;
    this.is_top_div_visible = false;
  }
  reset_filters() {
    this.reset = true;

    this.selectedItem_Occupation_Type = []
    this.selectedItem_Gender = []
    this.selectedItem_House_Type = []
    this.selectedItem_Education_Level = []
    this.selectedItem_Family_Status = []

    this.init_slicers1[0].cur_min = this.init_slicers1[0].min_val;
    this.init_slicers1[0].cur_max = this.init_slicers1[0].max_val;
    this.init_slicers1[1].cur_min = this.init_slicers1[1].min_val;
    this.init_slicers1[1].cur_max = this.init_slicers1[1].max_val;
    this.init_slicers1[2].cur_min = this.init_slicers1[2].min_val;
    this.init_slicers1[2].cur_max = this.init_slicers1[2].max_val;

    this.init_slicers2[0].cur_min = this.init_slicers2[0].min_val;
    this.init_slicers2[0].cur_max = this.init_slicers2[0].max_val;
    this.init_slicers2[1].cur_min = this.init_slicers2[1].min_val;
    this.init_slicers2[1].cur_max = this.init_slicers2[1].max_val;
    this.init_slicers2[2].cur_min = this.init_slicers2[2].min_val;
    this.init_slicers2[2].cur_max = this.init_slicers2[2].max_val;

    this.Credit_Score_minValue = 350;
    this.Credit_Score_maxValue = 800;
    this.Age_minValue = 21;
    this.Age_maxValue = 60;
    this.Income_minValue = 45000;
    this.Income_maxValue = 900000;
    this.Years_Employed_minValue = 0;
    this.Years_Employed_maxValue = 33;
    this.Days_Before_minValue = 18;
    this.Days_Before_maxValue = 1734;
    this.Days_Past_minValue = 0;
    this.Days_Past_maxValue = 55;
    this.filter();
  }

  filter() {
    this.filters_error = false;

    if ((this.selectedItem_Gender.length == 0 && this.selectedItem_Education_Level.length == 0 &&
      this.selectedItem_Family_Status.length == 0 && this.selectedItem_House_Type.length == 0
      && this.selectedItem_Occupation_Type.length == 0) || this.reset) {
      this.reset = false;
      const risk_analysis_body = {
        "num_filters": {
          ["DPD_sum"]: [this.Days_Past_minValue, this.Days_Past_maxValue],
          ["DBD_sum"]: [this.Days_Before_minValue, this.Days_Before_maxValue],
          ["CREDIT_SCORE"]: [this.Credit_Score_minValue, this.Credit_Score_maxValue],
          ["DAYS_BIRTH"]: [this.Age_minValue, this.Age_maxValue],
          ["DAYS_EMPLOYED"]: [this.Years_Employed_minValue, this.Years_Employed_maxValue],
          ["AMT_INCOME_TOTAL"]: [this.Income_minValue, this.Income_maxValue]
        },

        "cat_filters": {
          "OCCUPATION_TYPE": [
            'Accountants', 'Cleaning staff', 'Cooking staff', 'Core staff', 'Drivers', 'High skill tech staff', 'Laborers',
            'Low-skill Laborers', 'Managers', 'Medicine staff', 'Sales staff', 'Secretaries', 'Security staff', 'Waiters/barmen staff'
          ],
          "CODE_GENDER": ["M", "F"],
          "NAME_FAMILY_STATUS": ['Civil marriage', 'Married', 'Separated', 'Single / not married', 'Widow'],
          "NAME_HOUSING_TYPE": [
            'House / apartment', 'Municipal apartment', 'Rented apartment', 'With parents'
          ],
          "NAME_EDUCATION_TYPE": [
            'Higher education', 'Incomplete higher', 'Lower secondary', 'Secondary / secondary special'
          ]
        }
      };
      const risk_analysis_url = 'http://localhost:7051/risk_analysis';
      this.http.post<any>(risk_analysis_url, risk_analysis_body).subscribe(
        (data: any) => {
          this.average_risk = data;
          this.gauge_average_risk = Math.round(Number(this.average_risk.Risk) * 100);
        },
        (error) => {
          this.filters_error = true;
          this.average_risk = { Risk: 0 };
          this.gauge_average_risk = 0
          console.error(error);
        }
      );

    }
    else {
      const risk_analysis_body = {
        "num_filters": {
          ["DPD_sum"]: [this.Days_Past_minValue, this.Days_Past_maxValue],
          ["DBD_sum"]: [this.Days_Before_minValue, this.Days_Before_maxValue],
          ["CREDIT_SCORE"]: [this.Credit_Score_minValue, this.Credit_Score_maxValue],
          ["DAYS_BIRTH"]: [this.Age_minValue, this.Age_maxValue],
          ["DAYS_EMPLOYED"]: [this.Years_Employed_minValue, this.Years_Employed_maxValue],
          ["AMT_INCOME_TOTAL"]: [this.Income_minValue, this.Income_maxValue]
        },

        "cat_filters": this.cat_filters_value
      };
      const risk_analysis_url = 'http://localhost:7051/risk_analysis';
      this.http.post<any>(risk_analysis_url, risk_analysis_body).subscribe(
        (data_: any) => {
          this.average_risk = data_;
          this.gauge_average_risk = Math.round(Number(this.average_risk.Risk) * 100);
        },
        (error) => {
          this.filters_error = true;
          this.average_risk = { Risk: 0 };
          this.gauge_average_risk = 0
          console.error(error);
        }
      );
    }
  }

  // Numerical Filters
  filter_1(selected: any){
    this.Credit_Score_minValue = selected[0].cur_min;
    this.Credit_Score_maxValue = selected[0].cur_max;
    this.Age_minValue = selected[1].cur_min;
    this.Age_maxValue = selected[1].cur_max;
    this.Years_Employed_minValue = selected[2].cur_min;
    this.Years_Employed_maxValue = selected[2].cur_max;
    this.filter();
  }

  filter_2(selected: any){
    this.Income_minValue = selected[0].cur_min;
    this.Income_maxValue = selected[0].cur_max;
    this.Days_Before_minValue = selected[1].cur_min;
    this.Days_Before_maxValue = selected[1].cur_max;
    this.Days_Past_minValue = selected[2].cur_min;
    this.Days_Past_maxValue = selected[2].cur_max;
    this.filter();
  }   

  // Categorical Filters
  filter_Occupation_Type(selected: any) {
    this.selectedItem_Occupation_Type = selected;
    if(selected.length == 0)
      delete this.cat_filters_value["OCCUPATION_TYPE"];
    else
      this.cat_filters_value["OCCUPATION_TYPE"] = selected;
    this.filter();
  }

  filter_Family_Status(selected: any) {
    this.selectedItem_Family_Status = selected;
    if(selected.length == 0)
      delete this.cat_filters_value["NAME_FAMILY_STATUS"];
    else
      this.cat_filters_value["NAME_FAMILY_STATUS"] = selected;
    this.filter();
  }

  filter_Education(selected: any) {
    this.selectedItem_Education_Level = selected
    if(selected.length == 0)
      delete this.cat_filters_value["NAME_EDUCATION_TYPE"];
    else
      this.cat_filters_value["NAME_EDUCATION_TYPE"] = selected
    this.filter();
  }

  filter_House(selected: any) {
    this.selectedItem_House_Type = selected
    if(selected.length == 0)
      delete this.cat_filters_value["NAME_HOUSING_TYPE"];
    else
      this.cat_filters_value["NAME_HOUSING_TYPE"] = selected
    this.filter();
  }

  filter_Gender(selected: any) {
    this.selectedItem_Gender = selected
    if(selected.length == 0)
      delete this.cat_filters_value["CODE_GENDER"]
    else
      this.cat_filters_value["CODE_GENDER"] = selected
    this.filter();
  }

}

// Classes
class columns_table_data {
  customer_name!: string;
  SK_ID_CURR!: number;
  DAYS_BIRTH!: number;
  NAME_CONTRACT_TYPE!: string;
  AMT_CREDIT!: number;
  CREDIT_SCORE!: number;
  Risk!: number | string;
}

class id_data {
  SK_ID_CURR!: number | string;
  DAYS_BIRTH!: number | string;
  CNT_CHILDREN!: number | string;
  NAME_HOUSING_TYPE!: string;
  OCCUPATION_TYPE!: string;
  DAYS_EMPLOYED!: number | string;
  CODE_GENDER!: string;
  AMT_INCOME_TOTAL!: number | string;
  NAME_EDUCATION_TYPE!: string;
  NAME_FAMILY_STATUS!: string;
  AMT_CREDIT_SUM_DEBT_sum!: number | string; // Bureau Debt 
  Active_REMAINING_DEBT_sum!: number | string; // Active Loans Debt
  PAID_OVER_sum!: number | string;   //Installments overpayment
  AMT_BAL_DRAW_DIFF_mean!: number | string; // Credit Card Underdrawing
  SK_ID_PREV_nunique!: number | string; // Previous Apps
  AMT_CREDIT_sum!: number | string;    //Previous Credit
  DBD_sum!: number | string; //Days Before due
  DPD_sum!: number | string; // Days past due
}

class id_subsets {
  includes(arg0: string): boolean {
    throw new Error('Method not implemented.');
  }
  APP!: string;
  CCB!: string;
  PREV!: string;
  INS!: string;
  ACTIVE!: string;
  BUR!: string;
}

class backend_chart_data {
  variable!: string;
  value!: number;
}

class average_risk_analysis {
  public Risk!: number;
}