import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { forkJoin } from 'rxjs';
import { AreaChartComponent } from 'src/app/components/area-chart/area-chart.component';
import { DateSlicerComponent } from 'src/app/components/date-slicer/date-slicer.component';
import { card_information, macro_api_names, month_number, quarter_number } from 'src/app/interfaces/types';
import { MacroServiceService } from 'src/app/services/macro-service.service';

@Component({
  selector: 'app-time-series',
  templateUrl: './time-series.component.html',
  styleUrls: ['./time-series.component.css']
})
export class TimeSeriesComponent {

  constructor (private http: MacroServiceService, private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer, private cd: ChangeDetectorRef) {
    this.iconRegistry.addSvgIcon('google', this.sanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/google.svg'))
  }

  @Input() var_name?: string | undefined;
  @Input() vars?: string[] | undefined;
  @Input() init_start_date!: string;
  @Input() init_end_date!: string;
  @ViewChild('slicer') date_slicer!: DateSlicerComponent;
  @ViewChild('chart') chart!: AreaChartComponent;

  apis: macro_api_names[] = [
    {name: 'gdp', freq:'Y', scale: 1000000000, yaxistitle: ' (billions)', api: '/GDPForecast/GDP_mean/', query: 'what is the gdp in billions of dollars in the year '},
    {name: 'inf', freq:'Y', scale: 1, yaxistitle: '', api: '/InflationForecast/', query: 'what is the inflation percentage in the year '},
    {name: 'pop', freq:'Y', scale: 1000000, yaxistitle: ' (millions)', api: '/PopulationForecast/', query: 'what is the total population in millions in the year '},
    {name: 'unemp', freq:'Y', scale: 1, yaxistitle: '', api: '/UnemploymentForecast/unemployment_mean/', query: 'what is the unemployment rate in the year '},
    {name: 'cpi', freq:'M', scale: 1, yaxistitle: '', api: '/constructionANDeconomyForecast/CPI_mean/', query: 'what is the average cpi in every month of the year '},
    {name: 'gas', freq:'M', scale: 1, yaxistitle: '', api: '/constructionANDeconomyForecast/GasolinePrices_mean/', query: 'what is the average gasoline price in every month of the year '},
    {name: 'tasi', freq:'M', scale: 1, yaxistitle: '', api: '/constructionANDeconomyForecast/TASI_mean/', query: 'what is the average TASI in every month of the year '},
    {name: 'hpi', freq:'M', scale: 1, yaxistitle: '', api: '/constructionANDeconomyForecast/HPI_mean/', query: 'what is the average HPI in every month of the year '},
    {name: 'bcem', freq:'M', scale: 1, yaxistitle: '', api: '/constructionANDeconomyForecast/BlackCementPrice-50Kg_mean/', query: 'what is the average black cement price per 50Kg in every month of the year '},
    {name: 'wcem', freq:'M', scale: 1, yaxistitle: '', api: '/constructionANDeconomyForecast/WhiteCementPrice-50Kg_mean/', query: 'what is the average white cement price per 50Kg in every month of the year '},
    {name: 'conc', freq:'M', scale: 1, yaxistitle: '', api: '/constructionANDeconomyForecast/ConcreteNorm250Price-CubM_mean/', query: 'what is the average concrete norm 250 price per cubic meter in every month of the year '},
    {name: 'sand', freq:'M', scale: 1, yaxistitle: '', api: '/constructionANDeconomyForecast/MixedSandPrice-CubM_mean/', query: 'what is the average mixed sand price per cubic meter in every month of the year '},
    {name: 'iron', freq:'M', scale: 1, yaxistitle: '', api: '/constructionANDeconomyForecast/IronPrice-Ton_mean/', query: 'what is the average iron price per ton in every month of the year '},
    {name: 'bl', freq:'M', scale: 1, yaxistitle: '', api: '/constructionANDeconomyForecast/BlockPrice-1000bl_mean/', query: 'what is the average building block price per 1000 blocks in every month of the year '},
  ]
  
  vars_apis!: macro_api_names[]

  name2title: Record<string, string> = {
    'gdp': 'GDP',
    'inf': 'Inflation',
    'pop': 'Population',
    'unemp': 'Unemployment Rate',
    'cpi': 'CPI',
    'gas': 'Gasoline Price',
    'tasi': 'TASI',
    'hpi': 'HPI',
    'bcem': 'Black Cement',
    'wcem': 'White Cement',
    'conc': 'Concrete',
    'sand': 'Sand',
    'iron': 'Iron',
    'bl': 'Blocks'
  }

  name2color: Record<string, string> = {
    'gdp': '#fe0000', 'inf': '#800001', 'pop': '#fe6a00',
    'unemp': '#803400', 'cpi': '#ffd800', 'gas': '#806b00',
    'tasi': '#00fe21', 'hpi': '#007f0e', 'bcem': '#0094fe',
    'wcem': '#00497e', 'conc': '#0026ff', 'sand': '#001280',
    'iron': '#b100fe', 'bl': '#590080'
  }

  min_date!: string;
  max_date!: string;

  cur_dates!: string[];
  cur_values!: number[];

  prediction_start: string = '2022-12-31';

  year_list: number[] = [];
  month_list: month_number[] = [
    {month: 'January', monthi: "01"},
    {month: 'February', monthi: "02"},
    {month: 'March', monthi: "03"},
    {month: 'April', monthi: "04"},
    {month: 'May', monthi: "05"},
    {month: 'June', monthi: "06"},
    {month: 'July', monthi: "07"},
    {month: 'August', monthi: "08"},
    {month: 'September', monthi: "09"},
    {month: 'October', monthi: "10"},
    {month: 'November', monthi: "11"},
    {month: 'December', monthi: "12"},
  ]
  quarter_list: quarter_number[] = [
    {quarter: "First", quarteri: "Q1", monthi_start: 0, monthi_end: 2},
    {quarter: "Second", quarteri: "Q2", monthi_start: 3, monthi_end: 5},
    {quarter: "Third", quarteri: "Q3", monthi_start: 6, monthi_end: 8},
    {quarter: "Fourth", quarteri: "Q4", monthi_start: 9, monthi_end: 11},
  ]

  selectedYear: string = "";
  selectedQuarter!: quarter_number | undefined;
  selectedMonth!: string | undefined;
  selectedDate: string = "";

  selected_value!: number | undefined;
  prev_value!: number | undefined;
  now_value!: number | undefined;

  selected_values!: number[] | undefined;
  prev_values!: number[] | undefined;
  now_values!: number[] | undefined;

  cur_val!: number | string;
  perc_prev!: number | string;
  perc_now!: number | string;

  cur_val_color!: string;
  perc_prev_color!: string;
  perc_now_color!: string;

  perc_prev_trend: 'up' | 'down' | undefined;
  perc_now_trend: 'up' | 'down' | undefined;

  cur_card_info!: card_information[];
  prev_card_info!: card_information[];
  now_card_info!: card_information[];

  show_cards: boolean = false;
  genai: boolean = false;

  onGenAIToggleChange(e: any){
    if(this.show_cards){
      if(this.vars_apis[0].freq == 'Y'){
        if(this.genai) this.genai_yearly()
        else this.ejadaYearly()
      }else{
        if(this.selectedMonth === undefined){
          if(this.genai) this.genai_quarterly()
          else this.ejadaQuarterly(this.selectedQuarter as quarter_number)
        }else{
          if(this.genai) this.genai_monthly()
          else this.ejadaMonthly(this.selectedMonth)
        }
      }
    }
  }

  onYearSelect(y: any){
    this.selectedYear = y
    if(this.vars_apis[0].freq == 'Y' || this.var_name === undefined){
      if(this.genai) {
        this.genai_yearly()
      }else{
        this.ejadaYearly()
      }
    }
  }

  onQuarterSelect(q: quarter_number){
    this.selectedQuarter = q
    this.selectedDate = `${this.selectedYear}-${q.quarteri}`
    this.selectedMonth = undefined
    if(this.genai){
      this.genai_quarterly()
    }else{
      this.ejadaQuarterly(q)
    }
  }

  onMonthSelect(m: string){
    this.selectedMonth = m
    this.selectedDate = `${this.selectedYear}-${m}`
    this.selectedQuarter = undefined
    if(this.genai){
      this.genai_monthly()
    }else{
      this.ejadaMonthly(m)
    }
  }

  ejadaYearly(){
    if(this.var_name !== undefined){
      this.ejadaYearlySingle()
    }else{
      this.ejadaYearlyMulti()
    }
  }

  ejadaYearlySingle(){
    let observables = [
      this.http.get_series(this.vars_apis[0].api, `${this.selectedYear}-12-31`, `${this.selectedYear}-12-31`),
      this.http.get_series(this.vars_apis[0].api, `${(Number.parseInt(this.selectedYear)) - 1}-12-31`, `${(Number.parseInt(this.selectedYear)) - 1}-12-31`),
      this.http.get_series(this.vars_apis[0].api, "2023-12-31", "2023-12-31")
    ]

    forkJoin(observables).subscribe(res => {
      this.selected_value = res[0].values[0]
      this.prev_value = res[1].values[0]
      this.now_value = res[2].values[0]
      this.setCardsValueSingle()
    })
  }

  ejadaYearlyMulti(){
    let observables = []

    for (let i = 0; i < this.vars_apis.length; i++) {
      if(this.vars_apis[i].freq == 'Y'){
        observables.push(this.http.get_series(this.vars_apis[i].api, `${this.selectedYear}-12-31`, `${this.selectedYear}-12-31`))
        observables.push(this.http.get_series(this.vars_apis[i].api, `${(Number.parseInt(this.selectedYear)) - 1}-12-31`, `${(Number.parseInt(this.selectedYear)) - 1}-12-31`))
        observables.push(this.http.get_series(this.vars_apis[i].api, "2023-12-31", "2023-12-31"))
      }else{
        observables.push(this.http.get_series(this.vars_apis[i].api, `${this.selectedYear}-01-31`, `${this.selectedYear}-12-31`))
        observables.push(this.http.get_series(this.vars_apis[i].api, `${(Number.parseInt(this.selectedYear)) - 1}-01-31`, `${(Number.parseInt(this.selectedYear)) - 1}-12-31`))
        observables.push(this.http.get_series(this.vars_apis[i].api, "2023-01-31", "2023-12-31"))
      }
    }

    forkJoin(observables).subscribe(res => {
      this.selected_values = []
      this.prev_values = []
      this.now_values = []
      for (let i = 0; i < this.vars_apis.length; i++) {
        if(this.vars_apis[i].freq == 'Y'){
          this.selected_values.push(res[i * 3].values[0])
          this.prev_values.push(res[i * 3 + 1].values[0])
          this.now_values.push(res[i * 3 + 2].values[0])
        }else{
          this.selected_values.push(res[i * 3].values.reduce((a: number, b: number): number => a + b) / res[i * 3].values.length)
          this.prev_values.push((res[i * 3 + 1].values.length == 0) ? Number.NaN : (res[i * 3 + 1].values.reduce((a: number, b: number): number => a + b) / res[i * 3 + 1].values.length))
          this.now_values.push(res[i * 3 + 2].values.reduce((a: number, b: number): number => a + b) / res[i * 3 + 2].values.length)
        }
      }
      this.setCardsValueMulti()
    })
  }

  genai_yearly(){
    let q: string = `${this.vars_apis[0].query}${Number(this.selectedYear) - 1} and ${this.selectedYear} and 2023`
    this.http.get_from_genai(q).subscribe(res => {
      this.selected_value = res[1].value * this.vars_apis[0].scale
      this.prev_value = res[0].value * this.vars_apis[0].scale
      this.now_value = res[2].value * this.vars_apis[0].scale
      this.setCardsValueSingle()
    })
  }

  ejadaMonthly(m: string){
    let observables = [
      this.http.get_series(this.vars_apis[0].api, `${this.selectedYear}-${m}`, `${this.selectedYear}-${m}`),
      this.http.get_series(this.vars_apis[0].api, `${Number.parseInt(this.selectedYear) - 1}-${m}`, `${Number.parseInt(this.selectedYear) - 1}-${m}`),
      this.http.get_series(this.vars_apis[0].api, `2023-${m}`, `2023-${m}`)
    ]
    forkJoin(observables).subscribe(res => {
      this.selected_value = res[0].values[0]
      this.prev_value = res[1].values[0]
      this.now_value = res[2].values[0]
      this.setCardsValueSingle()
    })
  }

  genai_monthly(){
    let q0: string = `${this.vars_apis[0].query}${Number(this.selectedYear) - 1}`
    let q1: string = `${this.vars_apis[0].query}${Number(this.selectedYear)}`
    let q2: string = `${this.vars_apis[0].query}2023}`

    let m: number = Number.parseInt(this.selectedMonth as string) - 1
    let observables = [
      this.http.get_from_genai(q0),
      this.http.get_from_genai(q1),
      this.http.get_from_genai(q2),
    ]

    forkJoin(observables).subscribe(res => {
      this.selected_value = res[1][m].value
      this.prev_value = res[0][m].value
      this.now_value = res[2][m].value
      this.setCardsValueSingle()
    })
  }

  ejadaQuarterly(q: quarter_number){
    let observables = [
      this.http.get_series(this.vars_apis[0].api, `${this.selectedYear}-${this.month_list[q.monthi_start].monthi}`, `${this.selectedYear}-${this.month_list[q.monthi_end].monthi}`),
      this.http.get_series(this.vars_apis[0].api, `${Number.parseInt(this.selectedYear) - 1}-${this.month_list[q.monthi_start].monthi}`, `${Number.parseInt(this.selectedYear) - 1}-${this.month_list[q.monthi_end].monthi}`),
      this.http.get_series(this.vars_apis[0].api, `2023-${this.month_list[q.monthi_start].monthi}`, `2023-${this.month_list[q.monthi_end].monthi}`)
    ]
    forkJoin(observables).subscribe(res => {
      this.selected_value = (res[0].values.length == 0) ? undefined : res[0].values.reduce((a: number, b: number): number => a + b) / res[0].values.length
      this.prev_value = (res[1].values.length == 0) ? undefined : res[1].values.reduce((a: number, b: number): number => a + b) / res[1].values.length
      this.now_value = (res[2].values.length == 0) ? undefined : res[2].values.reduce((a: number, b: number): number => a + b) / res[2].values.length
      this.setCardsValueSingle()
    })
  }

  genai_quarterly(){
    
    let q0: string = `${this.vars_apis[0].query}${Number(this.selectedYear) - 1}`
    let q1: string = `${this.vars_apis[0].query}${Number(this.selectedYear)}`
    let q2: string = `${this.vars_apis[0].query}2023}`
    
    let from: number = (this.selectedQuarter as quarter_number).monthi_start
    let to: number = (this.selectedQuarter as quarter_number).monthi_end + 1

    let observables = [
      this.http.get_from_genai(q0),
      this.http.get_from_genai(q1),
      this.http.get_from_genai(q2),
    ]

    forkJoin(observables).subscribe(res => {
      res[1] = res[1].slice(from, to)
      res[0] = res[0].slice(from, to)
      res[2] = res[2].slice(from, to)
      this.selected_value = (res[1][0].value + res[1][1].value + res[1][2].value) / (to - from)
      this.prev_value = (res[0][0].value + res[0][1].value + res[0][2].value) / (to - from)
      this.now_value = (res[2][0].value + res[2][1].value + res[2][2].value) / (to - from)
      this.setCardsValueSingle()
    })
  }

  onDateRangeChange(newRange: string[]){
    if(this.var_name !== undefined)
      this.setSeriesChartSingle(newRange[0], newRange[1])
    else 
      this.setSeriesChartMulti(newRange[0], newRange[1])
  }

  setCardsValueSingle(){
    this.perc_prev = this.computeChangePercentage(this.selected_value, this.prev_value)
    if(this.perc_prev === ""){
      this.perc_prev = "Value of the previous year isn't available"
      this.perc_prev_color = "red"
    }else{
      this.perc_prev_color = (this.perc_prev as number >= 0) ? "green" : "red"
      this.perc_prev_trend = (Number((this.perc_prev as number).toFixed()) > 0) ? "up" : (Number((this.perc_prev as number).toFixed()) < 0) ? "down" : undefined
      this.perc_prev = this.formatNumbers(this.perc_prev as number)
    }
    this.prev_card_info = [{name: `Change Percentage from Previous Year of ${this.name2title[this.vars_apis[0].name]}`, value: this.perc_prev + '%', color: this.perc_prev_color}]
    if(this.perc_prev_trend !== undefined){
      this.prev_card_info[0].trend = this.perc_prev_trend;
    }

    this.perc_now = this.computeChangePercentage(this.now_value, this.selected_value)
    if(this.perc_now === ""){
      this.perc_now = "Value of the selected year isn't available"
      this.perc_now_color = "red"
    }else{
      this.perc_now_color = (this.perc_now as number >= 0) ? "green" : "red"
      this.perc_now_trend = (Number((this.perc_now as number).toFixed()) > 0) ? "up" : (Number((this.perc_now as number).toFixed()) < 0) ? "down" : undefined
      this.perc_now = this.formatNumbers(this.perc_now as number)
    }
    this.now_card_info = [{name: `Current Change Percentage from Selected Date of ${this.name2title[this.vars_apis[0].name]}`, value: this.perc_now + '%', color: this.perc_now_color}]
    if(this.perc_now_trend !== undefined){
      this.now_card_info[0].trend = this.perc_now_trend
    }

    if(this.selected_value === undefined){
      this.cur_val = "Value of the selected year isn't available"
      this.cur_val_color = "red"
    }else{
      this.cur_val = this.selected_value
      this.cur_val_color = (this.cur_val as number >= 0) ? "green" : "red"
      this.cur_val = this.formatNumbers(this.selected_value)
    }
    this.cur_card_info = [{name: `Average of ${this.name2title[this.vars_apis[0].name]}`, value: this.cur_val, color: this.cur_val_color}]

    this.show_cards = true
  }

  setCardsValueMulti(){
    if(this.selected_values === undefined || this.prev_values === undefined || this.now_values === undefined) return;
    this.cur_card_info = []
    this.prev_card_info = []
    this.now_card_info = []


    for (let i = 0; i < this.vars_apis.length; i++) {
      this.perc_prev = this.computeChangePercentage(this.selected_values[i], this.prev_values[i])
      if(this.perc_prev === ""){
        this.perc_prev = "Value of the previous year isn't available"
        this.perc_prev_color = "red"
      }else{
        this.perc_prev_color = (this.perc_prev as number >= 0) ? "green" : "red"
        this.perc_prev_trend = (Number((this.perc_prev as number).toFixed()) > 0) ? "up" : (Number((this.perc_prev as number).toFixed()) < 0) ? "down" : undefined
        this.perc_prev = this.formatNumbers(this.perc_prev as number)
      }
      this.prev_card_info.push(
        {
          name: `Change Percentage from Previous Year of ${this.name2title[this.vars_apis[i].name]}`,
          value: this.perc_prev + '%',
          color: this.perc_prev_color,
          trend: (this.perc_prev_trend !== undefined) ? this.perc_prev_trend : undefined
        }
      )

      this.perc_now = this.computeChangePercentage(this.now_values[i], this.selected_values[i])
      if(this.perc_now === ""){
        this.perc_now = "Value of the selected year isn't available"
        this.perc_now_color = "red"
      }else{
        this.perc_now_color = (this.perc_now as number >= 0) ? "green" : "red"
        this.perc_now_trend = (Number((this.perc_now as number).toFixed()) > 0) ? "up" : (Number((this.perc_now as number).toFixed()) < 0) ? "down" : undefined
        this.perc_now = this.formatNumbers(this.perc_now as number)
      }
      this.now_card_info.push(
        {
          name: `Current Change Percentage from Selected Date of ${this.name2title[this.vars_apis[i].name]}`,
          value: this.perc_now + '%',
          color: this.perc_now_color,
          trend: (this.perc_now_trend !== undefined) ? this.perc_now_trend : undefined
        }
      )

      if(this.selected_values[i] === undefined){
        this.cur_val = "Value of the selected year isn't available"
        this.cur_val_color = "red"
      }else{
        this.cur_val = this.selected_values[i]
        this.cur_val_color = (this.cur_val as number >= 0) ? "green" : "red"
        this.cur_val = this.formatNumbers(this.selected_values[i])
      }
      this.cur_card_info.push(
        {
          name: `Average of ${this.name2title[this.vars_apis[i].name]}`,
          value: this.cur_val,
          color: this.cur_val_color
        }
      )
    }
    this.show_cards = true
  }

  setCardsValueMultiOnZoom(res: any, minmax: string[]){
    this.prev_card_info = []
    this.now_card_info = []

    this.cur_card_info = [(
      {
        name: `Selected Range`,
        value: `${minmax[0]} : ${minmax[1]}`
      }
    )]

    for (let i = 0; i < this.vars_apis.length; i++){
      this.prev_card_info.push(
        {
          name: `Number of reported ${this.name2title[this.vars_apis[i].name]} values in this period`,
          value: `${res[i].values.length}`
        }
      )
      let perc = this.computeChangePercentage(res[i].values[res[i].values.length - 1], res[i].values[0])
      this.now_card_info.push(
        {
          name: `Change Percentage of ${this.name2title[this.vars_apis[i].name]} in this period`,
          value: `${this.formatNumbers(perc as number)}` + '%',
          color: (perc as number) >= 0 ? 'green' : 'red',
          trend: (perc as number) > 0 ? 'up' : ((perc as number) < 0 ? 'down' : undefined)
        }
      )
    }

    this.show_cards = true
    this.cd.detectChanges()
  }

  computeChangePercentage(new_val: number | undefined, old_val: number | undefined){
    if(old_val === undefined || new_val === undefined) return ""
    if(isNaN(old_val) || isNaN(new_val)) return ""
    return ((new_val - old_val) / Math.abs(old_val)) * 100
  }

  formatNumbers (val: number) { 
    return (Number(val.toFixed(0)) + 0).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 3})
  }

  onZoom(minmax: string[]){
    if(this.vars === undefined || this.vars.length == 0) return;
    
    let observables = []
    for (let i = 0; i < this.vars_apis.length; i++) {
      observables.push(this.http.get_series(this.vars_apis[i].api, minmax[0], minmax[1]))
    }
    forkJoin(observables).subscribe(res => {
      this.setCardsValueMultiOnZoom(res, minmax)
    })
  }

  setDateLimitSingle(){
    this.http.get_limits(String(this.var_name)).subscribe(res => {
      this.min_date = res.start
      this.max_date = res.end

      this.date_slicer.cur_min = new Date(this.init_start_date)
      this.date_slicer.cur_max = new Date(this.init_end_date)
      
      let from = new Date(this.min_date).getFullYear()
      let to = new Date(this.max_date).getFullYear()
      this.year_list = [...Array(to - from + 1)].map((_, i) => from + i * 1)
    })
  }

  setDateLimitMulti(){
    if(this.vars === undefined) return;

    let observables = []
    for (let i = 0; i < this.vars.length; i++) {
      observables.push(this.http.get_limits(this.vars[i]))
    }

    forkJoin(observables).subscribe(res => {
      let start = res[0].start
      let end = res[0].end

      for (let i = 1; i < res.length; i++) {
        start = (start < res[i].start) ? res[i].start : start
        end = (end < res[i].end) ? end : res[i].end
      }

      this.min_date = start
      this.max_date = end

      this.date_slicer.cur_min = new Date(this.init_start_date)
      this.date_slicer.cur_max = new Date(this.init_end_date)

      let from = new Date(this.min_date).getFullYear()
      let to = new Date(this.max_date).getFullYear()

      this.year_list = [...Array(to - from + 1)].map((_, i) => from + i * 1)
    })
  }

  setSeriesChartSingle(start_date: string, end_date: string){
    this.http.get_series(this.vars_apis[0].api, start_date, end_date).subscribe(res => {
      this.cur_dates = res.dates
      this.cur_values = res.values

      if(this.vars_apis[0].scale > 1){
        this.cur_values = this.cur_values.map((a): number => a / this.vars_apis[0].scale)
      }

      this.chart.setChartSeries(this.cur_dates, [{name: this.var_name + this.vars_apis[0].yaxistitle, data: this.cur_values, color:'#044492'}], "", this.name2title[this.vars_apis[0].name] + this.vars_apis[0].yaxistitle)
      if(new Date(this.cur_dates[this.cur_dates.length - 1]) >= new Date(this.prediction_start)){
        this.chart.setChartAnnotation(this.prediction_start, this.cur_dates[this.cur_dates.length - 1], 'Forecasts')
      }
      this.chart.setChartMarkers(5)
    })
  }

  setSeriesChartMulti(start_date: string, end_date: string){
    if(this.vars === undefined || this.vars.length == 0) return;

    let observables = []
    for (let i = 0; i < this.vars_apis.length; i++) {
      if(this.vars_apis[i].freq == 'M'){
        observables.push(this.http.get_series(this.vars_apis[i].api, 
          `${start_date.substring(0, 4)}-01-31`, 
          `${Number.parseInt(end_date.substring(0, 4)) - 1}-12-31`))
      }else{
        observables.push(this.http.get_series(this.vars_apis[i].api, start_date, end_date))
      }
    }
    let series: ApexAxisChartSeries = [];
    forkJoin(observables).subscribe(res => {
      for (let i = 0; i < this.vars_apis.length; i++){
        if(this.vars_apis[i].scale > 1){
          res[i].values = res[i].values.map((a): number => a / this.vars_apis[i].scale)
        }
        if(this.vars_apis[i].freq == 'M'){
          let avgs: number[] = []
          let x: string[] = []
          let sum: number = 0.0
          for (let j = 0; j < res[i].values.length; j++) {
            sum += res[i].values[j]
            if((j + 1) % 12 == 0){
              avgs.push(sum / 12.0)
              sum = 0.0
              x.push(res[i].dates[j])
            }
          }
          res[i].dates = x
          res[i].values = avgs
        }
        series.push({
          name: this.vars_apis[i].name + this.vars_apis[i].yaxistitle,
          data: res[i].values,
          color: this.name2color[this.vars_apis[i].name]
        })
      }
      this.chart.setChartSeries(res[0].dates, series, "", "")
      this.chart.setChartType('line')
      this.chart.setChartMarkers(5)
    })
  }

  ngOnInit(){
    this.min_date = this.init_start_date
    this.max_date = this.init_end_date

    if(this.var_name !== undefined){
      this.vars_apis = this.apis.filter(obj => obj.name == this.var_name)
      this.setDateLimitSingle()
      this.setSeriesChartSingle(this.init_start_date, this.init_end_date)
    }else{
      this.vars_apis = this.apis.filter(obj => this.vars?.includes(obj.name))
      this.setDateLimitMulti()
      this.setSeriesChartMulti(this.init_start_date, this.init_end_date)
    }
  }
}
