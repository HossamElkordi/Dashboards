import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-module-topbar',
  templateUrl: './module-topbar.component.html',
  styleUrls: ['./module-topbar.component.css']
})
export class ModuleTopbarComponent {

  constructor(private router: Router) {}

  @Input() title: string | undefined;
  @Input() module_name: string | undefined;

  goProductPage(){
    this.router.navigate(['products', this.module_name])
  }

}
