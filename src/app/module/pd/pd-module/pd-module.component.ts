import { Component, ViewChild, ElementRef } from '@angular/core';
import { PdClient, PdClientLoan } from 'src/app/interfaces/types';
import { ModuleTopbarComponent } from 'src/app/components/module-topbar/module-topbar.component';

@Component({
  selector: 'app-pd-module',
  templateUrl: './pd-module.component.html',
  styleUrls: ['./pd-module.component.css'],
})
export class PdModuleComponent {
  @ViewChild(ModuleTopbarComponent, { read: ElementRef }) header!: ElementRef;

  viewedClient: PdClient | null = null;
  viewedLoan: PdClientLoan | null = null;

  viewClientDetails(client: PdClient) {
    this.viewedClient = client;
  }

  onClientDrawerClose() {
    console.log('client drawer');
    this.viewedClient = null;
  }

  viewLoanDetails(loan: PdClientLoan) {
    this.viewedLoan = loan;
  }
}
