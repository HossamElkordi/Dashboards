import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SignGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.updateAuthState().pipe(
      map(() => {
        if (this.authService.isLoggedIn) {
          console.log('HII');
          this.router.navigate(['/']);
        } else if (this.authService.isRegistered) {
          this.router.navigate(['/auth/verify-email-address']);
        }
        return true;
      })
    );
  }
}
