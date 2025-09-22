import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  providers:[AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  isSubmitting = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: {token: string }) => {
        localStorage.setItem('token', res.token);
        const role = this.authService.getUserRole();
        
        // Debugging Step: Check the actual role in the browser console
        console.log('Decoded Role from Token:', role); 

        // Role-based navigation to dashboards
        if (role === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (role === 'Leadership') {
          this.router.navigate(['/leadership/dashboard']);
        } else if (role === 'Vendor') {
          this.router.navigate(['/vendor/dashboard']);
        } else {
          // Fix 1: Reset the submitting flag so the UI isn't stuck
          this.isSubmitting = false; 
          this.errorMessage = 'Invalid role received from token.';
        }
      },
      error: () => {
        this.errorMessage = 'Invalid email or password';
        this.isSubmitting = false;
      }
    });
  }
}