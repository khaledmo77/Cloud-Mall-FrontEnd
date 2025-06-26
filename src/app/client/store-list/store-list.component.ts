import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ClientGetAllStoresApiService, Store } from '../../core/ClientCore/client-getallstores-api.service';


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

   constructor(private storeService: ClientGetAllStoresApiService){}

    ngOnInit(): void {
    this.storeService.getAllStores().subscribe({
      next: (data) => {
        this.stores = data;
        this.filteredStores = data;
        console.log('Fetched stores:', data);
      },
      error: (err) => {
        this.error = 'Failed to load stores';
        
      }
    });
  }
  filterStores(categoryName: string): void {
  if (categoryName === 'all') {
    this.filteredStores = this.stores;
  } else {
    this.filteredStores = this.stores.filter(store =>
      store.categoryName?.toLowerCase() === categoryName.toLowerCase()
    );
  }
}
 }
