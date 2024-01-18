import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  name!: string;
  email!: string;
  password!: string;
  isPasswordVisible: boolean = false;
  error: boolean = false;
  errorMessage: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  signUp() {
    this.auth.SignUp(this.name, this.email, this.password).catch((error) => {
      this.error = true;
      if (error.code === 'auth/email-already-in-use') {
        this.errorMessage = 'Email already exists. Sign in instead.';
      } else {
        this.errorMessage = "Couldn't create account. Try again later";
      }
    });
  }

  navToSignIn() {
    this.router.navigate(['/auth/sign-in']);
  }

  toggleVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
