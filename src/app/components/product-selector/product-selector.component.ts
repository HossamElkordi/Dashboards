import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-product-selector',
  templateUrl: './product-selector.component.html',
  styleUrls: ['./product-selector.component.css'],
})
export class ProductSelectorComponent {
  constructor(
    private router: Router,
    private auth: AuthService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIcon(
      'rajhy',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '../../../../../assets/rajhy_logo.svg'
      )
    );
  }

  tiles = [
    { cols: 3, rows: 1, color: 'lightblue' },
    { cols: 1, rows: 1, color: 'lightgreen' },
  ];

  tiles_title2desc: Record<string, string> = {
    pd: 
      'Analyse your customers and their loans to predict the possibility of defaulting within 1 year.',
    macro:
      'Macro-Economic Variables and Construction Materials Forecasting tool helps you improve your planning and decision-making.',
    approval:
      'Assess credit applicants based on their credit behavior to guarantee your money return.',
    micro: 
      'Assess your customers credit score based on their credit payments.',
    segm: 
      'Improve you KYC techniques by categorizing your customers into groups based on their different aspects.',
    fraud: 
      'Protect your customers from fraudsters by preventing suspicious transactions.',
    asset: 
      'Evaluate your customers cars and houses to ensure your loan money return.',
    mule: 
      'Detect suspicious circulation of money and identify mule accounts.',
    nbo: 
      'Analyze your customers and offering to optimize recommendations and increase your profit.',
  };

  tiles2title: Record<string, string> = {
    pd: 'PD Prediction',
    macro: 'Macro-Economics Forecasting',
    approval: 'Credit Approval',
    micro: 'Microfinance',
    segm: 'Customer Segmentation',
    fraud: 'Fraud Detection',
    asset: 'Asset Management',
    mule: 'Mule Detection',
    nbo: 'Next Best Offer',
  };

  tiles_title: string[] = [
    'pd',
    'macro',
    'approval',
    'micro',
    'segm',
    'fraud',
    'asset',
    'mule',
    'nbo',
  ];

  onProductClick(prod: string) {
    this.router.navigate(['products', prod]);
  }

  logout() {
    this.auth.SignOut();
  }
}
