import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    data: { expectedRole: 'Admin' }
  },
  
  {
    path: 'admin/vendors',
    loadComponent: () => import('./vendor-list/vendor-list.component').then(m => m.VendorListComponent),
    canActivate: [authGuard],
    data: { expectedRole: 'Admin' } 
  },
  {
    path: 'admin/add-vendor',
    loadComponent: () => import('./admin/add-vendor/add-vendor.component').then(m => m.AddVendorComponent),
    canActivate: [authGuard],
    data: { expectedRole: 'Admin' }
  },
  {
    path: 'leadership/dashboard',
    loadComponent: () => import('./leadership/dashboard/dashboard.component').then(m => m.LeadershipDashboardComponent),
    canActivate: [authGuard],
    data: { expectedRole: 'Leadership' }
  },
  {
    path: 'vendor/dashboard',
    loadComponent: () => import('./vendor/dashboard/dashboard.component').then(m => m.VendorDashboardComponent),
    canActivate: [authGuard],
    data: { expectedRole: 'Vendor' }
  },
  {
    path: 'leadership/vendors',
    loadComponent: () => import('./vendor-list/vendor-list.component').then(m => m.VendorListComponent),
    canActivate: [authGuard],
    data: { expectedRole: 'Leadership' }
  },
  {
    path: 'setup-vendor/:token',
    loadComponent: () => import('./vendor/setup-vendor/setup-vendor.component').then(m => m.SetupVendorComponent)
  },
  {
    path: 'vendors/:id',
    loadComponent: () =>
      import('./vendor-profile/vendor-profile.component').then(
        (m) => m.VendorProfileComponent
      ),
    canActivate: [authGuard],
    data: { expectedRole: 'Admin' }
  }
  ,
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];