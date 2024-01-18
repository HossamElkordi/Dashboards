import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';

import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HttpClientModule } from '@angular/common/http';
import { NgxGaugeModule } from 'ngx-gauge';
import {
  IgxGeographicMapModule,
  IgxGeographicSymbolSeriesModule,
} from 'igniteui-angular-maps';
import { IgxDataChartInteractivityModule } from 'igniteui-angular-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ProductsPageComponent } from './components/products-page/products-page.component';
import { ProductSelectorComponent } from './components/product-selector/product-selector.component';
import { MacroModuleComponent } from './module/macro/macro-module/macro-module.component';
import { PdModuleComponent } from './module/pd/pd-module/pd-module.component';
import { ModuleTopbarComponent } from './components/module-topbar/module-topbar.component';
import { CheckBoxComponent } from './components/check-box/check-box.component';
import { AreaChartComponent } from './components/area-chart/area-chart.component';
import { MicroModuleComponent } from './module/micro-module/micro-module.component';
import { ApprovalModuleComponent } from './module/approval-module/approval-module.component';
import { DateSlicerComponent } from './components/date-slicer/date-slicer.component';
import { GaugeComponent } from './components/gauge/gauge.component';
import { TableComponent } from './components/table/table.component';
import { TimeSeriesComponent } from './module/macro/time-series/time-series.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { NumSlicerComponent } from './components/num-slicer/num-slicer.component';
import { CardComponent } from './components/card/card.component';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ClientsFilterComponent } from './module/pd/clients-filter/clients-filter.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { ClientDetailsComponent } from './module/pd/client-details/client-details.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { LoanDetailsComponent } from './module/pd/loan-details/loan-details.component';
import { SliderComponent } from './components/slider/slider.component';
import { CarAssetComponent } from './module/asset/car-asset/car-asset.component';
import { HouseAssetComponent } from './module/asset/house-asset/house-asset.component';
import { SegmentationModuleComponent } from './module/segmentation/segmentation-module/segmentation-module.component';
import { FraudModuleComponent } from './module/fraud-module/fraud-module.component';
import { DemographicSegmentationComponent } from './module/segmentation/demographic-segmentation/demographic-segmentation.component';
import { LifecycleComponent } from './module/segmentation/lifecycle/lifecycle.component';
import { SpendingBehaviorComponent } from './module/segmentation/spending-behavior/spending-behavior.component';
import { GeographicMapComponent } from './components/geographic-map/geographic-map.component';
import { ClientsDistributionComponent } from './module/segmentation/clients-distribution/clients-distribution.component';
import { LifestyleComponent } from './module/segmentation/lifestyle/lifestyle.component';
import { SignUpComponent } from './auth/components/sign-up/sign-up.component';
import { VerifyEmailComponent } from './auth/components/verify-email/verify-email.component';
import { SignInComponent } from './auth/components/sign-in/sign-in.component';
import { FraudComponent } from './module/fraud/fraud.component';
import { HeaderComponent } from './components/header/header.component';
import { ForgetPasswordComponent } from './auth/components/forget-password/forget-password.component';
import { MuleAccountsComponent } from './module/mule/mule-accounts/mule-accounts.component';
import { MuleModuleComponent } from './module/mule/mule-module/mule-module.component';
import { MuleAccountTransactionsComponent } from './module/mule/mule-account-transactions/mule-account-transactions.component';
import { NboComponent } from './module/nbo/nbo.component';
import { CustomerInfoComponent } from './module/nbo/customer-info/customer-info.component';
import { CustomerAnalysisComponent } from './module/nbo/customer-analysis/customer-analysis.component';
import { ProdAnalysisComponent } from './module/nbo/prod-analysis/prod-analysis.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    ProductsPageComponent,
    ProductSelectorComponent,
    MacroModuleComponent,
    PdModuleComponent,
    ModuleTopbarComponent,
    CheckBoxComponent,
    MicroModuleComponent,
    ApprovalModuleComponent,
    AreaChartComponent,
    DateSlicerComponent,
    TimeSeriesComponent,
    GaugeComponent,
    TableComponent,
    DropdownComponent,
    CardComponent,
    NumSlicerComponent,
    ClientsFilterComponent,
    BarChartComponent,
    PieChartComponent,
    ClientDetailsComponent,
    LineChartComponent,
    LoanDetailsComponent,
    SliderComponent,
    CarAssetComponent,
    HouseAssetComponent,
    SegmentationModuleComponent,
    FraudModuleComponent,
    NboComponent,
    DemographicSegmentationComponent,
    LifecycleComponent,
    SpendingBehaviorComponent,
    GeographicMapComponent,
    ClientsDistributionComponent,
    LifestyleComponent,
    SignUpComponent,
    VerifyEmailComponent,
    SignInComponent,
    FraudComponent,
    HeaderComponent,
    ForgetPasswordComponent,
    MuleAccountsComponent,
    MuleModuleComponent,
    MuleAccountTransactionsComponent,
    CustomerInfoComponent,
    CustomerAnalysisComponent,
    ProdAnalysisComponent,
    NboComponent,
    ProgressSpinnerComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatGridListModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatNativeDateModule,
    MatMenuModule,
    MatSliderModule,
    MatCardModule,
    MatSlideToggleModule,
    FormsModule,
    NgApexchartsModule,
    NgxGaugeModule,
    IgxGeographicMapModule,
    IgxGeographicSymbolSeriesModule,
    IgxDataChartInteractivityModule,
    MatDialogModule,
    ScrollingModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
