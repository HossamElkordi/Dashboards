import { Injectable } from '@angular/core';
import {
  AssetPriceInfo,
  CarAssetDetails,
  ECL,
  HouseAssetDetails,
  PdClient,
  PdClientLoan,
  PdFilterElements,
  PdLoanInfo,
} from '../interfaces/types';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PdServiceService {
  constructor(private http: HttpClient) {}

  private origin = "http://127.0.0.1:7056/";

  applyFilterValues(filterValues: any): Observable<PdClient[]> {
    const payload = {
      filters: {
        date: Array(2),
        years_emp: [],
        Marital_Status: [],
        Num_Dependents: [],
        job: [],
        ...filterValues,
      },
      data_fields: [
        'id',
        'job',
        'years_emp',
        'Marital_Status',
        'Num_Dependents',
        'PD',
      ],
    };
    return this.http.post<PdClient[]>(
      `${this.origin}client_details/apply_filter_values`,
      payload
    );
  }

  getFilterValues(): Observable<PdFilterElements> {
    const payload = {
      data_fields: [
        'date',
        'Marital_Status',
        'years_emp',
        'Num_Dependents',
        'job',
      ],
    };
    return this.http.post<PdFilterElements>(
      `${this.origin}get_filter_values`,
      payload
    );
  }

  getJobsAvgPD(): Observable<{ job: string; PD: number }[]> {
    return this.http.get<{ job: string; PD: number }[]>(
      `${this.origin}client_details/job_avg_pd`
    );
  }

  getJobsClientsCount(): Observable<{ job: string; count: number }[]> {
    const payload = {
      data_fields: 'job',
    };
    return this.http.post<{ job: string; count: number }[]>(
      `${this.origin}client_details/get_count`,
      payload
    );
  }

  getClientDetails(id: number): Observable<PdClient[]> {
    return this.http.get<PdClient[]>(
      `${this.origin}client_details/${id}`
    );
  }

  getClientSpendingDistribution(
    id: number
  ): Observable<{ amount: number; category: string }[]> {
    return this.http.get<{ amount: number; category: string }[]>(
      `${this.origin}client_details/get_client_spending/${id}`
    );
  }

  getClientEvents(id: number) {
    return this.http.get<
      { event: string; start_date: string; end_date: string }[]
    >(`${this.origin}client_details/events/${id}`);
  }

  getClientSpendingOverTime(id: number) {
    return this.http.get<{ amount: number[]; date_time: string[] }>(
      `${this.origin}client_details/get_client_spending_over_time/${id}`
    );
  }

  getClientSpendingOverTimeWithinRange(
    id: number,
    start_date: string,
    end_date: string
  ) {
    const body = {
      date_time: [start_date, end_date],
    };
    return this.http.post<{ amount: number[]; date_time: string[] }>(
      `${this.origin}client_details/get_client_spending_over_time/${id}`,
      body
    );
  }

  getClientLoans(id: number): Observable<PdClientLoan[]> {
    return this.http.get<PdClientLoan[]>(
      `${this.origin}client_details/get_client_loans/${id}`
    );
  }

  getLoanDetails(loan_id: number) {
    return this.http.get<PdLoanInfo>(
      `${this.origin}loan_details/get_loan_details/${loan_id}`
    );
  }

  get12MonthsPITPD(loan_id: number) {
    return this.http.get<{ PD: number; date: string }[]>(
      `${this.origin}Predict_12Months_PIT_PD/${loan_id}`
    );
  }

  getRarocRorac(
    loan_id: number,
    expenses_percentage: number,
    roc_percentage: number
  ) {
    const body = {
      expenses_percentage,
      roc_percentage,
    };
    return this.http.post<{ RAROC: number; RORAC: number }>(
      `${this.origin}loan_details/get_RORAC_RAROC/${loan_id}`,
      body
    );
  }

  getInitRarocRoracFilterValues() {
    return this.http.get<{
      expenses_percentage: [number, number];
      roc_percentage: [number, number];
    }>(`${this.origin}loan_details/get_init_raroc_rorac_filter_values`);
  }

  getHouseDetails(loan_id: number) {
    return this.http.get<HouseAssetDetails>(
      `${this.origin}loan_details/get_asset_details/${loan_id}`
    );
  }

  getCarDetails(loan_id: number) {
    return this.http.get<CarAssetDetails>(
      `${this.origin}loan_details/get_asset_details/${loan_id}`
    );
  }

  getAssetPriceInfo(loan_id: number) {
    return this.http.get<AssetPriceInfo>(
      `${this.origin}loan_details/get_asset_price/${loan_id}`
    );
  }

  getLoanECL(loan_id: number): Observable<ECL[]> {
    return this.http.get<ECL[]>(
      `${this.origin}client_details/get_loan_ecl/${loan_id}`
    );
  }

  getPitPD(loan_id: number) {
    return this.http.get<{ PD: number; date: string }[]>(
      `${this.origin}Predict_PIT_PD/${loan_id}`
    );
  }

  getLifeTimePD(loan_id: number) {
    return this.http.get<{ PD: number; date: string }[]>(
      `${this.origin}Predict_LifeTime/${loan_id}`
    );
  }
}
