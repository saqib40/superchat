import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgxCaptchaModule } from 'ngx-captcha';
import { environment } from '../../environments/environment';
 
declare const grecaptcha: any;
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxCaptchaModule],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <h2 class="text-3xl font-extrabold text-center text-gray-900">Sign in to your account</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label for="email" class="text-sm font-medium text-gray-700">Email</label>
            <input id="email" type="email" formControlName="email" required class="w-full px-4 py-2 mt-1 bg-white border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition">
          </div>
          <div>
            <label for="password" class="text-sm font-medium text-gray-700">Password</label>
            <input id="password" type="password" formControlName="password" required class="w-full px-4 py-2 mt-1 bg-white border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition">
          </div>
          <p *ngIf="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
          <button type="submit" [disabled]="loginForm.invalid || isSubmitting" 
                  class="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100">
            {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  isSubmitting = false;
 
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
 
  onSubmit() {
    if (this.loginForm.invalid) return;
    this.isSubmitting = true;
    this.errorMessage = '';
 
    grecaptcha.ready(() => {
      grecaptcha.execute(environment.recaptchaSiteKey, { action: 'login' })
        .then((token: string) => {
          console.log("Generated reCAPTCHA token:", token);
 
          const payload = {
            ...this.loginForm.value,
            recaptchaToken: token
          };
 
          this.authService.login(payload).subscribe({
            next: (res) => {
              localStorage.setItem('token', res.token);
              const roles = this.authService.getUserRole();
              const primaryRole = Array.isArray(roles) ? roles[0] : roles;
              console.log('Decoded Primary Role:', primaryRole);
 
              if (primaryRole === 'Admin') {
                this.router.navigate(['/admin/dashboard']);
              } else if (primaryRole === 'Leadership') {
                this.router.navigate(['/leadership/dashboard']);
              } else if (primaryRole === 'Vendor') {
                this.router.navigate(['/vendor/dashboard']);
              } else {
                this.isSubmitting = false;
                this.errorMessage = 'Invalid role received from token.';
              }
            },
            error: () => {
              this.errorMessage = 'Invalid email or password';
              this.isSubmitting = false;
            }
          });
        })
        .catch((error: any) => {
          this.errorMessage = 'CAPTCHA verification failed.';
          this.isSubmitting = false;
          console.error('reCAPTCHA error:', error);
        });
    });
  }
}