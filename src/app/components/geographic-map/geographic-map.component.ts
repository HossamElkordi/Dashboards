import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-geographic-map',
  templateUrl: './geographic-map.component.html',
  styleUrls: ['./geographic-map.component.css'],
})
export class GeographicMapComponent {
  @Input() title!: string;
  @Input() width: string = '300';
  @Input() height: string = '300';
  @Input() data!: { longitude: number; latitude: number }[];
}
