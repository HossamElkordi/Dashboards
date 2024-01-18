import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DarkThemeService } from 'src/app/dark-theme.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements OnInit{

  isDarkTheme = false;

  constructor(private darkThemeService: DarkThemeService) { }

  ngOnInit(): void {
    this.darkThemeService.isDarkTheme$.subscribe((isDark) => {
      this.isDarkTheme = isDark;
    });
  }

  @Input() title!: string;
  @Input() max!: number;
  @Input() min!: number;
  @Input() step!: number;
  @Input() value!: number;

  @Output() changeValue = new EventEmitter<number>();

  onChangeValue() {
    this.changeValue.emit(this.value);
  }
}
