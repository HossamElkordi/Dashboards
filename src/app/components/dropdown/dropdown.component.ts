import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnInit
} from '@angular/core';
import { DropdownOption } from 'src/app/interfaces/types';
import { DarkThemeService } from 'src/app/dark-theme.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DropdownComponent implements OnInit{

  isDarkTheme = false;

  constructor(private darkThemeService: DarkThemeService) { }

  ngOnInit(): void {
    this.darkThemeService.isDarkTheme$.subscribe((isDark) => {
      this.isDarkTheme = isDark;
    });
  }

  @Input() label!: string;
  @Input() options!: DropdownOption[];
  @Input() multiple!: boolean;
  @Input() selected: any;
  @Input() allow_all?: boolean = false;
  @Output() selectionChange = new EventEmitter<any>();

}
