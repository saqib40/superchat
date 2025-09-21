import { Routes } from '@angular/router';
import { SetupVendorComponent } from './vendor/setup-vendor/setup-vendor.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  
  {
    path: 'admin/vendors',
    loadComponent: () =>
      import('./vendor-list/vendor-list.component').then(m => m.VendorListComponent) 
  },
  {
  path: 'admin/add-vendor',
  loadComponent: () =>
    import('./admin/add-vendor/add-vendor.component').then(m => m.AddVendorComponent)
},
  {
  path: 'leadership/dashboard',
  loadComponent: () => import('./leadership/dashboard/dashboard.component').then(m => m.LeadershipDashboardComponent)
  },
  {
  path: 'vendor/dashboard',
  loadComponent: () => import('./vendor/dashboard/dashboard.component').then(m => m.VendorDashboardComponent)
  },
  {
  path: 'leadership/vendors',
  loadComponent: () =>
    import('./vendor-list/vendor-list.component').then(m => m.VendorListComponent)
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
}
,
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];