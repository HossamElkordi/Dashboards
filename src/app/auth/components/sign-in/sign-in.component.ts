import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  email!: string;
  password!: string;
  isPasswordVisible: boolean = false;
  error: boolean = false;
  errorMessage: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  signIn() {
    this.auth.SignIn(this.email, this.password).catch((error) => {
      this.error = true;
      if (error.code === 'auth/invalid-credential') {
        this.errorMessage = 'Incorrect email or password';
      } else {
        this.errorMessage = "Couldn't sign you in. Try again later.";
      }
    });
  }

  navToSignUp() {
    this.router.navigate(['/auth/sign-up']);
  }

  navToForgetPwd() {
    this.router.navigate(['/auth/forget-password']);
  }

  toggleVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
