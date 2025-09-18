import { Routes } from '@angular/router';

export const routes: Routes = [{
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
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }];
