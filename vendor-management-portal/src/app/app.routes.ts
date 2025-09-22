import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { UserRole } from './models';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'vendor-setup/:token',
    loadComponent: () => import('./components/auth/vendor-setup/vendor-setup.component').then(m => m.VendorSetupComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard([UserRole.Admin])],
    loadChildren: () => import('./modules/admin/admin.routes').then(m => m.adminRoutes)
  },
  {
    path: 'leadership',
    canActivate: [authGuard, roleGuard([UserRole.Leadership])],
    loadChildren: () => import('./modules/leadership/leadership.routes').then(m => m.leadershipRoutes)
  },
  {
    path: 'vendor',
    canActivate: [authGuard, roleGuard([UserRole.Vendor])],
    loadChildren: () => import('./modules/vendor/vendor.routes').then(m => m.vendorRoutes)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
