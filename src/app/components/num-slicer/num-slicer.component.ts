import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { num_slicer_init, num_slicer_selection } from 'src/app/interfaces/types';
import { DarkThemeService } from 'src/app/dark-theme.service';

@Component({
  selector: 'app-num-slicer',
  templateUrl: './num-slicer.component.html',
  styleUrls: ['./num-slicer.component.css']
})
export class NumSlicerComponent implements OnInit{
  

  isDarkTheme = false;

  constructor(private darkThemeService: DarkThemeService) { }


  @Input() slicers!: num_slicer_init[];
  @Output() selection: EventEmitter<num_slicer_selection[]> = new EventEmitter<num_slicer_selection[]>();


  cur_selection!: num_slicer_selection[];

  emit_selection(){

    this.cur_selection = this.slicers.map(function(slicer) {
      return {
        title: slicer.title,
        cur_min: slicer.cur_min,
        cur_max: slicer.cur_max
      }
    })
    this.selection.emit(this.cur_selection);
  }

  ngOnInit(){
    this.darkThemeService.isDarkTheme$.subscribe((isDark) => {
      this.isDarkTheme = isDark;
    });
    for (let i = 0; i < this.slicers.length; i++) {
      this.slicers[i].cur_min = this.slicers[i].min_val
      this.slicers[i].cur_max = this.slicers[i].max_val
    }
  }
}
