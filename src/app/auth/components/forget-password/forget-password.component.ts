import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
})
export class ForgetPasswordComponent {
  constructor(private auth: AuthService) {}
  email!: string;
  submitted: boolean = false;

  resetPwd() {
    this.auth.resetPassword(this.email).then(() => {
      this.submitted = true;
    });
  }
}
