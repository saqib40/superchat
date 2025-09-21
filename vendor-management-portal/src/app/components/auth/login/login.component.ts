import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Redirect if already authenticated
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.redirectToRoleDashboard();
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.redirectToRoleDashboard();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Invalid email or password. Please try again.';
        }
      });
    }
  }

  private redirectToRoleDashboard() {
    const user = this.authService.getCurrentUser();
    if (user) {
      switch (user.role) {
        case UserRole.Admin:
          this.router.navigate(['/admin']);
          break;
        case UserRole.Leadership:
          this.router.navigate(['/leadership']);
          break;
        case UserRole.Vendor:
          this.router.navigate(['/vendor']);
          break;
        default:
          console.error('Unknown user role:', user.role);
          // Navigate to a safe fallback route, like the homepage
          this.router.navigate(['/']); 
          break;
      }
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
