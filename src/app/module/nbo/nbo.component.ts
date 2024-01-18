import { Product } from './classes/product';
import { FormGroup } from '@angular/forms';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Column, DropdownOption } from 'src/app/interfaces/types';
import { NboServiceService } from 'src/app/services/nbo-service.service';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { Product_customer, prod_mix_distribution, tier_distribution } from './classes/pre-defined';

@Component({
  selector: 'app-nbo',
  templateUrl: './nbo.component.html',
  styleUrls: ['./nbo.component.css']
})
export class NboComponent implements OnInit{

  constructor (private http: NboServiceService) {}

  @ViewChild('custInfo') custInfo!: CustomerInfoComponent;

  activate_drawer: boolean = false;
  drawer_content!: string;
  productsDropDownOptions!: DropdownOption[];
  selected_product!: string;
  cur_proba: number = 0.35;

  customers!: Product_customer[];;
  form: FormGroup = new FormGroup({});
  product: Product = new Product(this.form.value["product"], 0.0, 0, 0, 0)
  tier!: tier_distribution[] | undefined;
  tier_unique!: string[];
  tier_count!: number[];

  product_mix!: prod_mix_distribution[];
  product_mix_unique!: string[];
  product_mix_count!: number[];
  product_mix_categories!: string[][];

  giBarPlotLabels: string[] = ['Gain', 'Impact'];
  giBarPlotData!: number[];
  giBarPlotSeries!: ApexAxisChartSeries;

  eiBarPlotLabels: string[] = ['Direct Impact', ' Indirect Impact', 'Total Expected Impact'];
  eiBarPlotData!: number[];
  eiBarPlotSeries!: ApexAxisChartSeries;

  custProdSeries!: ApexAxisChartSeries;

  selected_customer!: string;

  tableCols: Column[] = [
    {name: 'Customer ID', value: 'customer', type: 'text', filter: false},
    {name: 'Probability', value: 'prob', type: 'text', filter: false},
    {name: 'Gain', value: 'gain', type: 'text', filter: false},
    {name: 'Impact', value: 'impact', type: 'text', filter: false},
  ]
  custTable!: MatTableDataSource<Product_customer>;

  display: boolean = false;


  onProbaChange(prob: number){
    this.tier = undefined;
    this.cur_proba = prob
    this.resetTable()
  }

  onProdChange(prod: string){
    this.tier = undefined;
    this.selected_product = prod
    this.resetTable()

  }

  resetTable(){
    console.log(this.cur_proba)
    this.http.get_product(this.selected_product, this.cur_proba * 100).subscribe(res => {
      this.prepareProductsInfo(res)
    })
  }

  prepareProductsInfo(res: any[]){
    this.customers = []
    let data = res[0]
    this.product = new Product(this.form.value["product"], 0.0, 0, 0, 0)
    for (let i = 0; i < data.length; i++) {
      let customer = {
        customer: data[i]["customer_id"],
        prob: Math.round(data[i]["proba_1"] * 100) / 100,
        gain: Math.round(data[i]["expected_gain"] * 100) / 100,
        impact: Math.round((data[i]["direct_impact"] + data[i]["indirect_impact"]) * 100) / 100,
        product: ""
      }
      this.product.Gain = this.product.Gain + data[i]["expected_gain"]
      this.product.Direct_impact = this.product.Direct_impact + data[i]["direct_impact"]
      this.product.Indirect_impact = this.product.Indirect_impact + data[i]["indirect_impact"]
      this.customers?.push(customer);
    }

    this.custTable = new MatTableDataSource(this.customers)
    
    this.tier = res[2]
    if(this.tier !== undefined){
      this.tier_unique = this.tier.map((t) => (t.tier))
      this.tier_count = this.tier.map((t) => (t.count))
    }
    
    this.product_mix = res[1]
    this.product_mix_unique = this.product_mix.map((t) => (t.product_mix))
    this.product_mix_count = this.product_mix.map((t) => (t.count))

    this.giBarPlotData = [this.product?.Gain, (this.product!.Direct_impact + this.product!.Indirect_impact)]
    this.giBarPlotSeries = [{name: this.selected_product, data: this.giBarPlotData, color: '#2C82E0'}]

    this.eiBarPlotData = [this.product!.Direct_impact, this.product!.Indirect_impact, (this.product!.Direct_impact + this.product!.Indirect_impact)]
    this.eiBarPlotSeries = [{name: this.selected_product, data: this.eiBarPlotData, color: '#2C82E0'}]

    this.custProdSeries = [{name: 'Number Of Customer', data: this.product_mix_count, color: '#2C82E0'}]
    this.product_mix_categories = this.product_mix_unique.map((m) => m.split(", "))

    this.display = (this.customers.length > 0) ? true : false;
  }

  viewCustomerInfo(cust: Product_customer){
    this.selected_customer = cust.customer;
    this.drawer_content = 'customer_info'
    this.activate_drawer = true
    if(this.custInfo !== undefined){
      this.custInfo.id = this.selected_customer
      this.custInfo.set_info()
    }
  }

  custAnalysisClick(){
    this.drawer_content = 'customer_analysis'
    this.activate_drawer = true
  }

  prodAnalysisClick(){
    this.drawer_content = 'product_analysis'
    this.activate_drawer = true
  }

  onSideNavClose(){
    this.custInfo.display = false
  }

  ngOnInit(): void {
    this.http.get_products().subscribe(res => {
      this.productsDropDownOptions = res.map((p) => ({
        label: p, value: p
      }))
      this.selected_product = res[0];
      this.resetTable()
    })
  }
}
