import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VendorService } from '../../../services/vendor.service';
import { Employee } from '../../../models';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  isLoading = false;
  searchTerm = '';

  constructor(private vendorService: VendorService) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.isLoading = true;
    this.vendorService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    this.filteredEmployees = this.employees.filter(employee => {
      if (!this.searchTerm) return true;
      
      const searchLower = this.searchTerm.toLowerCase();
      return (
        employee.firstName.toLowerCase().includes(searchLower) ||
        employee.lastName.toLowerCase().includes(searchLower) ||
        (employee.jobTitle && employee.jobTitle.toLowerCase().includes(searchLower))
      );
    });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.applyFilter();
  }

  deleteEmployee(employee: Employee) {
    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      this.vendorService.deleteEmployee(employee.id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
        }
      });
    }
  }
}
