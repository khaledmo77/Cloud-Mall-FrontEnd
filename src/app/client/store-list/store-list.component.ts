import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ClientGetAllStoresApiService, Store } from '../../core/ClientCore/client-getallstores-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-list',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './store-list.component.html',
  styleUrl: './store-list.component.scss'
})
export class StoreListComponent implements OnInit {
  stores: Store[] = [];
  filteredStores: Store[] = [];
  categories: string[] = [];
  error = '';

  // Pagination
  pageNumber = 1;
  pageSize = 9;
  totalPages = 1;
  totalItems = 0;
  selectedCategory: string | null = null;

  constructor(
    private storeService: ClientGetAllStoresApiService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.fetchStores();
  }

  fetchStores() {
    this.storeService.getStoresPaginated({
      categoryName: this.selectedCategory || undefined,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    }).subscribe({
      next: (response) => {
        let items: Store[] = [];
        if (response && Array.isArray(response.allStores)) {
          items = response.allStores;
          this.totalPages = response.totalNumberOfPages || 1;
          this.totalItems = response.totalCount || items.length;
        } else if (Array.isArray(response)) {
          items = response;
          this.totalPages = 1;
          this.totalItems = response.length;
        } else {
          items = [];
          this.totalPages = 1;
          this.totalItems = 0;
        }
        this.stores = items;
        this.filteredStores = items;
      },
      error: (err) => {
        this.error = 'Failed to load stores';
        this.stores = [];
        this.filteredStores = [];
        this.totalPages = 1;
        this.totalItems = 0;
      }
    });
  }

  filterStores(categoryName: string): void {
    this.selectedCategory = categoryName === 'all' ? null : categoryName;
    this.pageNumber = 1;
    this.fetchStores();
  }

  openVendorStore(store: Store) {
    // Support both vendorId and vendorID from backend
    const vendorId = (store as any).vendorId || (store as any).vendorID;
    const storeId = store.id;
    if (vendorId && storeId) {
      this.router.navigate([`/vendor/${vendorId}/store/${storeId}`]);
    } else {
      alert('vendorId or store id missing! Store object: ' + JSON.stringify(store));
    }
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.pageNumber = page;
    this.fetchStores();
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.fetchStores();
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.fetchStores();
    }
  }

  firstPage() {
    this.pageNumber = 1;
    this.fetchStores();
  }

  lastPage() {
    this.pageNumber = this.totalPages;
    this.fetchStores();
  }
}
