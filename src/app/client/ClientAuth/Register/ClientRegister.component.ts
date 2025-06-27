import { Component, inject, Output, EventEmitter, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { ClientAuthApiService } from '../../../core/ClientCore/client-auth-api.service'; // adjust path
import { Router } from '@angular/router'; // ✅ Import this

@Component({
  selector: 'app-ClientRegister',
  standalone: true,
    providers: [ClientAuthApiService] ,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './ClientRegister.component.html',
  styleUrl: './ClientRegister.component.scss'
})
export class ClientRegisterComponent {
  @Output() close = new EventEmitter<void>();
  @Output() switchToLogin = new EventEmitter<void>();
  
  fb = inject(FormBuilder);
  authService = inject(ClientAuthApiService);
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
        
        // Only set localStorage if we're in a browser environment
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('role', response.data.roles[0]);
          localStorage.setItem('userId', response.data.userId);
          localStorage.setItem('name', response.data.name); 
          localStorage.setItem('email', response.data.email);
        }
        
        console.log('Stored token:', token);
        console.log('Stored role:', role);
        console.log('Stored userId:', userId);
        console.log('Registration successful');
        
        // Close the popup first
        this.close.emit();
        
        // Navigate to client dashboard
        this.router.navigate(['/client']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err?.error?.message || 'Registration failed.';
      }
    });
  }

  closePopup() {
    this.close.emit();
  }
}
