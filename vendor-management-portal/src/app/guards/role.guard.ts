import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    const user = authService.getCurrentUser();
    
    if (!user) {
      router.navigate(['/login']);
      return false;
    }
    
    if (allowedRoles.includes(user.role)) {
      return true;
    } else {
      // Redirect to appropriate dashboard based on user role
      switch (user.role) {
        case UserRole.Admin:
          router.navigate(['/admin']);
          break;
        case UserRole.Leadership:
          router.navigate(['/leadership']);
          break;
        case UserRole.Vendor:
          router.navigate(['/vendor']);
          break;
        default:
          router.navigate(['/login']);
      }
      return false;
    }
  };
};
