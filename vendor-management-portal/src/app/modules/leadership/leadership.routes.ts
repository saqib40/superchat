import { Routes } from '@angular/router';

export const leadershipRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./leadership-dashboard/leadership-dashboard.component').then(m => m.LeadershipDashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        loadComponent: () => import('./dashboard-overview/dashboard-overview.component').then(m => m.DashboardOverviewComponent)
      },
      {
        path: 'search',
        loadComponent: () => import('./search-page/search-page.component').then(m => m.SearchPageComponent)
      },
      {
        path: 'vendors/:id',
        loadComponent: () => import('./vendor-details/vendor-details.component').then(m => m.VendorDetailsComponent)
      }
    ]
  }
];
