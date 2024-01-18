import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NboServiceService {

  constructor(private _http: HttpClient) { }

  origin: string = 'http://127.0.0.1:4088/'

  get_products() {
    return this._http.get<string[]>(`${this.origin}get_products`)
  }

  get_product(name: string, rate: number) {
    let body = {
      'product_name': name,
      'rate': rate,
    };
    return this._http.post<any[]>(`${this.origin}get_product`, body)
  }

  get_customer(id: number) {
    let body = {
      'id': id,
    };
    return this._http.post<any>(`${this.origin}get_customer`, body)
  }

  get_product_customer_analysis() {
    return this._http.get<any>(`${this.origin}product_customer_analysis`)
  }

  get_market_analysis(name_list: string[], num: number) {
    let body = {
      'products': name_list,
      'num': num,
    };
    console.log(body)
    return this._http.post<any>(`${this.origin}get_market_analysis`, body)
  }

  get_cross_sell() {
    return this._http.get<any>(`${this.origin}get_cross_sell_info`)
  }
}
