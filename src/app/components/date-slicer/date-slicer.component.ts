import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-date-slicer',
  templateUrl: './date-slicer.component.html',
  styleUrls: ['./date-slicer.component.css']
})
export class DateSlicerComponent implements OnInit{
  
  @Input() min_val !: any;
  @Input() max_val !: any;
  @Output() curDateRange: EventEmitter<string[]> = new EventEmitter();
  cur_min!: Date;
  cur_max!: Date;

  ngOnInit() {
    this.min_val = new Date(this.min_val);
    this.max_val = new Date(this.max_val);
    this.cur_max = this.max_val;
    this.cur_min = this.min_val;
  }

  getDateFromNumber(val: number) {
    return new Date(val).toLocaleDateString('sv');
  }

  changeDateRanges() {
    this.curDateRange.emit([this.cur_min.toLocaleDateString('sv'), this.cur_max.toLocaleDateString('sv')])
  }
}
