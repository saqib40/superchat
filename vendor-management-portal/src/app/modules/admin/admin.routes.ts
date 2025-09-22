import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'vendors',
        pathMatch: 'full'
      },
      {
        path: 'vendors',
        loadComponent: () => import('./vendor-list/vendor-list.component').then(m => m.VendorListComponent)
      },
      {
        path: 'vendors/:id',
        loadComponent: () => import('./vendor-detail/vendor-detail.component').then(m => m.VendorDetailComponent)
      }
    ]
  }
];
