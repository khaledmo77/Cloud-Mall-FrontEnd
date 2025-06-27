import { Component, inject, Output, EventEmitter, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { ClientAuthApiService } from '../../../core/ClientCore/client-auth-api.service'; // adjust path
import { Router, RouterModule } from '@angular/router';

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
  router = inject(Router);
  platformId = inject(PLATFORM_ID);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isLoggingIn = false;
  loginErrorMessage: string | null = null;

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
        
        // Only set localStorage if we're in a browser environment
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('role', response.data.roles[0]);
          localStorage.setItem('userId', response.data.userId);
          localStorage.setItem('name', response.data.name); 
          localStorage.setItem('email', response.data.email);
        }

        console.log('Login successful');
        console.log('Stored token:', token);
        console.log('Stored role:', role);
        console.log('Stored userId:', userId);

        // Close the popup first
        this.close.emit();
        
        // Navigate to client dashboard
        this.router.navigate(['/client']);
      },
      error: (err) => {
        this.isLoggingIn = false;
        this.loginErrorMessage = err?.error?.message || 'Login failed.';
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
