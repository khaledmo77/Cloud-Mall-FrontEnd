import { Component, inject, Output, EventEmitter } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
 // adjust path
import { ClientAuthApiService } from '../../../core/ClientCore/client-auth-api.service';

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
  //step of dependency injection
  fb = inject(FormBuilder);
  authService = inject(ClientAuthApiService); //handle api calls for client registration

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
      this.registerForm.markAllAsTouched(); //show all validation messages
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    const payload = this.registerForm.value;

    this.authService.register(payload).subscribe({ //
      next: (response) => {
        this.isSubmitting = false;
        this.close.emit();
         const token = response.data.token;
    const role = response.data.roles[0];
    const userId = response.data.userId;
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
      console.log('Stored token:', token);
    console.log('Stored role:', role);
    console.log('Stored userId:', userId);
        console.log('Registration successful');
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