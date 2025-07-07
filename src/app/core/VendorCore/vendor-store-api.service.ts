import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface CreateStoreRequest {
  Name: string;
  Description: string;
  StoreCategoryID: number;
  LogoFile?: File;
}

export interface CreateStoreResponse {
  success: boolean;
  message?: string;
  storeId?: number;
  id?: number;
  data?: number;
  errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class VendorStoreApiService {
  private baseUrl = 'https://cloudmall.runasp.net/api/Store';

  constructor(private http: HttpClient) {}

  createStore(storeData: CreateStoreRequest): Observable<CreateStoreResponse> {
    const formData = new FormData();
    
    // Add text fields
    formData.append('Name', storeData.Name);
    formData.append('Description', storeData.Description);
    formData.append('StoreCategoryID', storeData.StoreCategoryID.toString());
    
    // Add file if provided
    if (storeData.LogoFile) {
      formData.append('LogoFile', storeData.LogoFile);
    }

    // Get vendor ID from localStorage
    const vendorId = localStorage.getItem('userId');
    if (vendorId) {
      formData.append('VendorId', vendorId);
    }

    // Debug: Log what's being sent
    console.log('API Request - storeData:', storeData);
    console.log('API Request - vendorId:', vendorId);
    console.log('API Request - FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return throwError(() => new Error('Authentication token not found. Please log in again.'));
    }

    console.log('Making API call to:', `${this.baseUrl}/vendor`);
    console.log('Token exists:', !!token);

    return this.http.post<CreateStoreResponse>(`${this.baseUrl}/vendor`, formData)
      .pipe(
        tap(response => {
          console.log('Store creation response:', response);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Store creation error:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error body:', error.error);
          
          if (error.status === 401) {
            console.error('Authentication failed. Token might be expired.');
            // You might want to redirect to login or refresh token here
            return throwError(() => new Error('Authentication failed. Please log in again.'));
          } else if (error.status === 400) {
            return throwError(() => new Error(error.error?.message || 'Invalid request data.'));
          } else if (error.status === 500) {
            return throwError(() => new Error('Server error. Please try again later.'));
          } else {
            return throwError(() => new Error(error.error?.message || 'An unexpected error occurred.'));
          }
        })
      );
  }
} 