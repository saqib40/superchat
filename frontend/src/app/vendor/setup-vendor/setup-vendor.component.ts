import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-setup-vendor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './setup-vendor.component.html',
  styleUrls: ['./setup-vendor.component.css']
})
export class SetupVendorComponent {
  token: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  confirmPassword: string = '';
  message: string = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    const t = this.route.snapshot.paramMap.get('token');
    this.token = t ?? '';
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  submitForm() {
    if (!this.firstName.trim() || !this.lastName.trim()) {
      this.message = 'Please enter first name and last name.';
      return;
    }
    if (this.password.length < 8) {
      this.message = 'Password must be at least 8 characters.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.message = 'Passwords do not match.';
      return;
    }
    if (!this.token) {
      this.message = 'Missing or invalid token.';
      return;
    }

    this.loading = true;
    this.message = '';

    this.authService.submitVendorDetails(this.token, {
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.message = res?.message ?? 'Setup complete. Await admin approval.';
        // optionally redirect to login after a short delay:
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        if (err?.error?.message) this.message = err.error.message;
        else this.message = 'Failed to submit. Link may be invalid or expired.';
      }
    });
  }
}
