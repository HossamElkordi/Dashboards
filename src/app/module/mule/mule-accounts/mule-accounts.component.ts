import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Column, MuleAccountsTable, MuleAccountsTableRow, MuleTransAmountCurrency } from 'src/app/interfaces/types';
import { MuleServiceService } from 'src/app/services/mule-service.service';
import { Observable, catchError, map, min, startWith, switchMap } from 'rxjs';
import { TableComponent } from 'src/app/components/table/table.component';
import { GaugeComponent } from 'src/app/components/gauge/gauge.component';
import { PieChartComponent } from 'src/app/components/pie-chart/pie-chart.component';
import { BarChartComponent } from 'src/app/components/bar-chart/bar-chart.component';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { AreaChartComponent } from 'src/app/components/area-chart/area-chart.component';

@Component({
  selector: 'app-mule-accounts',
  templateUrl: './mule-accounts.component.html',
  styleUrls: ['./mule-accounts.component.css']
})
export class MuleAccountsComponent implements AfterViewInit, OnInit{
  constructor (private http: MuleServiceService) {}

  columns: Column[] = [
    { name: 'Account Number', value: 'Account', type: 'text' },
    { name: 'Bank', value: 'Bank', type: 'text' },
    { name: 'Mule (%)', value: 'Mule Probability', type: 'gauge', min: 0, max: 100 }
  ];

  @ViewChild(TableComponent) table!: TableComponent;
  @ViewChild(GaugeComponent) guage!: GaugeComponent;
  @ViewChild(PieChartComponent) piechart!: PieChartComponent;
  @ViewChild(BarChartComponent) barchart!: BarChartComponent;
  @ViewChild(AreaChartComponent) areachart!: AreaChartComponent;

  @Output() viewAccount = new EventEmitter<any>();
  
  selectedAccount: MuleAccountsTableRow | null = null;
  viewedAccount: MuleAccountsTableRow | null = null;
  accountsData!: MuleAccountsTableRow[];
  accountsTable!: MatTableDataSource<MuleAccountsTableRow>;
  guageValue!: number;
  timeStampCurrency!: string[];
  amountPerCurrency!: ApexAxisChartSeries;

  getTransAmountPerCurrencyPerTime() {
    this.http.get_trans_amount_per_currency().subscribe((res) => {
      this.timeStampCurrency = res.categories.map((value) => new Date(value).toDateString());
      let colors = [
        "#6151fd", "#a6fbf4", "#35b511", "#80758f", "#790f2e", "#74e38d", "#8f9e09",
        "#4e3414", "#5af9bd", "#daf64c", "#73124b", "#472654", "#b35ffc", "#f33347",
        "#1e1ce1"]
      let seriesB: MuleTransAmountCurrency[] = res.series;

      this.amountPerCurrency = []
      for (let index = 0; index < seriesB.length; index++) {
        this.amountPerCurrency.push({name: seriesB[index].name, data: seriesB[index].data, color: colors[index]});
      }
      this.areachart.setChartSeries(
        this.timeStampCurrency,
        this.amountPerCurrency,
        'Total Transaction Amount Per Currency Across Time',
        'Amount (Billion)'
      )
      this.areachart.setChartType('line')
     this.areachart.chart_options.chart.height = 280
     this.areachart.chart_options.yaxis.labels = {
      "formatter": function (val) {
        let formatted_val = val / 1000000000;
        if (formatted_val > 1) {
          return Number(formatted_val.toFixed(3))
                  .toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 3})
        }
        else
         return Number(formatted_val.toFixed(10))
                  .toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 7})
        },
      "style": {'colors': '#044492'}
    }
    })
  }
  getAverageMulePercentage(account: MuleAccountsTableRow|null) {
    this.selectedAccount = account;
    let obsv: Observable<number>
    if (this.selectedAccount) {
      obsv = this.http.get_avg_mule_percentage(this.selectedAccount!.Account, this!.selectedAccount!.Bank)
    }
    else {
      obsv = this.http.get_avg_mule_percentage(null, null);
    }
    obsv.subscribe((res) => {
      this.guage.gaugeValue = res;
    })
  }
  getAccountsTable() {
    this.table.paginator.page.pipe(
      startWith({}),
      switchMap(() => {
        return this.http.get_table(
          this.table.paginator.pageIndex + 1,
          this.table.paginator.pageSize
        ).pipe(catchError(() => new Observable<MuleAccountsTable>()));
      }),
      map((res) => {
        if (res == null) return [];
        this.table.totalData = res.total
        setTimeout(()=>{this.table.paginator.length = res.total; this.table.pageIndex = res.page - 1})
        return res.data;
      })
    )
    .subscribe((acc_data) => {
      this.accountsData = acc_data;
      this.accountsData.forEach(element => {
        element['Mule Probability'] = (element['Mule Probability'] * 100 as unknown as number).toFixed(3) as unknown as number;
      });
      this.accountsTable = new MatTableDataSource(this.accountsData);
    });
  }
  viewAccountDetails(account: MuleAccountsTableRow) {
    this.viewedAccount = account;
    this.selectedAccount = account;
    this.viewAccount.emit(this.viewedAccount);
  }
  getTransactionMethods() {
    this.http.get_trans_methods().subscribe((res) => {
      this.piechart.series = res.count;
      this.piechart.labels = res['Payment Format']
    })
  }
  ngAfterViewInit(){
    this.getAccountsTable();
    this.getAverageMulePercentage(null);
    this.getTransactionMethods();
  }
  ngOnInit() {
    this.getTransAmountPerCurrencyPerTime();
  }
}
