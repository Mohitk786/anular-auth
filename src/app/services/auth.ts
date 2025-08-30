import { inject, Injectable } from '@angular/core';
import {  Router } from '@angular/router';
import { User } from '../dashboard/dashboard';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private authSecretKey = 'angular-auth-token';
  router = inject(Router);

  constructor() {
    this.isAuthenticated = !!localStorage.getItem(this.authSecretKey);
  }

  login(authToken: string, user:User): boolean {
    localStorage.setItem(this.authSecretKey, authToken);
    localStorage.setItem('user', JSON.stringify(user));
    this.isAuthenticated = true;
    return true;
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  logout(): void {
    localStorage.removeItem(this.authSecretKey);
    this.isAuthenticated = false;
    const loginUrl = '/login';
    this.router.navigateByUrl(loginUrl);
  }
}
