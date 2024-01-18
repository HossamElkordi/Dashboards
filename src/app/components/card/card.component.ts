import { Component, Input, OnInit } from '@angular/core';
import { DarkThemeService } from 'src/app/dark-theme.service';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})

export class CardComponent implements OnInit{
  isDarkTheme = false;

  constructor(private darkThemeService: DarkThemeService) { }

  ngOnInit(): void {
    this.darkThemeService.isDarkTheme$.subscribe((isDark) => {
      this.isDarkTheme = isDark;
    });
  }


  @Input() title?: string;
  @Input() information: { name: string, value: string, color?: string, trend?: 'up' | 'down' }[] = [];
  @Input() Width?: string = 'auto';
  @Input() Height?: string = 'auto';
  @Input() twoColumns?: boolean = false;
}