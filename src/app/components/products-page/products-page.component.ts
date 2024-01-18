import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css']
})
export class ProductsPageComponent {
  constructor(private router: Router, private route: ActivatedRoute, private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.iconRegistry.addSvgIcon('rajhy', this.sanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/rajhy_logo.svg'))
  }
  
  products = [
    { id: 'pd', name: 'PD Prediction', icon: 'speedometer' },
    { id: 'macro', name: 'Macro-Economics Forecasting', icon: 'public' },
    { id: 'approval', name: 'Credit Approval', icon: 'payment' },
    { id: 'micro', name: 'Microfinance', icon: 'attach_money' },
    { id: 'segm', name: 'Customer Segmentation', icon: 'group' },
    { id: 'fraud', name: 'Fraud Detection', icon: 'security' },
    { id: 'mule', name: 'Mule Detection', icon: 'account_balance' }, // account_balance account_balance_wallet
    { id: 'nbo', name: 'Next Best Offer', icon: 'star' },
  ];

  selected_product!: string;
  
  goProducts(){
    this.router.navigate(['products'])
  }

  change_product(prod: string){
    this.selected_product = prod
    this.router.navigate(['products', this.selected_product])
  }

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.selected_product = params['name'];
    });
  }

  getProductName(productId: string): string {
    if(this.selected_product == 'car')
      return 'Car Asset Management'
    if(this.selected_product == 'house')
      return 'House Asset Management'
    const product = this.products.find(p => p.id === productId);
    return product ? product.name : '';
  }
}
