import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any = null;
  constructor(public afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe((user) => {
      this.user = user;
    });
  }

  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['/products']);
          }
        });
      });
  }

  updateAuthState() {
    return this.afAuth.authState;
  }

  get isRegistered(): boolean {
    return this.user;
  }

  get isLoggedIn(): boolean {
    return this.user && this.user.emailVerified;
  }

  getUser() {
    return this.user;
  }

  SignUp(name: string, email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        result.user
          ?.updateProfile({ displayName: name })
          .then(() => this.SendVerificationMail())
          .catch((error) => error.message);
      });
  }

  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['/auth/verify-email-address']);
      });
  }

  SignOut() {
    return this.afAuth.signOut().then(() => {
      this.afAuth.authState.subscribe((user) => {
        if (!user) {
          this.router.navigate(['/']);
        }
      });
    });
  }

  resetPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }
}
