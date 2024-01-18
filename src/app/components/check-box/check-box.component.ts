import { Component, EventEmitter, Input, Output } from '@angular/core';
import { checkbox_list_items } from 'src/app/interfaces/types';

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.css']
})
export class CheckBoxComponent {
  @Input() items: checkbox_list_items[] = [];
  @Output() items_event: EventEmitter<checkbox_list_items[]> = new EventEmitter<checkbox_list_items[]>();

  onSelectionChange(){
    this.items_event.emit(this.items)
  }
}
