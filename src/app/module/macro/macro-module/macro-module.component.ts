import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CheckBoxComponent } from 'src/app/components/check-box/check-box.component';
import { checkbox_list_items } from 'src/app/interfaces/types';
import { TimeSeriesComponent } from '../time-series/time-series.component';

@Component({
  selector: 'app-macro-module',
  templateUrl: './macro-module.component.html',
  styleUrls: ['./macro-module.component.css']
})
export class MacroModuleComponent implements AfterViewInit{

  constructor (private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.iconRegistry.addSvgIcon('rajhy', this.sanitizer.bypassSecurityTrustResourceUrl('../../../../../assets/rajhy_logo.svg'))
  }

  title: string = 'Macro-Economic Forecasting'
  module_name: string = 'macro'
  combined_charts: boolean = false;

  macroState = false;
  constState = false;

  @ViewChild('macro_checkbox') macro_checkbox!: CheckBoxComponent;
  @ViewChild('const_checkbox') const_checkbox!: CheckBoxComponent;
  @ViewChild('combined_ts') combined_ts!: TimeSeriesComponent;

  macro_list: checkbox_list_items[] = [
    {name: 'gdp', title: 'GDP', checked: false},
    {name: 'inf', title: 'Inflation', checked: false},
    {name: 'pop', title: 'Population', checked: false},
    {name: 'unemp', title: 'Unemployment Rate', checked: false},
    {name: 'cpi', title: 'CPI', checked: false},
    {name: 'gas', title: 'Gasoline Price', checked: false},
    {name: 'tasi', title: 'TASI', checked: false},
    {name: 'hpi', title: 'HPI', checked: false}
  ]

  const_list: checkbox_list_items[] = [
    {name: 'bcem', title: 'Black Cement', checked: false},
    {name: 'wcem', title: 'White Cement', checked: false},
    {name: 'conc', title: 'Concrete', checked: false},
    {name: 'sand', title: 'Sand', checked: false},
    {name: 'iron', title: 'Iron', checked: false},
    {name: 'bl', title: 'Blocks', checked: false}
  ]

  selected_list: string[] = []

  y_charts_init_start_date: string = '2018-01-31'
  y_charts_init_end_date: string = '2023-06-30'

  onSelectionChange(list: checkbox_list_items[]){
    
    let selected = list.filter(item => item.checked)
    let not_selected = list.filter(item => !item.checked)
    
    for (let i = 0; i < selected.length; i++) {
      let index = this.selected_list.indexOf(selected[i].name, 0)
      if(index == -1){
        this.selected_list = [selected[i].name, ...this.selected_list]
      }
    }

    for (let i = 0; i < not_selected.length; i++) {
      let index = this.selected_list.indexOf(not_selected[i].name)
      if(index != -1){
        this.selected_list.splice(index, 1)
      }
    }

    if(this.combined_charts && this.combined_ts !== undefined){
      this.update_combined_chart()
      if(this.combined_ts.show_cards){
        this.combined_ts.ejadaYearly()
      }
    }
  }

  update_combined_chart(){
    if(this.combined_charts) {
      this.combined_ts.vars = this.selected_list
      this.combined_ts.vars_apis = this.combined_ts.apis.filter(obj => this.combined_ts.vars?.includes(obj.name))
      this.combined_ts.setDateLimitMulti()
      let start = (this.combined_ts.date_slicer !== undefined) ? this.combined_ts.date_slicer.cur_min : new Date(this.combined_ts.init_start_date) 
      let end = (this.combined_ts.date_slicer !== undefined) ? this.combined_ts.date_slicer.cur_max : new Date(this.combined_ts.init_end_date)
      
      let startYear = start.toLocaleString("default", { year: "numeric" });
      let endYear = end.toLocaleString("default", { year: "numeric" });

      let startMonth = start.toLocaleString("default", { month: "2-digit" });
      let endMonth = end.toLocaleString("default", { month: "2-digit" });

      let startDay = start.toLocaleString("default", { day: "2-digit" });
      let endDay = end.toLocaleString("default", { day: "2-digit" });

      this.combined_ts.setSeriesChartMulti(`${startYear}-${startMonth}-${startDay}`, `${endYear}-${endMonth}-${endDay}`)
    }
  }

  ngAfterViewInit(){
    this.macro_list.forEach(element => {
      this.macro_checkbox.items.push(element)
    });
    this.const_list.forEach(element => {
      this.const_checkbox.items.push(element)
    });
  }
}
