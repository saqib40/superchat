import { Routes } from '@angular/router';

export const vendorRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./vendor-dashboard/vendor-dashboard.component').then(m => m.VendorDashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'employees',
        pathMatch: 'full'
      },
      {
        path: 'employees',
        loadComponent: () => import('./employee-list/employee-list.component').then(m => m.EmployeeListComponent)
      },
      {
        path: 'employees/add',
        loadComponent: () => import('./add-employee-form/add-employee-form.component').then(m => m.AddEmployeeFormComponent)
      },
      {
        path: 'employees/:id/edit',
        loadComponent: () => import('./edit-employee/edit-employee.component').then(m => m.EditEmployeeComponent)
      }
    ]
  }
];
