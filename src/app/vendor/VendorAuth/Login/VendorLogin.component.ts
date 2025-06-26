import { Component, inject, Output, EventEmitter } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { VendorAuthApiService } from '../../../core/VendorCore/vendor-auth-api.service'; // adjust path
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-VendorLogin',
  standalone: true,
  providers: [VendorAuthApiService],
  imports: [
    MatDialogModule,
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
  router = inject(Router);

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
        this.close.emit();

        const token = response.data.token;
        const role = response.data.roles[0];
        const userId = response.data.userId;
   localStorage.setItem('token', response.data.token);
localStorage.setItem('role', response.data.roles[0]);
localStorage.setItem('userId', response.data.userId);
localStorage.setItem('name', response.data.name); 
localStorage.setItem('email', response.data.email);

        console.log('Login successful');
        console.log('Stored token:', token);
        console.log('Stored role:', role);
        console.log('Stored userId:', userId);

        this.router.navigate(['vendor/dashboard']); // Navigate to vendor dashboard
      },
      error: (err) => {
        this.isLoggingIn = false;
        this.loginErrorMessage = err?.error?.message || 'Login failed.';
      }
    });
  }

  closePopup() {
    this.close.emit();
  }
}
