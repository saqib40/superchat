import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-vendor-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vendor-setup.component.html'
})
export class VendorSetupComponent implements OnInit {
  setupForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  token = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.setupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.token = this.route.snapshot.params['token'];
    if (!this.token) {
      this.router.navigate(['/login']);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit() {
    if (this.setupForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const { firstName, lastName, password } = this.setupForm.value;
      
      this.authService.submitVendorDetails(this.token, {
        firstName,
        lastName,
        password
      }).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Your account has been set up successfully! Please wait for admin approval.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to set up your account. Please check your details and try again.';
        }
      });
    }
  }

  get firstName() { return this.setupForm.get('firstName'); }
  get lastName() { return this.setupForm.get('lastName'); }
  get password() { return this.setupForm.get('password'); }
  get confirmPassword() { return this.setupForm.get('confirmPassword'); }
}
