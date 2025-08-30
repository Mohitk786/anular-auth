import { inject } from '@angular/core';
import {
  CanActivateFn,
  RedirectCommand,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticatedUser()) {
    const loginPath = router.parseUrl('/login');
    return new RedirectCommand(loginPath, {
      skipLocationChange: true,
    });
  }

  return true;
};
