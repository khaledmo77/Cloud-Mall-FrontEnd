import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoreCategoryApiService {
  private baseUrl = 'https://cloudmall.runasp.net/api/StoreCategory/Admin';

  constructor(private http: HttpClient) {}

  getAllCategoriesByAdmin(token: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/GetAllCategoriesByAdmin`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  createCategory(token: string, name: string, description: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/CreateStoreCategoryByAdmin`,
      { name, description },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
