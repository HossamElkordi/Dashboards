import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  constructor(private router: Router, private auth: AuthService) {}
  isLoggedIn: boolean = false;

  ngOnInit() {
    this.auth
      .updateAuthState()
      .subscribe((user) => (this.isLoggedIn = user !== null));
  }

  onBtnClick() {
    this.router.navigate(['products']);
  }
}
