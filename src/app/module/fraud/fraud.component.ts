import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { Observable, catchError, forkJoin, map, min, startWith, switchMap } from 'rxjs';
import { SliderComponent } from 'src/app/components/slider/slider.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { Column, FraudTransTable, FraudTransTableRow, card_information } from 'src/app/interfaces/types';
import { FraudServiceService } from 'src/app/services/fraud-service.service';

@Component({
  selector: 'app-fraud',
  templateUrl: './fraud.component.html',
  styleUrls: ['./fraud.component.css']
})
export class FraudComponent {
  constructor (private http: FraudServiceService) {}

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
  high_risk_cnt: number = 0;
  low_risk_cnt: number = 0;
  high_risk_cur!: number;
  low_risk_cur!: number;
  allStates!: string[];
  initDates!: string[];


  @ViewChild(TableComponent) table!: TableComponent;
  @ViewChild('low') low_risk_slider!: SliderComponent;
  @ViewChild('high') high_risk_slider!: SliderComponent;

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
        this.low_risk_cnt < 5 ? this.low_risk_cnt : 5,
        this.high_risk_cnt < 5 ? this.high_risk_cnt : 5
      )
      
    })

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
  }

  low_risk_cnt_change(e: number){
    this.set_interpretability_chart(e, this.high_risk_cur)
  }

  high_risk_cnt_change(e: number){
    this.set_interpretability_chart(this.low_risk_cur, e)
  }

  get_filter_value(){
    this.http.get_filter_values().subscribe(res => {
      console.log(res)
      this.allStates = res['Merchant State']
      this.initDates = [new Date(res['Datetime'][0]).toLocaleDateString('sv'), new Date(res['Datetime'][1]).toLocaleDateString('sv')]

      let date_filter = {'Datetime': this.initDates}
      let date_merchant_filter = {'Merchant State': this.allStates, 'Datetime': this.initDates}

      let obs = [
        this.http.get_amount_per_category(date_merchant_filter),
        this.http.get_fraud_cnt_by_card_type(date_filter),
        this.http.get_fraud_cnt_per_card_number(date_filter),
        this.http.get_fraud_rate_in_time(date_filter),
        this.http.get_avg_amount_fraud_non_fraud_per_state_in_time(date_filter),
      ]

      forkJoin(obs).subscribe(res1 => {
        console.log(res1)
      })
    })
  }

  ngAfterViewInit(){
    this.getTransTable()
  }

  ngOnInit(){
    this.get_filter_value()
  }
}
