import { Component, inject, Output, EventEmitter, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { VendorAuthApiService } from '../../../core/VendorCore/vendor-auth-api.service'; // adjust path
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-VendorLogin',
  standalone: true,
  providers: [VendorAuthApiService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './VendorLogin.component.html',
  styleUrl: './VendorLogin.component.scss'
})
export class VendorLoginComponent {
  @Output() close = new EventEmitter<void>();
  @Output() switchToRegister = new EventEmitter<void>();

  fb = inject(FormBuilder);
  authService = inject(VendorAuthApiService);
  authServiceCore = inject(AuthService);
  router = inject(Router);
  platformId = inject(PLATFORM_ID);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isLoggingIn = false;
  loginErrorMessage: string | null = null;
  showPassword = false;

  // Getter methods for form validation
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  // Validation error messages
  getEmailErrorMessage(): string {
    if (this.email?.hasError('required')) {
      return 'Email is required';
    }
    if (this.email?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    if (this.password?.hasError('required')) {
      return 'Password is required';
    }
    return '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  submitLoginForm() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoggingIn = true;
    this.loginErrorMessage = null;

    const payload = this.loginForm.value;

    this.authService.login(payload).subscribe({
      next: (response) => {
        this.isLoggingIn = false;
        
        const token = response.data.token;
        const role = response.data.roles[0];
        const userId = response.data.userId;
        
        // Use the new setAuthData method for better token management
        this.authServiceCore.setAuthData({
          token: response.data.token,
          role: response.data.roles[0],
          userId: response.data.userId,
          name: response.data.name,
          email: response.data.email
        });

        console.log('Login successful');
        console.log('Stored token:', token);
        console.log('Stored role:', role);
        console.log('Stored userId:', userId);
        console.log('Token info:', this.authServiceCore.getTokenInfo());

        // Close the popup first
        this.close.emit();
        
        // Add a small delay to ensure localStorage is properly set
        setTimeout(() => {
          // Navigate to vendor landing page
          this.router.navigate(['/vendor']);
        }, 100);
      },
      error: (err) => {
        this.isLoggingIn = false;
        this.loginErrorMessage = err?.error?.message || 'Login failed. Please check your credentials and try again.';
        console.error('Login error:', err);
      }
    });
  }

  navigateToRegister() {
    this.switchToRegister.emit();
  }

  closePopup() {
    this.close.emit();
  }
}
