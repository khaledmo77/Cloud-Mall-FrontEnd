import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root' // ✅ Required for global DI
})
export class VendorAuthApiService {
  private baseUrl = `${environment.apiBaseUrl}/Auth`;

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials);
  }

  register(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/vendor/register`, data);
  }
}
