import { Component, inject, Output, EventEmitter, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { ClientAuthApiService } from '../../../core/ClientCore/client-auth-api.service'; // adjust path
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-ClientLogin',
  standalone: true,
  providers: [ClientAuthApiService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './ClientLogin.component.html',
  styleUrl: './ClientLogin.component.scss'
})
export class ClientLoginComponent {
  @Output() close = new EventEmitter<void>();
  @Output() switchToRegister = new EventEmitter<void>();

  fb = inject(FormBuilder);
  authService = inject(ClientAuthApiService);
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
        
        // Navigate based on user role
        const defaultRoute = this.authServiceCore.getDefaultRoute();
        this.router.navigate([defaultRoute]);
      },
      error: (err) => {
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
