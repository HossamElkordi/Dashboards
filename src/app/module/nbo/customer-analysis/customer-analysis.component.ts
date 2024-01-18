import { ChangeDetectorRef, Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { card_information } from 'src/app/interfaces/types';
import { NboServiceService } from 'src/app/services/nbo-service.service';
import { creation_dates_info } from '../classes/pre-defined';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { AreaChartComponent } from 'src/app/components/area-chart/area-chart.component';

@Component({
  selector: 'app-customer-analysis',
  templateUrl: './customer-analysis.component.html',
  styleUrls: ['./customer-analysis.component.css']
})
export class CustomerAnalysisComponent {

  constructor (private http: NboServiceService, private ref: ChangeDetectorRef) {}

  @ViewChild('cnt') cnt_chart!: AreaChartComponent;
  @ViewChild('min_max_age') min_max_age_chart!: AreaChartComponent;

  customer_analysis!: card_information[];
  products_analysis!: card_information[];

  creation_dates!: creation_dates_info[];
  dates: string[] = [];
  cnt_series!: number[];
  min_age!: number[];
  max_age!: number[];

  past_year_revenue: number = 1.3;

  products!: string[]
  custProdCountSeries!: ApexAxisChartSeries;

  tiers!: string[]
  tierSeries!: number[];

  ngOnInit(){
    this.http.get_product_customer_analysis().subscribe(res => {

      this.customer_analysis = [
        {name: 'Number Of Customers', value: res["customer_count"]},
        {name: 'Average Customer Age', value: `${res["avg_age"].toFixed(2)} years`},
        {name: 'Number Account Age', value: `${res["avg_account_age"].toFixed(2)} years`},
        {name: 'Average Products Held', value: `${res["avg_product_held"].toFixed(2)} product`},
        {name: 'Average Income', value: `$${res["avg_income"].toFixed(0)}`},
        {name: 'Past Revenue Period', value: `${this.past_year_revenue.toFixed(2)}`},
      ]

      this.products_analysis = [
        {name: 'Number Of Products', value: res['count_products']},
        {name: 'Number Of Prod. Types', value: res['count_types']},
        {name: 'Number Of Prod. Mix', value: res['product_mix']},
        {name: 'Number Of Type Mix', value: res['product_type_mix']},
        {name: 'Max Revenue Product', value: res["revenue_max"]["product"]},
        {name: 'Min Revenue Product', value: res["revenue_min"]["product"]},
      ]

      this.products = res['product_count'].map((p: any) => (p.product))
      this.custProdCountSeries = [
        {name: 'Customer Count', data: res['product_count'].map((p: any) => (p.customers)), color:'#2C82E0'}
      ]

      this.tiers = res['tier'].map((t: any) => (t.tier))
      this.tierSeries = res['tier'].map((t: any) => (t.count))

      this.creation_dates = res['creation_dates']
      this.dates = res['creation_dates'].map((d: creation_dates_info) => (d.date))
      this.cnt_series = res['creation_dates'].map((d: creation_dates_info) => (d.customer_count))
      this.min_age = res['creation_dates'].map((d: creation_dates_info) => (d.min_age))
      this.max_age = res['creation_dates'].map((d: creation_dates_info) => (d.max_age))
      
      this.ref.detectChanges();

      this.cnt_chart.setChartSeries(
        this.dates,
        [{name: 'Customers Count', data: this.cnt_series, color: '#2C82E0'}],
        'Number Of New Customers', ''
      )
      this.cnt_chart.setChartType('line')
      this.cnt_chart.chart_options.chart.height = 150

      this.min_max_age_chart.setChartSeries(
        this.dates,
        [
          {name: 'Min Age', data: this.min_age, color: '#2C82E0'},
          {name: 'Max Age', data: this.max_age, color: '#B72833'},
        ],
        'Min and Max Age Of New Customers', ''
      )
      this.min_max_age_chart.setChartType('line')
      this.min_max_age_chart.chart_options.chart.height = 150
      
    })
  }

}
