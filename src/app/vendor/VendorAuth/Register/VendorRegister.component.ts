import { Component, inject, Output, EventEmitter, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { VendorAuthApiService } from '../../../core/VendorCore/vendor-auth-api.service'; // adjust path
import { Router } from '@angular/router'; // ✅ Import this
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-VendorRegister',
  standalone: true,
    providers: [VendorAuthApiService] ,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './VendorRegister.component.html',
  styleUrl: './VendorRegister.component.scss'
})
export class VendorRegisterComponent {
  @Output() close = new EventEmitter<void>();
  @Output() switchToLogin = new EventEmitter<void>();
  
  fb = inject(FormBuilder);
  authService = inject(VendorAuthApiService);
  authServiceCore = inject(AuthService);
  router = inject(Router);
  platformId = inject(PLATFORM_ID);

  registerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.matchPasswords });

  isSubmitting = false;
  errorMessage: string | null = null;
  showPassword = false;
  showConfirmPassword = false;

  // Getter methods for form validation
  get name() { return this.registerForm.get('name'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  // Validation error messages
  getNameErrorMessage(): string {
    if (this.name?.hasError('required')) {
      return 'Name is required';
    }
    return '';
  }

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
    if (this.password?.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    if (this.confirmPassword?.hasError('required')) {
      return 'Please confirm your password';
    }
    if (this.registerForm.hasError('notMatching')) {
      return 'Passwords do not match';
    }
    return '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  matchPasswords(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { notMatching: true };
  }

  submitForm() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const payload = this.registerForm.value;

    this.authService.register(payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        
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
        
        console.log('Stored token:', token);
        console.log('Stored role:', role);
        console.log('Stored userId:', userId);
        console.log('Registration successful');
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
        this.isSubmitting = false;
        this.errorMessage = err?.error?.message || 'Registration failed. Please try again.';
        console.error('Registration error:', err);
      }
    });
  }

  closePopup() {
    this.close.emit();
  }
}
