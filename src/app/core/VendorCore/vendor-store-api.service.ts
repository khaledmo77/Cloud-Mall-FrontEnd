import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

    // Debug: Log what's being sent
    console.log('API Request - storeData:', storeData);
    console.log('API Request - FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    return this.http.post<CreateStoreResponse>(`${this.baseUrl}/vendor`, formData);
  }
} 