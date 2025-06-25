import { Component, inject, Output, EventEmitter } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { ClientAuthApiService } from '../../../core/ClientCore/client-auth-api.service'; // adjust path
import { Router } from '@angular/router'; // ✅ Import this

@Component({
  selector: 'app-ClientRegister',
  standalone: true,
    providers: [ClientAuthApiService] ,
  imports: [
    MatDialogModule,
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
        this.close.emit();
        
    const token = response.data.token;
    const role = response.data.roles[0];
    const userId = response.data.userId;
localStorage.setItem('token', response.data.token);
localStorage.setItem('role', response.data.roles[0]);
localStorage.setItem('userId', response.data.userId);
localStorage.setItem('name', response.data.name); 
localStorage.setItem('email', response.data.email);
    console.log('Stored token:', token);
    console.log('Stored role:', role);
    console.log('Stored userId:', userId);
        console.log('Registration successful');
             this.router.navigate(['client/dashboard']); // Navigate to client dashboard


             console.log('Token stored:', response.token);
 // Store user data
          console.log('User data stored:', response.user);
            //  localStorage.setItem('role', response.role);  
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
