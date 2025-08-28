import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Verify } from './verify/verify';
import { SignUp } from './signup/signup';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
    {
        path: '',
        component: SignUp
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'verify/:email',
        component: Verify
    },
    {
        path: 'dashboard',
        component: Dashboard
    }
];
