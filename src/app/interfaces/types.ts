import { StringColumn } from 'igniteui-angular-charts';
import { Numeric } from 'igniteui-angular-core';
import {
  ApexAnnotations,
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexMarkers,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

export interface card_information {
  name: string;
  value: string;
  color?: string;
  trend?: 'up' | 'down';
}

export interface checkbox_list_items {
  name: string;
  title: string;
  checked: boolean;
}

export interface macro_api_names {
  name: string;
  freq: string;
  scale: number;
  yaxistitle: string;
  api: string;
  query: string;
}

export interface macro_limits {
  start: string;
  end: string;
}

export interface macro_series {
  dates: string[];
  values: number[];
}

export interface month_number {
  month: string;
  monthi: string;
}

export interface quarter_number {
  quarter: string;
  quarteri: string;
  monthi_start: number;
  monthi_end: number;
}

export interface genai_results {
  date: string;
  value: number;
}

export interface area_chart_options {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
  annotations: ApexAnnotations;
  tooltip: ApexTooltip;
  markers: ApexMarkers;
}

/*
 * name: the column name.
 * value: the name of the property in the dataSource that contains the value for this column.
 * type: the type of the column. can be either text or gauge.
 * max: maximum value of the column. (important if type is gauge)
 * min: minimum value of the column. (important if type is gauge)
 */
export interface Column {
  name: string;
  value: string;
  type: string;
  filter?: boolean;
  min?: number;
  max?: number;
}

export interface DropdownOption {
  label: string | number;
  value: any;
}

export interface tile {
  cols: number;
  rows: number;
  color: string;
}

/*
 * title: title of the slicer (feature name)
 * step: how much the value change when the slicer moves
 * min_val: minimum value of the slicer
 * max_val: maximum value of the slicer
 * min_val: current minimum value of the slicer (don't initialize it when creating the list, it is handled inside)
 * max_val: current maximum value of the slicer (don't initialize it when creating the list, it is handled inside)
 */
export interface num_slicer_init {
  title: string;
  step: number;
  min_val: number;
  max_val: number;
  cur_min?: number;
  cur_max?: number;
}
// when the slicer range changes, a list of this type is emitted
export interface num_slicer_selection {
  title: string;
  cur_min?: number;
  cur_max?: number;
}

export interface PdClient {
  id: number;
  job: string;
  years_emp: string;
  Marital_Status: number;
  marital_status_str: string;
  income: number;
  PD: number;
  class: number;
  Num_Dependents: number;
}

export interface PdClientLoan {
  loan_id: number;
  Purpose: string;
  installments: number;
  flat_interest_perc: number | string;
  vintage_date: Date | string;
  maturity_date: Date | string;
}

export interface PdLoanInfo {
  loan_id: number;
  purpose: string;
  interest: number;
  installments: number;
  vintage: string;
  maturity: string;
  lgd: number;
}

export interface PdFilterElements {
  date: string[];
  Marital_Status: number[];
  years_emp: string[];
  job: string[];
  Num_Dependents: number[];
}

export interface HouseAssetDetails {
  Area: number;
  Bathrooms: number;
  Bedrooms: number;
  City: string;
  Parking: number;
  Private_Garden: number;
  Prox_Hospital: number;
  Prox_Main_Street: number;
  Prox_School: number;
  Security: number;
  Type: string;
  Unit_Id: number;
}

export interface CarAssetDetails {
  Unit_Id: number;
  age: number;
  date: string;
  engineSize: number;
  fuelType: string;
  isVintage: number;
  mileage: number;
  model: string;
  mpg: number;
  tax: number;
  transmission: number;
}

export interface AssetPriceInfo {
  price_over_time: {
    date: string[];
    price: number[];
  };
  prediction_start: string;
  ECL: number;
}

export interface ECL {
  loan_id: number;
  ECL: number;
  EAD: number;
  Predicted_Price: number;
  date: string;
  PD: number;
}

export interface PdEvaluationScheme {
  eclEvaluation: { series: ApexAxisChartSeries; labels: string[] };
  pitEvaluation: { series: ApexAxisChartSeries; labels: string[] };
  lifeTimeEvaluation: { series: ApexAxisChartSeries; labels: string[] };
}

// Asset Data
export interface car_data_table_row {
  Unit_Id: number;
  model: string;
  transmission: string;
  fuelType: string;
  engineSize: number;
  mpg: number;
  tax: number;
  age: number;
  mileage: number;
}

export interface car_field_values_response {
  model: string[];
  transmission: string[];
  fuelType: string[];
  age: number[];
  mileage: number[];
  engineSize: number[];
  tax: number[];
  mpg: number[];
  date: string[];
  PredictedPrice: number[];
}

export interface get_id_car_info_response {
  info: car_data_table_row;
  predictions: line_chart_data;
  min_date: string;
  max_date: string;
}

export interface line_chart_data {
  date: string[];
  PredictedPrice: number[];
}

export interface house_data_table_row {
  Unit_Id: number;
  City: string;
  Type: string;
  Area: number;
  Bedrooms: number;
  Bathrooms: number;
  Security: number;
  Parking: number;
  Private_Garden: number;
  Prox_Hospital: number;
  Prox_School: number;
  Prox_Main_Street: number;
}

export interface house_field_values_response {
  Area: number[];
  Bathrooms: number[];
  Bedrooms: number[];
  City: string[];
  Type: string[];
  Parking: number[];
  Security: number[];
  Private_Garden: number[];
  date: string[];
  PredictedPrice: number[];
}

export interface get_id_house_info_response {
  info: house_data_table_row;
  predictions: line_chart_data;
  min_date: string;
  max_date: string;
}

export interface DemographicSegmentationClient {
  user_id: number;
  Person: string;
  Gender: string;
  cluster_labels: string;
  City: string;
  Age: number;
  Yearly_Income_Person: number;
  FICO_Score: number;
}

export interface DemographicSegmentationFilters {
  Address: string[];
  Age_Segment: number[];
  City: string[];
  FICO_Score: number[];
  Gender: string[];
  State: string[];
  Zipcode: number[];
}

export interface DemographicSegmentationData {
  Age_Segment_counts: { [index: number]: number };
  Demographic_Segmentation_Data: DemographicSegmentationClient[];
  Demographic_Segmentation_counts: { [index: string]: number };
  Education_Level_counts: { [index: number]: number };
  Gender_counts: { Female: number; Male: number };
  Num_Of_Kids_counts: { [index: number]: number };
  Yearly_Income_counts: { [index: string]: number };
  cluster_labels_counts: { [index: string]: number };
}

export interface segmentationFilterValues {
  Address: string[];
  Age_Segment: number[];
  City: string[];
  Education_Level: number[];
  FICO_Score: number[];
  Gender: string[];
  Num_Of_Kids: number[];
  State: string[];
  Zipcode: number[];
  Yearly_Income_segment: string[];
}

export interface LifecycleClient {
  User: number;
  Frequency: number;
  Monetary: number;
  Recency: number;
  Current_Segment: string;
  batch_0_segment: string;
  batch_1_segment: string;
  batch_2_segment: string;
  batch_3_segment: string;
  batch_4_segment: string;
  batch_5_segment: string;
}

export interface LifecycleData {
  Segment_Life_Cycle_Data: LifecycleClient[];
  Current_Segment_counts: { name: string; value: number }[];
  Batch_0_counts: { name: string; value: number }[];
  Batch_1_counts: { name: string; value: number }[];
  Batch_2_counts: { name: string; value: number }[];
  Batch_3_counts: { name: string; value: number }[];
  Batch_4_counts: { name: string; value: number }[];
  Batch_5_counts: { name: string; value: number }[];
}

export interface SpendingBehaviorClient {
  User: number;
  Recency: number;
  Monetary: number;
  Frequency: number;
  Gender_x: string;
  City_x: string;
  Yearly_Income_segment: string;
}

export interface SpendingBehaviorData {
  Spending_Behavior_Data: SpendingBehaviorClient[];
  Age_Segment_counts: { [index: number]: number };
  Demographic_Segment_counts: { name: string; value: number }[];
  Education_Level_counts: { [index: number]: number };
  Num_Of_Kids_counts: { [index: number]: number };
  Value_Based_Segment_counts: { name: string; value: number }[];
  Spending_Behavior_ID_Data: { Latitude: number; Longitude: number }[];
}

export interface ClientsDistFilters {
  Gender: string[];
  City: string[];
  State: string[];
}

export interface DistClient {
  User: number;
  Person: string;
  Current_Age: number;
  Retirement_Age: number;
  Longitude: number;
  Latitude: number;
  City: string;
  Gender: string;
}

export interface LifestyleClient {
  User: number;
  Person: string;
  Gender: string;
  City: string;
  Yearly_Income_segment: string;
  FICO_Score: number;
  Car_Behavior: string;
  Car_Rental: string;
  Car_services: string;
  Gas: string;
  Road_Fees: string;
  Transportation: string;
  travelling_behavior: string;
  Num_Of_Travels: number;
  Air_transportation: string;
  Airlines: string;
  Hotel_Reservation: string;
  Travel: string;
  Cruise_Lines: string;
}

export interface FraudTransTableRow {
  User: number;
  Card: number;
  Amount: string;
  FraudProbability: number;
  trans_id: number;
}


export interface FraudTransTable {
  data: FraudTransTableRow[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface Shap {
  variable: string;
  value: number;
}

export interface FraudFilters {
  'Merchant State': string[];
  'Datetime': string[];
}

export interface FraudAmountAnalysis {
  total: {Category: string, Amount: number}[];
  fraud_non_fraud: {Category: string, 'IS Fraud?': number, Amount: number}[];
}

export interface MuleAccountsTableRow {
  Account: string;
  Bank: number;
  "Mule Probability": number;
}
export interface MuleAccountsTable {
  data: MuleAccountsTableRow[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface MuleAccountTransTableRow {
  Timestamp: string;
  Bank: number;
  BeneficiaryAccount: string;
  BeneficiaryBank: number;
  AmountPaid: number;
  PaymedCurrency: string;
  'Mule Probability': number;
}

export interface MuleAccountTransTable {
  data: MuleAccountTransTableRow[];
  page: number;
  per_page: number;
  total: number;
  total_page: number;
}

export interface MuleBarChartElement {
  categories: string[];
  series: MuleTransAmountCurrency[];
}

export interface MuleTransAmountCurrency {
  name: string;
  data: number[]
}

export interface MuleTransMethods {
  "Payment Format": string[];
  count: number[];
}