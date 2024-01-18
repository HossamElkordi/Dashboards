import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomepageComponent } from './components/homepage/homepage.component';
import { ProductsPageComponent } from './components/products-page/products-page.component';
import { ProductSelectorComponent } from './components/product-selector/product-selector.component';
import { SignUpComponent } from './auth/components/sign-up/sign-up.component';
import { VerifyEmailComponent } from './auth/components/verify-email/verify-email.component';
import { SignInComponent } from './auth/components/sign-in/sign-in.component';
import { SignGuard } from './auth/guards/sign-guard.guard';
import { AuthGuard } from './auth/guards/auth-guard.guard';
import { VerifyEmailGuard } from './auth/guards/verify-email-guard.guard';
import { ForgetPasswordComponent } from './auth/components/forget-password/forget-password.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  {
    path: 'products',
    component: ProductSelectorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'products/:name',
    component: ProductsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    children: [
      {
        path: 'sign-up',
        component: SignUpComponent,
        canActivate: [SignGuard],
      },
      {
        path: 'verify-email-address',
        component: VerifyEmailComponent,
        canActivate: [VerifyEmailGuard],
      },
      {
        path: 'sign-in',
        component: SignInComponent,
        canActivate: [SignGuard],
      },
      {
        path: 'forget-password',
        component: ForgetPasswordComponent,
        canActivate: [SignGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
