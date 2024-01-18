import { Component, Input, OnInit } from '@angular/core';
import { NgxGaugeCap, NgxGaugeType } from 'ngx-gauge/gauge/gauge';
import { DarkThemeService } from 'src/app/dark-theme.service';

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.css'],
})
export class GaugeComponent implements OnInit {
  gaugeType: NgxGaugeType = 'full';
  cap: NgxGaugeCap = 'round';

  isDarkTheme:boolean = false;
  constructor(private darkThemeService: DarkThemeService) { }

  @Input() gaugeValue: number = 0;
  @Input() max: number = 1;
  @Input() min: number = 0;
  @Input() size: number = 200;
  @Input() thickness: number = 10;
  @Input() append: string = "";
  @Input() label: string = "";
  @Input() Width?: string = 'auto';
  @Input() gradient_offset:number = 1
  thresholdConfig: Map<unknown, unknown> = new Map();

  ngOnInit(): void {
    this.darkThemeService.isDarkTheme$.subscribe((isDark) => {
      this.isDarkTheme = isDark;
    });
  }

  gradients = [
    '#00ed10',
    '#6eec00',
    '#9beb00',
    '#bee800',
    '#dce600',
    '#ead700',
    '#f6c700',
    '#ffb700',
    '#ff9607',
    '#ff7220',
    '#ff4a33',
    '#f80045',
  ];

  generateGradient() {
    const th = this.max / this.gradients.length;
    let ths = th;
    let startNumber = 0;
    let offset = this.gradient_offset;
    let iterator = 0;
    this.thresholdConfig.set(String(startNumber), {
      color: this.gradients[iterator],
      bgOpacity: 0.2,
    });

    while (startNumber <= this.max) {
      if (startNumber <= ths) {
        startNumber += offset;
      } else {
        iterator++;
        ths += th;
        this.thresholdConfig.set(String(startNumber), {
          color: this.gradients[iterator],
          bgOpacity: 0.2,
        });
      }
    }
    return Object.fromEntries(this.thresholdConfig);
  }
}
