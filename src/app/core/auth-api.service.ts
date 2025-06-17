import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private baseUrl = 'https://localhost:5001/api/auth';

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }) {
    return this.http.post<{ token: string; role: string }>(`${this.baseUrl}/login`, data);
  }
}
