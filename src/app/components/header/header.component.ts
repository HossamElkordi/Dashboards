import { Component, Input, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatMenuTrigger } from '@angular/material/menu';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DarkThemeService } from '../../dark-theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {

  isDarkTheme = false;

  toggleDarkTheme(): void {
    this.darkThemeService.toggleDarkTheme();
  }

  @Input() isModulePage: boolean = false;
  @Input() title!: string;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  user$!: Observable<firebase.default.User | null>;
  user: firebase.default.User | null | undefined = undefined;
  constructor(
    private router: Router,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private auth: AuthService,
    private darkThemeService: DarkThemeService
  ) {
    this.iconRegistry.addSvgIcon(
      'rajhy',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '../../../../../assets/rajhy_logo.svg'
      )
    );
  }

  ngOnInit() {
    this.darkThemeService.isDarkTheme$.subscribe((isDark) => {
      this.isDarkTheme = isDark;
    });
    
    this.auth.updateAuthState().subscribe((user) => (this.user = user));
  }

  navToHome() {
    this.router.navigate(['/']);
  }

  goProducts() {
    this.router.navigate(['products']);
  }

  signOut() {
    this.auth.SignOut();
  }

  navToSignIn() {
    this.router.navigate(['/auth/sign-in']);
  }

  navToSignUp() {
    this.router.navigate(['/auth/sign-up']);
  }

  isInProduct() {
    const path = new RegExp('/products/.+');
    if (path.test(this.router.url)) return true;
    return false;
  }

  printReport() {
    this.trigger.closeMenu();
    setTimeout(() => window.print(), 5);
  }
}
