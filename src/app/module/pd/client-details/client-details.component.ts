import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CardComponent } from 'src/app/components/card/card.component';
import { CheckBoxComponent } from 'src/app/components/check-box/check-box.component';
import {
  Column,
  PdClient,
  PdClientLoan,
  checkbox_list_items,
} from 'src/app/interfaces/types';
import { PdServiceService } from 'src/app/services/pd-service.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css'],
})
export class ClientDetailsComponent {
  constructor(private pdService: PdServiceService) {}

  clientId!: number;
  clientInfo!: { name: string; value: any }[];
  events: { [index: string]: { start_date: string; end_date: string } } = {};
  checkbox_items!: checkbox_list_items[];
  clientLoans!: MatTableDataSource<PdClientLoan>;
  tableData$!: Observable<PdClientLoan[]>;

  selectedLoan: PdClientLoan | null = null;
  viewedLoan: PdClientLoan | null = null;

  pieChartTitle: string = 'Client Spending Distribution';
  pieChartSeries!: number[];
  pieChartLabels!: string[];
  pieChartData$!: Observable<{ amount: number; category: string }[]>;

  barChartTitle: string = 'Client Spending across Time';
  barChartSeries!: { name: string; data: number[] }[];
  barChartLabels!: string[];
  barChartData$!: Observable<{ amount: number[]; date_time: string[] }>;

  @Output() viewLoan = new EventEmitter<any>();

  columns: Column[] = [
    { name: 'Loan Id', value: 'loan_id', type: 'text' },
    { name: 'Purpose', value: 'Purpose', type: 'text' },
    { name: 'Installments', value: 'installments', type: 'text' },
    { name: 'Interest', value: 'flat_interest_perc', type: 'text' },
    { name: 'Vintage Date', value: 'vintage_date', type: 'text' },
    { name: 'Maturity Date', value: 'maturity_date', type: 'text' },
  ];

  @ViewChild(CardComponent) card!: CardComponent;
  @ViewChild(CheckBoxComponent) checkboxes!: CheckBoxComponent;

  @Input() set client(selectedClient: PdClient | null) {
    if (selectedClient !== null) {
      this.clientId = selectedClient.id;

      this.getClientDetails();
      this.getClientSpendingDistribution();
      this.getClientEvents();
      this.getClientSpendingOverTime();
      this.getClientLoans();
    }
  }

  getClientDetails() {
    this.pdService.getClientDetails(this.clientId).subscribe((clients) => {
      this.clientInfo = [
        { name: 'Client ID', value: clients[0].id },
        {
          name: 'Marital Status',
          value: clients[0].Marital_Status ? 'Married' : 'Not Married',
        },
        {
          name: 'Number of Dependents',
          value: clients[0].Num_Dependents,
        },
        { name: 'Class', value: clients[0].class },
        { name: 'Job Title', value: clients[0].job },
        {
          name: 'Years of Experience',
          value: clients[0].years_emp,
        },
      ];
      this.card.information = this.clientInfo;
    });
  }

  getClientSpendingDistribution() {
    this.pieChartData$ = this.pdService
      .getClientSpendingDistribution(this.clientId)
      .pipe(
        tap((spendingData) => {
          spendingData.sort((a, b) => b.amount - a.amount);
          const displayNumber = 5;
          const categories = spendingData.map(
            (spendingItem) => spendingItem.category
          );
          const amounts = spendingData.map(
            (spendingItem) => spendingItem.amount
          );

          let labels = [...categories.slice(0, displayNumber)];
          let series = [...amounts.slice(0, displayNumber)];

          const notDisplayedNumber = spendingData.length - displayNumber;
          if (notDisplayedNumber > 0) {
            const notDisplayedSum = amounts
              .slice(displayNumber)
              .reduce((prev, curr) => prev + curr, 0);
            labels.push('Other');
            series.push(notDisplayedSum);
          }

          this.pieChartLabels = labels;
          this.pieChartSeries = series;
        })
      );
  }

  getClientEvents() {
    this.pdService.getClientEvents(this.clientId).subscribe((eventsData) => {
      this.checkbox_items = [];
      eventsData.forEach((eventData) => {
        this.events[eventData.event] = {
          start_date: eventData.start_date,
          end_date: eventData.end_date,
        };

        this.checkbox_items.push({
          name: eventData.event,
          title: eventData.event,
          checked: false,
        });
      });
      this.checkboxes.items = this.checkbox_items;
    });
  }

  fillBarChart(data: { date_time: string[]; amount: number[] }) {
    this.barChartLabels = data.date_time;
    this.barChartSeries = [{ name: 'Spendings', data: data.amount }];
  }

  getClientSpendingOverTime() {
    this.barChartData$ = this.pdService
      .getClientSpendingOverTime(this.clientId)
      .pipe(tap((data) => this.fillBarChart(data)));
  }

  getClientSpendingWithinTimeRange(start_date: string, end_date: string) {
    this.barChartData$ = this.pdService
      .getClientSpendingOverTimeWithinRange(this.clientId, start_date, end_date)
      .pipe(tap((data) => this.fillBarChart(data)));
  }

  getClientLoans() {
    this.tableData$ = this.pdService.getClientLoans(this.clientId).pipe(
      tap((data) => {
        data.forEach((loan) => {
          loan.flat_interest_perc =
            Number(loan.flat_interest_perc).toFixed(3) + '%';
          loan.installments = Math.round(loan.installments);
          loan.vintage_date = new Date(loan.vintage_date).toLocaleDateString();
          loan.maturity_date = new Date(
            loan.maturity_date
          ).toLocaleDateString();
        });
        this.clientLoans = new MatTableDataSource(data);
      })
    );
  }

  handleCheckEvents(items: checkbox_list_items[]) {
    let startDate: string | null = null;
    let endDate: string | null = null;
    items.forEach((item) => {
      if (item.checked) {
        const itemStartDate = this.events[item.name].start_date;
        const itemEndDate = this.events[item.name].end_date;
        if (
          startDate === null ||
          new Date(itemStartDate) < new Date(startDate)
        ) {
          startDate = itemStartDate;
        }
        if (endDate === null || new Date(itemEndDate) > new Date(endDate)) {
          endDate = itemEndDate;
        }
      }
    });
    if (startDate && endDate)
      this.getClientSpendingWithinTimeRange(startDate, endDate);
    else this.getClientSpendingOverTime();
  }

  viewLoanDetails(loan: PdClientLoan) {
    this.viewedLoan = loan;
    this.selectedLoan = loan;
    this.viewLoan.emit(this.viewedLoan);
  }
}
