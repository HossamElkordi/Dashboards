import { Component, Input } from '@angular/core';
import { card_information } from 'src/app/interfaces/types';
import { NboServiceService } from 'src/app/services/nbo-service.service';
import { Customer } from '../classes/customer';
import { Product } from '../classes/product';
import { ApexAxisChartSeries } from 'ng-apexcharts';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css']
})
export class CustomerInfoComponent {

  constructor (private http: NboServiceService) {}

  @Input() id!: string;

  user_info!: card_information[];
  customer!: Customer;

  products!: string[];
  products_prob!: ApexAxisChartSeries;
  exp_gain_impact!: ApexAxisChartSeries;
  exp_impact!: ApexAxisChartSeries;

  display: boolean = false;

  set_info(){

    this.http.get_customer(Number(this.id)).subscribe(res =>{
      this.customer = new Customer(
        res['customer']['customer_id'],
        res['customer']['first_name'] + ' ' + res['customer']['last_name'],
        res['customer']['age'],
        res['customer']['account_age'],
        res['customer']['product_mix'].split(','),
        res['customer']['product_type_mix'].split(',')
      );

      let products: Product[] = [];
        for (let i = 0; i < res['products'].length; i++) {
          let product_info = res['products'][i];
          let product = new Product(
            product_info['product'],
            product_info['proba_1'],
            product_info['expected_gain'],
            product_info['direct_impact'],
            product_info['indirect_impact']
          );
          products.push(product);
        }
        this.customer.All_products = products;

        this.customer.get_max()
        this.user_info = [
          {name: 'Customer ID', value: this.id},
          {name: 'Customer Name', value: this.customer!.Name},
          {name: 'Customer Age', value: `${this.customer!.Age} years`},
          {name: 'Account Age', value: `${this.customer!.Account_age} years`},
          {name: 'Products', value: `${this.customer!.Products}`},
          {name: 'Products Types', value: `${this.customer!.Products_types}`},
          {name: 'Highest Probability Product', value: `${this.customer!.Best_product!.Name}`},
          {name: 'Probability', value: (this.customer.Best_product!.Probability * 100).toFixed(2)},
          {name: 'Gain', value: this.customer.Best_product!.Gain.toFixed(2)},
          {name: 'Impact', value: (this.customer.Best_product!.Direct_impact + this.customer.Best_product!.Indirect_impact).toFixed(2)},
        ]

        this.products = this.customer.get_all_products()
        this.products_prob = [{name: 'Probability', data: this.customer.get_all_probabilities(), color: '#2C82E0'}]
        this.exp_gain_impact = [
          {name: 'Expected Gain', data: this.customer.get_all_gain(), color: '#2C82E0'},
          {name: 'Expected Impact', data: this.customer.get_all_impact(), color: '#B72833'},
        ]
        this.exp_impact = [
          {name: 'Direct Impact', data: this.customer.get_all_direct_impact(), color: '#2C82E0'},
          {name: 'Indirect Impact', data: this.customer.get_all_indirect_impact(), color: '#B72833'},
          {name: 'Total Expected Impact', data: this.customer.get_all_impact(), color: '#26555B'},
        ]
        this.display = true;
    })
  }

  ngOnInit(){
    this.set_info()
  }
}
