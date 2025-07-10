import { Component, inject, Output, EventEmitter, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
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
  cdRef = inject(ChangeDetectorRef);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isLoggingIn = false;
  loginErrorMessage: string | null = null;
  showPassword = false;

  // Add login mode toggle
  loginMode: 'vendor' | 'admin' = 'vendor';

  // Add admin login service stub (replace with real service if available)
  adminAuthService = {
    login: (payload: any) => this.authService.login(payload) // TODO: Replace with real admin login API
  };

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

  // Update submitLoginForm to handle both modes
  submitLoginForm() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoggingIn = true;
    this.loginErrorMessage = null;

    const payload = this.loginForm.value;
    const loginService = this.loginMode === 'admin' ? this.adminAuthService : this.authService;

    loginService.login(payload).subscribe({
      next: (response: any) => {
        this.isLoggingIn = false;
        const token = response.data.token;
        const role = response.data.roles[0];
        const userId = response.data.userId;
        this.authServiceCore.setAuthData({
          token: response.data.token,
          role: response.data.roles[0],
          userId: response.data.userId,
          name: response.data.name,
          email: response.data.email
        });
        this.close.emit();
        setTimeout(() => {
          // Navigate based on user role
          const defaultRoute = this.authServiceCore.getDefaultRoute();
          this.router.navigate([defaultRoute]);
        }, 100);
      },
      error: (err: any) => {
        this.isLoggingIn = false;
        this.loginErrorMessage = err?.error?.errors?.[0] || 'Login failed. Please check your credentials and try again.';
        console.error('Login error:', err);
        this.cdRef.detectChanges();
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
