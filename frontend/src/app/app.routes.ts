import { Routes } from '@angular/router';

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
    path: 'admin/add-vendor', // This is the new route
    loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'admin/vendors',
    loadComponent: () =>
      import('./vendor-list/vendor-list.component').then(m => m.VendorListComponent) // ✅ Vendor List
  },
   {
    path: 'admin/add-vendor', // This is the new route
    loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
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
  path: 'leadership/vendors',   // 👔 Leadership also gets vendor list
  loadComponent: () =>
    import('./vendor-list/vendor-list.component').then(m => m.VendorListComponent)
},
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];