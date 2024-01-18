import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModuleTopbarComponent } from 'src/app/components/module-topbar/module-topbar.component';
import { MuleAccountsTableRow } from 'src/app/interfaces/types';

@Component({
  selector: 'app-mule-module',
  templateUrl: './mule-module.component.html',
  styleUrls: ['./mule-module.component.css']
})
export class MuleModuleComponent {
  @ViewChild(ModuleTopbarComponent, { read: ElementRef }) header!: ElementRef;

  viewedAccount: MuleAccountsTableRow | null = null;

  viewClientDetails(client: MuleAccountsTableRow) {
    this.viewedAccount = client;
  }
  onClientDrawerClose() {
    console.log('Account drawer');
    this.viewedAccount = null;
  }
}
