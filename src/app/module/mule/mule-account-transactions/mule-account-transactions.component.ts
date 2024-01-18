import { Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, catchError, map, startWith, switchMap } from 'rxjs';
import { TableComponent } from 'src/app/components/table/table.component';
import { Column, MuleAccountTransTable, MuleAccountTransTableRow, MuleAccountsTableRow, MuleBarChartElement, MuleTransAmountCurrency } from 'src/app/interfaces/types';
import { MuleServiceService } from 'src/app/services/mule-service.service';

@Component({
  selector: 'app-mule-account-transactions',
  templateUrl: './mule-account-transactions.component.html',
  styleUrls: ['./mule-account-transactions.component.css']
})
export class MuleAccountTransactionsComponent {
  constructor (private http: MuleServiceService) {}
  columns: Column[] = [
    { name: 'Timestamp', value: 'Timestamp', type: 'text' },
    { name: 'Account\'s Bank', value: 'Account\'s Bank', type: 'text' },
    { name: 'Beneficiary Account', value: 'Beneficiary Account', type: 'text' },
    { name: 'Beneficiary Bank', value: 'Beneficiary Bank', type: 'text' },
    { name: 'Amount Paid', value: 'Amount Paid', type: 'text' },
    { name: 'Payment Currency', value: 'Payment Currency', type: 'text' },
    { name: 'Mule (%)', value: 'Mule Probability', type: 'gauge', min: 0, max: 100 }
  ];

  @ViewChild(TableComponent) table!: TableComponent;

  accountName!: string;
  bankName!: number;
  selectedTrans!: MuleAccountTransTableRow;
  accountTransData!: MuleAccountTransTableRow[];
  accountTransTable!: MatTableDataSource<MuleAccountTransTableRow>;
  accountMuleTransInfo!:{ name: string, value: string, color?: string, trend?: 'up' | 'down' };


  @Input() set account(selectedAccount: MuleAccountsTableRow | null) {
    if (selectedAccount !== null) {
      this.accountName = selectedAccount.Account;
      this.bankName = selectedAccount.Bank;
      this.getAccountTransactionsFull();
    }
  }


  getAccountTransactionsFull() {
    this.http.get_account_transactions_full_table(
      this.accountName, this.bankName).subscribe((res) => {
        this.accountTransData = res;
        let sum = 0;
        this.accountTransData.forEach(element => {
          sum += element['Mule Probability']
        })
        const avg = sum / this.accountTransData.length;
        this.accountTransData.forEach(element => {
          element['Mule Probability'] = (element['Mule Probability'] * 100).toFixed(3) as unknown as number;
        });
        this.accountMuleTransInfo = {name: 'Average Mule Percentage', value: (avg*100).toFixed(3) + " %"} 
        this.accountTransTable = new MatTableDataSource(this.accountTransData);
      })
  }
}
