import { Component, Input, ViewChild } from '@angular/core';
import { AreaChartComponent } from 'src/app/components/area-chart/area-chart.component';
import { CardComponent } from 'src/app/components/card/card.component';
import { SliderComponent } from 'src/app/components/slider/slider.component';
import { PdClientLoan, PdEvaluationScheme } from 'src/app/interfaces/types';
import { PdServiceService } from 'src/app/services/pd-service.service';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css'],
})
export class LoanDetailsComponent {
  constructor(private pdService: PdServiceService) {}

  @ViewChild('expensesSlider') expensesSlider!: SliderComponent;
  @ViewChild('rocSlider') rocSlider!: SliderComponent;
  @ViewChild('assetCard') assetCard!: CardComponent;
  @ViewChild('assetPriceChart') assetPriceChart!: AreaChartComponent;
  @ViewChild('pdEvalChart') pdEvalChart!: AreaChartComponent;

  loanId!: number;
  loanInfo: { name: string; value: any }[] = [];
  loanMoreInfo = [
    { name: 'ECL', value: '' },
    { name: 'RAROC', value: '' },
    { name: 'RORAC', value: '' },
  ];

  selectedEvaluation: string = 'ECL';
  pdEvaluation: PdEvaluationScheme = {
    eclEvaluation: { labels: [], series: [] },
    pitEvaluation: { labels: [], series: [] },
    lifeTimeEvaluation: { labels: [], series: [] },
  };

  ngOnInit() {
    this.getInitialRarocRoracFilterValues();
  }

  @Input() set loan(selectedLoan: PdClientLoan | null) {
    if (selectedLoan !== null) {
      this.assetPriceChart.chart_options.chart.height = 205;
      this.pdEvalChart.chart_options.chart.height = 180;
      if (window.innerHeight <= 650) {
        this.assetPriceChart.chart_options.chart.height = 160;
        this.pdEvalChart.chart_options.chart.height = 140;
      }
      this.loanInfo = [];
      this.loanMoreInfo = [
        { name: 'ECL', value: '' },
        { name: 'RAROC', value: '' },
        { name: 'RORAC', value: '' },
      ];
      this.loanId = selectedLoan.loan_id;
      this.getLoanDetails();
      this.getCurrRarocRorac();
      this.getAssetPriceInfo();
      this.getLoanECL();
      this.getLifeTimePd();
    }
  }

  getLoanDetails() {
    this.pdService.getLoanDetails(this.loanId).subscribe((data) => {
      this.loanInfo = [
        { name: 'Loan ID', value: data.loan_id },
        { name: 'Loan Purpose', value: data.purpose },
        {
          name: 'Interest',
          value: Math.round(data.interest * 1000) / 1000 + '%',
        },
        { name: 'Installments', value: Math.round(data.installments) },
        { name: 'LGD', value: String(Math.round(data.lgd * 1e5) / 1e3) + '%' },
        {
          name: 'Vintage Date',
          value: new Date(data.vintage).toLocaleDateString(),
        },
        {
          name: 'Maturity Date',
          value: new Date(data.maturity).toLocaleDateString(),
        },
        ...this.loanInfo,
      ];

      this.getAssetDetails(data.purpose);
    });
  }

  getAssetDetails(loanPurpose: string) {
    if (loanPurpose === 'car') this.getCarDetails();
    else if (loanPurpose === 'house') this.getHouseDetails();
  }

  getCarDetails() {
    this.assetCard.title = 'Car Details';
    this.pdService.getCarDetails(this.loanId).subscribe((data) => {
      this.assetCard.information = [
        { name: 'Unit ID', value: data.Unit_Id.toString() },
        { name: 'Model', value: data.model },
        { name: 'Transmission', value: data.transmission.toString() },
        { name: 'Fuel Type', value: data.fuelType },
        { name: 'Engine Size', value: data.engineSize.toString() },
        { name: 'Miles per Galon (MPG)', value: data.mpg.toString() },
        { name: 'Tax', value: data.tax.toString() },
        {
          name: 'Vintage/Normal',
          value: data.isVintage ? 'Vintage' : 'Normal',
        },
        {
          name: 'Mileage Per Year',
          value: (data.mileage / data.age).toFixed(3),
        },
      ];
    });
  }

  getHouseDetails() {
    this.assetCard.title = 'House Details';
    this.pdService.getHouseDetails(this.loanId).subscribe((data) => {
      this.assetCard.information = [
        { name: 'Unit ID', value: data.Unit_Id.toString() },
        { name: 'City', value: data.City },
        { name: 'Type', value: data.Type },
        { name: 'Area', value: data.Area.toString() + ' squared meters' },
        { name: 'Bedrooms', value: data.Bedrooms.toString() },
        { name: 'Bathrooms', value: data.Bathrooms.toString() },
        {
          name: 'Security',
          value: data.Security ? 'Security Available' : 'No Security',
        },
        {
          name: 'Parking',
          value: data.Parking ? 'Parking Available' : 'No Parking',
        },
        {
          name: 'Private Garden',
          value: data.Private_Garden
            ? 'Private Garden Available'
            : 'No Private Garden',
        },
        {
          name: 'Hospital Proximity',
          value: data.Prox_Hospital ? 'Near' : 'Far',
        },
        { name: 'School Proximity', value: data.Prox_School ? 'Near' : 'Far' },
        {
          name: 'Main Street Proximity',
          value: data.Prox_Main_Street ? 'Near' : 'Far',
        },
      ];
    });
  }

  getInitialRarocRoracFilterValues() {
    this.pdService.getInitRarocRoracFilterValues().subscribe((data) => {
      [this.expensesSlider.min, this.expensesSlider.max] =
        data.expenses_percentage;
      this.expensesSlider.value = this.expensesSlider.min;

      [this.rocSlider.min, this.rocSlider.max] = data.roc_percentage;
      this.rocSlider.value = this.rocSlider.min;
    });
  }

  getCurrRarocRorac() {
    const expenses_percentage = this.expensesSlider.value;
    const roc_percentage = this.rocSlider.value;
    this.pdService
      .getRarocRorac(this.loanId, expenses_percentage, roc_percentage)
      .subscribe((data) => {
        this.loanMoreInfo[1].value = data.RAROC.toFixed(3) + '%';
        this.loanMoreInfo[2].value = data.RORAC.toFixed(3) + '%';
      });
  }

  getAssetPriceInfo() {
    this.pdService.getAssetPriceInfo(this.loanId).subscribe((data) => {
      const xaxis = data.price_over_time.date;
      const yaxis = [
        { name: 'Price', data: data.price_over_time.price, color: '#0744A2' },
      ];
      const title = 'Asset Price Over Time';

      this.assetPriceChart.setChartSeries(xaxis, yaxis, '', '');
      if (
        new Date(xaxis[xaxis.length - 1]) >= new Date(data.prediction_start)
      ) {
        this.assetPriceChart.setChartAnnotation(
          data.prediction_start,
          xaxis[xaxis.length - 1],
          'Prediction Start'
        );
      }
      this.loanMoreInfo[0].value = data.ECL.toFixed(3);
    });
  }

  getLoanECL() {
    this.pdService.getLoanECL(this.loanId).subscribe(async (data) => {
      const dates = data.map((dataObj) => dataObj.date);
      const eclVals = data.map((dataObj) =>
        dataObj.ECL <= 0 ? 0 : Math.log10(dataObj.ECL)
      );
      const outstandingVals = data.map((dataObj) => Math.log10(dataObj.EAD));
      const recoveryVals = data.map((dataObj) =>
        Math.log10(dataObj.Predicted_Price)
      );

      const pds = data.map((dataObj) => dataObj.PD);

      this.pdEvaluation.pitEvaluation = {
        labels: dates,
        series: [{ name: 'Point in Time PD', data: pds, color: '#12239E' }],
      };

      this.loanInfo = [
        ...this.loanInfo,
        { name: '12-month PD', value: pds[12].toFixed(3) },
      ];

      this.pdEvaluation.eclEvaluation = {
        labels: dates,
        series: [
          {
            name: 'Outstanding Balance',
            data: outstandingVals,
            color: '#118DFF',
          },
          { name: 'ECL', data: eclVals, color: '#12239E' },
          { name: 'Recovery', data: recoveryVals, color: '#E66C37' },
        ],
      };

      this.updateEvaluationChart('ECL');
    });
  }

  getPitPd() {
    this.pdService.getPitPD(this.loanId).subscribe((data) => {
      const dates = data.map((dataObj) => dataObj.date);
      const pds = data.map((dataObj) => dataObj.PD);

      this.pdEvaluation.pitEvaluation = {
        labels: dates,
        series: [{ name: 'Point in Time PD', data: pds, color: '#12239E' }],
      };
    });
  }

  getLifeTimePd() {
    this.pdService.getLifeTimePD(this.loanId).subscribe((data) => {
      const dates = data.map((dataObj) => dataObj.date);
      const pds = data.map((dataObj) => dataObj.PD);

      this.pdEvaluation.lifeTimeEvaluation = {
        labels: dates,
        series: [{ name: 'Lifetime PD', data: pds, color: '#12239E' }],
      };
    });
  }

  updateEvaluationChart(evalMetric: string) {
    this.selectedEvaluation = evalMetric;
    if (evalMetric === 'ECL') {
      this.pdEvalChart.setChartSeries(
        this.pdEvaluation.eclEvaluation.labels,
        this.pdEvaluation.eclEvaluation.series,
        '',
        ''
      );

      this.pdEvalChart.chart_options.yaxis = {
        opposite: false,
        labels: {
          formatter: function (val) {
            return val == 0 ? '0' : (10 ** val).toFixed(0);
          },
          style: { colors: '#044492' },
        },
      };
    } else if (evalMetric === 'PIT') {
      this.pdEvalChart.setChartSeries(
        this.pdEvaluation.pitEvaluation.labels,
        this.pdEvaluation.pitEvaluation.series,
        '',
        ''
      );
      this.pdEvalChart.chart_options.yaxis = {
        opposite: false,
        labels: {
          formatter: function (val) {
            return val.toFixed(3);
          },
          style: { colors: '#044492' },
        },
      };
    } else if (evalMetric === 'lifetime') {
      this.pdEvalChart.setChartSeries(
        this.pdEvaluation.lifeTimeEvaluation.labels,
        this.pdEvaluation.lifeTimeEvaluation.series,
        '',
        ''
      );
      this.pdEvalChart.chart_options.yaxis = {
        opposite: false,
        labels: {
          formatter: function (val) {
            return val.toFixed(3);
          },
          style: { colors: '#044492' },
        },
      };
    }
  }
}
