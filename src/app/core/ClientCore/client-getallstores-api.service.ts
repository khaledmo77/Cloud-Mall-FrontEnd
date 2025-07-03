import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Store {
  id: number;
  name: string;
  logoURL: string;
  description : string;
  categoryName: string;
  vendorId: string;
  // add any other fields returned by your API
}

@Injectable({
  providedIn: 'root'
})
export class ClientGetAllStoresApiService {
  private apiUrl = 'http://cloudmall.runasp.net/api/store/get-all-stores'; // update this with your actual endpoint

  constructor(private http: HttpClient) {}

  getAllStores(): Observable<Store[]> {
    return this.http.get<Store[]>(this.apiUrl);
  }

  getStoresPaginated(options?: { categoryName?: string; pageNumber?: number; pageSize?: number }): Observable<any> {
    let params: any = {};
    if (options?.categoryName) params.categoryName = options.categoryName;
    if (options?.pageNumber) params.pageNumber = options.pageNumber;
    if (options?.pageSize) params.pageSize = options.pageSize;
    return this.http.get<Store[]>(this.apiUrl, { params });
  }
}
