// src/app/guards/auth.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data['expectedRole'];
  const userRoles = authService.getUserRole();

  // THIS LOG IS FOR FINAL DEBUGGING
  console.log({
    message: 'AuthGuard Check',
    expectedRole: expectedRole,
    userRoles: userRoles,
    isAllowed: (Array.isArray(userRoles) && userRoles.includes(expectedRole)) || userRoles === expectedRole
  });

  if (userRoles) {
    if ((Array.isArray(userRoles) && userRoles.includes(expectedRole)) || userRoles === expectedRole) {
      return true;
    }
  }

  router.navigate(['/login']);
  return false;
};