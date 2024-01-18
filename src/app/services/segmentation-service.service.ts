import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ClientsDistFilters,
  DemographicSegmentationData,
  DemographicSegmentationFilters,
  DistClient,
  LifecycleData,
  LifestyleClient,
  SpendingBehaviorData,
  segmentationFilterValues,
} from '../interfaces/types';

@Injectable({
  providedIn: 'root',
})
export class SegmentationServiceService {
  constructor(private http: HttpClient) {}

  private origin = 'http://localhost:7055';

  getFilterValues() {
    return this.http.get<segmentationFilterValues>(
      `${this.origin}/Demographic_unique_values`
    );
  }

  demographicSegmentationInfo(filters: DemographicSegmentationFilters) {
    return this.http.post<DemographicSegmentationData>(
      `${this.origin}/Demographic_Segmentation_filters`,
      {
        cat_filters: { ...filters },
      }
    );
  }

  demographicSegmentationIdInfo(clientId: number) {
    return this.http.post<DemographicSegmentationData>(
      `${this.origin}/Demographic_Segmentation_Filter_ID`,
      { id: clientId }
    );
  }

  lifecycleInfo(filters: {
    Frequency: number[];
    Monetary: number[];
    Recency: number[];
    id?: number;
  }) {
    return this.http.post<LifecycleData>(
      `${this.origin}/Segment_Life_Cycle_filters`,
      {
        num_filters: { ...filters },
      }
    );
  }

  spendingBehaviorInfo(filters: {
    Frequency: number[];
    Monetary: number[];
    Recency: number[];
    id?: number;
  }) {
    return this.http.post<SpendingBehaviorData>(
      `${this.origin}/Spending_Behavior_filters`,
      {
        num_filters: { ...filters },
      }
    );
  }

  getClientsDistFilterValues() {
    return this.http.get<ClientsDistFilters>(
      `${this.origin}/Clients_Distribution_unique_values`
    );
  }

  clientsDistInfo(filters: { [index: string]: any[] }) {
    return this.http.post<DistClient[]>(
      `${this.origin}/Clients_Distribution_filters`,
      {
        cat_filters: { ...filters },
      }
    );
  }

  clientsDistIdInfo(clientId: number) {
    return this.http.post<DistClient[]>(
      `${this.origin}/Clients_Distribution_Filter_ID`,
      { id: clientId }
    );
  }

  lifestyleInfo() {
    return this.http.get<LifestyleClient[]>(`${this.origin}/Life_Style_Data`);
  }

  lifeStyleClientDetails(clientId: number) {
    return this.http.post<LifestyleClient>(
      `${this.origin}/Life_Style_ID_Data`,
      { id: clientId }
    );
  }
}
