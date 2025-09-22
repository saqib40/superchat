import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data['expectedRole'];
  const userRole = authService.getUserRole();

  if (userRole && userRole === expectedRole) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};