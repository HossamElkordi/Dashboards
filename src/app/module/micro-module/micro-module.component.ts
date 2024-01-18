import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { LineChartComponent } from 'src/app/components/line-chart/line-chart.component';
import { Column } from 'src/app/interfaces/types';

@Component({
  selector: 'app-micro-module',
  templateUrl: './micro-module.component.html',
  styleUrls: ['./micro-module.component.css'],
})
export class MicroModuleComponent implements OnInit {
  table_cols_names: Column[] = [
    { name: 'Client Name', value: 'customer_name', type: 'text' },
    { name: 'Client ID', value: 'Customer_ID', type: 'text' },
    { name: 'Annual Income', value: 'Annual_Income', type: 'text' },
    { name: 'Interest Rate', value: 'Interest_Rate', type: 'text' },
    { name: 'Collection Score', value: 'credit_score', type: 'text' },
  ];

  @ViewChild(LineChartComponent) lineChart!: LineChartComponent;

  table_data_: any[] = [];
  currentCreditScore: number = 0;
  // Collection_Score_History: any[];
  clientName: string = '';
  names: string[] = [];
  table_data!: MatTableDataSource<any>;
  searchForm!: FormGroup;
  selectedClient: any;
  apiUrl = 'http://localhost:7053';
  client_details: any[] = [
    { name: 'Name', value: '_' },
    { name: 'ID', value: '_' },
    { name: 'Occupation', value: '_' },
    { name: 'Age', value: '_' },
    { name: 'Monthly Salary', value: '_' },
    { name: 'Annual Salary', value: '_' },
  ];
  historical_details: any[] = [
    { name: 'Number of Bank Accounts', value: '_' },
    { name: 'Interest Rate', value: '_' },
    { name: 'Number of Credit Cards', value: '_' },
    { name: 'Credit History Age', value: '_' },
    { name: 'Delayed Payments', value: '_' },
  ];
  Collection_Score_History_Labels: string[] = [''];
  Collection_Score_History_Values: number[] = [];

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({ searchTerm: [''] });
    this.Collection_Score_History_Labels = ['Jan', 'Feb', 'Mar', 'Apr'];
    this.Collection_Score_History_Values = [0, 0, 0, 0];
    this.fetchData();
  }

  private fetchData(): void {
    this.http.get<any[]>(`${this.apiUrl}/get_data`).subscribe((data) => {
      this.names = this.generateDummyNames(225);
      this.table_data = new MatTableDataSource(
        data.map((item, index) => ({
          ...item,
          customer_name: this.names[index],
          Annual_Income: this.formatSalary(item.Annual_Income),
          credit_score: this.formatCreditScore(item.credit_score),
        }))
      );
    });
  }

  formatSalary(value: number): string {
    return parseInt(value.toString(), 10).toLocaleString('en-US');
  }

  formatCreditScore(value: number): string {
    return Math.round(value).toString();
  }

  private generateDummyNames(count: number): string[] {
    const firstNames = [
      'Amr',
      'Mohamed',
      'Malik',
      'Ibrahim',
      'Sarah',
      'Ahmed',
      'Hassan',
      'Hamza',
      'Khalid',
      'Omar',
      'Bilal',
      'Abbas',
      'Bassem',
      'Ali',
      'Salma',
      'Farah',
      'Amal',
      'Hadi',
      'Adnan',
      'Doaa',
      'Ehab',
      'Gabir',
      'Nabil',
      'Cadi',
      'Amir',
      'Tamer',
      'Wagih',
      'Yones',
      'Zaky',
    ];
    const lastNames = [
      'Amr',
      'Mohamed',
      'Malik',
      'Ibrahim',
      'Ahmed',
      'Hassan',
      'Hamza',
      'Khalid',
      'Omar',
      'Bilal',
      'Abbas',
      'Bassem',
      'Ali',
      'Hadi',
      'Adnan',
      'Amir',
    ];
    const names: string[] = [];

    while (names.length < count) {
      const firstName = this.getRandomElement(firstNames);
      const lastName = this.getRandomElement(lastNames);
      const fullName = `${firstName} ${lastName}`;

      if (!names.includes(fullName)) {
        names.push(fullName);
      }
    }

    return names;
  }

  private getRandomElement(array: any[]): any {
    return array[Math.floor(Math.random() * array.length)];
  }

  onSearch(): void {
    const searchTerm = this.searchForm.get('searchTerm')?.value.toLowerCase();
    this.table_data.filter = searchTerm;
  }

  selectClient(data: columns_table_data) {
    this.selectedClient = data;
    this.currentCreditScore = this.selectedClient.credit_score;
    this.clientName = this.selectedClient.customer_name;
    this.fetchClientInfo(data.Customer_ID);
  }

  private fetchClientInfo(id: string): void {
    this.http.get<any>(`${this.apiUrl}/id_info/${id}`).subscribe(
      (data) => {
        this.updateClientDetails(data);
      },
      (error) => {
        console.error('Error fetching client info:', error);
      }
    );
  }

  private updateClientDetails(clientData: columns_table_data): void {
    this.client_details = [
      { name: 'Name', value: this.clientName },
      { name: 'ID', value: clientData.Customer_ID },
      { name: 'Occupation', value: clientData.Occupation },
      { name: 'Age', value: clientData.Age },
      {
        name: 'Monthly Salary',
        value: this.formatSalary(
          parseFloat(clientData.Monthly_Inhand_Salary.toString())
        ),
      },
      {
        name: 'Annual Salary',
        value: this.formatSalary(
          parseFloat(clientData.Annual_Income.toString())
        ),
      },
    ];

    this.historical_details = [
      { name: 'Number of Bank Accounts', value: clientData.Num_Bank_Accounts },
      { name: 'Interest Rate', value: clientData.Interest_Rate },
      { name: 'Number of Credit Cards', value: clientData.Num_Credit_Card },
      { name: 'Credit History Age', value: clientData.Credit_History_Age },
      { name: 'Delayed Payments', value: clientData.Num_of_Delayed_Payment },
    ];

    this.Collection_Score_History_Values = clientData.credit_score;
    this.lineChart.chartSeries = [
      {
        name: 'Collection Score History',
        data: this.Collection_Score_History_Values,
      },
    ];
    console.log(this.Collection_Score_History_Values);
  }
}

class columns_table_data {
  Customer_ID!: string;
  customer_name!: string;
  credit_score!: number[];
  // credit_score!: number;
  Occupation: string;
  Monthly_Inhand_Salary: number | string;
  Annual_Income: number | string;
  Age: number | string;
  Credit_History_Age: number | string;
  Interest_Rate: number | string;
  Num_of_Delayed_Payment: number | string;
  loan_types: string;
  Num_Bank_Accounts: number | string;
  Num_Credit_Card: number | string;
  constructor(
    loan_types: string,
    Occupation: string,
    Monthly_Inhand_Salary: number | string,
    Annual_Income: number | string,
    Age: number | string,
    Credit_History_Age: number | string,
    Interest_Rate: number | string,
    Num_Bank_Accounts: number | string,
    Num_Credit_Card: number | string,
    Num_of_Delayed_Payment: number | string
  ) {
    this.Occupation = Occupation;
    this.Monthly_Inhand_Salary = Monthly_Inhand_Salary;
    this.Annual_Income = Annual_Income;
    this.Age = Age;
    this.Credit_History_Age = Credit_History_Age;
    this.Interest_Rate = Interest_Rate;
    this.Num_of_Delayed_Payment = Num_of_Delayed_Payment;
    this.loan_types = loan_types;
    this.Num_Bank_Accounts = Num_Bank_Accounts;
    this.Num_Credit_Card = Num_Credit_Card;
  }
}
