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
    const{email,password}=this.loginForm.value;
  /*
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: {token: string }) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        this.errorMessage = 'Invalid email or password';
        this.isSubmitting = false;
      }
    });*/
  if (email === 'admin@superchat.com' && password === 'admin123') {
    localStorage.setItem('token', 'dummy-token');
    this.router.navigate(['/admin/dashboard']);
  } 
  else if (email === 'lead@superchat.com' && password === 'lead123') {
    localStorage.setItem('token','dummy-token');
    this.router.navigate(['/leadership/dashboard']);
  } 
  else if (email === 'vendor@superchat.com' && password === 'vendor123') {
    localStorage.setItem('token','dummy-token');
    this.router.navigate(['/vendor/dashboard']);
  }
  else {
    this.errorMessage = 'Invalid email or password';
    this.isSubmitting = false;
  }
  }
}