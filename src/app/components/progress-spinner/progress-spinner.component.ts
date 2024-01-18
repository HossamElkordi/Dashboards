import { Component, Input } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.css']
})
export class ProgressSpinnerComponent {
  
  mode!: number;
  type!: string;

  @Input() set typeVal(t: string) {
    if(t == 'spin' || t == 'bar')
      this.type = t;
    else  
      this.type = 'spin';
  }


  @Input() set modeVal(m: number) {
    this.mode = m;
  }

  @Input() value!: number;


}
