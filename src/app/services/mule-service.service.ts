import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FraudTransTable, MuleAccountTransTable, MuleAccountTransTableRow, MuleAccountsTable, MuleBarChartElement, MuleTransMethods } from '../interfaces/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MuleServiceService {

  constructor(private http: HttpClient) { }

  private origin = "http://127.0.0.1:5010/";

  get_table(page_index: number, page_size: number): Observable<MuleAccountsTable>{
    return this.http.get<MuleAccountsTable>(`${this.origin}get_account_details/${page_index}/${page_size}`);
  }

  get_account_transactions_table(page_index: number, page_size: number, account_number: string, bank_number: number): Observable<MuleAccountTransTable> {
    return this.http.get<MuleAccountTransTable>(`${this.origin}get_account_transaction_details/${page_index}/${page_size}/${account_number}/${bank_number}`);
  }
  get_account_transactions_full_table(account_number: string, bank_number: number): Observable<MuleAccountTransTableRow[]> {
    return this.http.get<MuleAccountTransTableRow[]>(`${this.origin}get_account_transaction_full_details/${account_number}/${bank_number}`);
  }
  get_avg_mule_percentage(account_number: string|null, bank_number: number|null): Observable<number> {
    if (account_number) {
      console.log(account_number)
      return this.http.get<number>(`${this.origin}get_mule_percentage/${account_number}/${bank_number}`);
    }
    return this.http.get<number>(`${this.origin}get_mule_percentage`);
  }

  get_trans_amount_per_currency(): Observable<MuleBarChartElement> {
    return this.http.get<MuleBarChartElement>(`${this.origin}get_trans_amount_per_currency`);
  }
  get_trans_methods(): Observable<MuleTransMethods> {
    return this.http.get<MuleTransMethods>(`${this.origin}get_transaction_methods`);
  }
}
