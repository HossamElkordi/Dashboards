import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FraudFilters, FraudTransTable, Shap } from '../interfaces/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FraudServiceService {

  constructor(private http: HttpClient) { }

  private origin = "http://127.0.0.1:7052/";

  get_table(page_index: number, page_size: number): Observable<FraudTransTable>{
    return this.http.get<FraudTransTable>(`${this.origin}trans_table/${page_index}/${page_size}`)
  }

  get_user_info(user_id: string){
    return this.http.get<any>(`${this.origin}user_info/${user_id}`)
  }

  get_card_info(user_id: string, card_id: string){
    return this.http.get<any>(`${this.origin}card_info/${user_id}/${card_id}`)
  }

  get_trans_info(trans_id: string){
    return this.http.get<any>(`${this.origin}trans_info/${trans_id}`)
  }

  get_interpretability(trans_id: string){
    return this.http.get<Shap[]>(`${this.origin}interpret/${trans_id}`)
  }

  get_filter_values(){
    return this.http.get<any>(`${this.origin}amount_by_category_filter_values`) // ---------------------------------------------------------------
  }

  get_amount_per_category(body: any){
    return this.http.post<any>(`${this.origin}amount_by_category`, body) // ---------------------------------------------------------------
  }

  get_fraud_cnt_by_card_type(body: any){
    return this.http.post<any>(`${this.origin}fraud_count_by_card_type`, body) // ---------------------------------------------------------------
  }

  get_fraud_cnt_per_card_number(body: any){
    return this.http.post<any>(`${this.origin}avg_amount_of_fraud_non_fraud_per_cards_number`, body) // ---------------------------------------------------------------
  }

  get_fraud_rate_in_time(body: any){
    return this.http.post<any>(`${this.origin}fraud_rate_in_time`, body) // ---------------------------------------------------------------
  }

  get_model_metrics(){
    return this.http.get<any>(`${this.origin}model_metrics`); // ---------------------------------------------------------------
  }

  get_confusion_matrix(){
    return this.http.get<any>(`${this.origin}confusion_matrix`); // ---------------------------------------------------------------
  }

  get_model_feature_importance(){
    return this.http.get<any>(`${this.origin}model_feature_importance`); // ---------------------------------------------------------------
  }

  get_avg_amount_fraud_non_fraud_per_state_in_time(body: any){
    return this.http.post<any>(`${this.origin}avg_amount_of_fraud_non_fraud_per_state_in_time`, body)
  }

}
