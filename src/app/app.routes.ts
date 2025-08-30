import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Verify } from './verify/verify';
import { SignUp } from './signup/signup';
import { Dashboard } from './dashboard/dashboard';
import { ForgotPassword } from './forgot-password/forgot-password';
import { ResetPassword } from './reset-password/reset-password';
import { authGuard } from './guards/auth-guard';
import { publicPageGuard } from './guards/public-page-guard';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
    canActivate: [authGuard],
  },
  {
    path: 'signup',
    component: SignUp,
    canActivate: [publicPageGuard],
  },
  {
    path: 'login',
    component: Login,
    canActivate: [publicPageGuard],
  },
  {
    path: 'verify/:email',
    component: Verify,
    canActivate: [publicPageGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPassword,
    canActivate: [publicPageGuard],
  },
  {
    path: 'reset-password',
    component: ResetPassword,
    canActivate: [publicPageGuard],
  },
];
