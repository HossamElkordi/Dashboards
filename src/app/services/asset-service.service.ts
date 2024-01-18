import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  house_data_table_row, car_data_table_row, house_field_values_response, car_field_values_response,
  line_chart_data, get_id_house_info_response, get_id_car_info_response
} from '../interfaces/types';

@Injectable({
  providedIn: 'root'
})
export class AssetServiceService {

  constructor(private _http: HttpClient) { }

  get_house_data_table(datasetName: string, cols: any) {
    return this._http.post<house_data_table_row[]>('http://127.0.0.1:7050/' + datasetName + '/get_data_and_predictions', cols)
  }

  get_car_data_table(datasetName: string, cols: any) {
    return this._http.post<car_data_table_row[]>('http://127.0.0.1:7050/' + datasetName + '/get_data_and_predictions', cols)
  }











  get_house_field_values(datasetName: string, body: any) {
    return this._http.post<house_field_values_response>('http://127.0.0.1:7050/' + datasetName + '/get_field_values', body)
  }

  get_car_field_values(datasetName: string, body: any) {
    return this._http.post<car_field_values_response>('http://127.0.0.1:7050/' + datasetName + '/get_field_values', body)
  }



  
  get_predicted_price(datasetName: string, body: any) {
    return this._http.post<number>('http://127.0.0.1:7050/' + datasetName + '/average_price', body)
  }
  
  get_predicted_price_over_time(datasetName: string, body: any) {
    return this._http.post<line_chart_data>('http://127.0.0.1:7050/' + datasetName + '/average_price_over_time', body)
  }




  get_id_house_info(datasetName: string, id: number) {
    return this._http.get<get_id_house_info_response>('http://127.0.0.1:7050/' + datasetName + '/get_id_info/' + (id as unknown as string))
  }

  get_id_car_info(datasetName: string, id: number) {
    return this._http.get<get_id_car_info_response>('http://127.0.0.1:7050/' + datasetName + '/get_id_info/' + (id as unknown as string))
  }

  predict(datasetName: string, body: any) {
    return this._http.post<any>('http://127.0.0.1:7050/' + datasetName + '/predict/2021/2022', [body])
  }
}
