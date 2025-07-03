import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Store {
  id: number;
  name: string;
  logoURL: string;
  description: string;
  categoryName: string;
  vendorID: string;
  // add any other fields returned by your API
}

export interface GetAllStoresResponse {
  pageSize: number;
  totalCount: number;
  currentPage: number;
  totalNumberOfPages: number;
  allStores: Store[];
}

@Injectable({
  providedIn: 'root'
})
export class ClientGetAllStoresApiService {
  private apiUrl = 'http://cloudmall.runasp.net/api/store/get-all-stores'; // update this with your actual endpoint

  constructor(private http: HttpClient) {}

  getAllStores(): Observable<GetAllStoresResponse> {
    return this.http.get<GetAllStoresResponse>(this.apiUrl);
  }

  getStoresPaginated(options?: { categoryName?: string; pageNumber?: number; pageSize?: number }): Observable<GetAllStoresResponse> {
    let params: any = {};
    if (options?.categoryName) params.categoryName = options.categoryName;
    if (options?.pageNumber) params.pageNumber = options.pageNumber;
    if (options?.pageSize) params.pageSize = options.pageSize;
    return this.http.get<GetAllStoresResponse>(this.apiUrl, { params });
  }
}
