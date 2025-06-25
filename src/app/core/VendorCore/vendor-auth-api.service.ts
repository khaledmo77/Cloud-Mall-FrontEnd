import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

@Injectable({
  providedIn: 'root' // ✅ Required for global DI
})
export class VendorAuthApiService {
  private baseUrl = 'https://localhost:5001/api/Auth/vendor';

  constructor(private http: HttpClient) {}

  register(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }
}
