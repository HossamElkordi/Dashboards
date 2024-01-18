import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { genai_results, macro_limits, macro_series } from '../interfaces/types';

@Injectable({
  providedIn: 'root'
})
export class MacroServiceService {

  constructor(private http: HttpClient) { }

  private origin = "http://127.0.0.1:7054/";
  private origin_google = 'http://127.0.0.1:7054/query';

  get_limits(model_name: string){
    return this.http.get<macro_limits>(`${this.origin}/limits/${model_name}`)
  }

  get_series(api: string, start_date: string, end_date:string){
    return this.http.get<macro_series>(`${this.origin}${api}${start_date}/${end_date}`)
  }

  get_from_genai(query: string){
    return this.http.post<genai_results[]>(`${this.origin_google}`, {'text': query})
  }
}
