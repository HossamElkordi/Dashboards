import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class VerifyEmailGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    return this.authService.updateAuthState().pipe(
      map(() => {
        if (!this.authService.isRegistered) {
          this.router.navigate(['/auth/sign-in']);
        } else if (this.authService.isLoggedIn) {
          this.router.navigate(['/']);
        }
        return true;
      })
    );
  }
}
