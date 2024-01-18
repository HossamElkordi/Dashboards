import { Component } from '@angular/core';
import { card_information } from 'src/app/interfaces/types';
import { NboServiceService } from 'src/app/services/nbo-service.service';
import { product_rates } from '../classes/pre-defined';
import { ApexAxisChartSeries } from 'ng-apexcharts';

@Component({
  selector: 'app-prod-analysis',
  templateUrl: './prod-analysis.component.html',
  styleUrls: ['./prod-analysis.component.css']
})
export class ProdAnalysisComponent {
  constructor (private http: NboServiceService) {}

  prod_info!: card_information[];
  rates!: product_rates[];

  products!: string[];
  bought_perc!: number[];
  recomm_perc!: number[];
  no_acc_perc!: number[];
  den_perc!: number[];
  prodAccSeries!: ApexAxisChartSeries;

  ngOnInit(){
    this.http.get_cross_sell().subscribe(res => {
      console.log(res)
      this.prod_info = [
        {name: 'Most Bought', value: res['best_bought']},
        {name: 'Most Accepted', value: res['most_accept']},
        {name: 'Most Denied', value: res['most_denied']},
        {name: 'Most Recommended', value: res['most_recommend']},
      ]

      this.rates = res['rates']

      this.products = this.rates.map((r) => (r.product_short))
      this.bought_perc = this.rates.map((r) => (r.bought_percentage))
      this.recomm_perc = this.rates.map((r) => (r.recommend_percentage))
      this.no_acc_perc = this.rates.map((r) => (r.no_accept_rate))
      this.den_perc = this.rates.map((r) => (r.most_denied_percentage))
      this.prodAccSeries = [{name: 'Rate %', data: this.rates.map((r) => (r.acceptance_rate)), color: '#2C82E0'}]

    })
  }
}
