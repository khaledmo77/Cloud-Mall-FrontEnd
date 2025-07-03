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

   constructor(
     private storeService: ClientGetAllStoresApiService,
     private router: Router
   ){}

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

openVendorStore(store: Store) {
  console.log('Clicked store:', store);
  if (store.vendorId && store.id) {
    this.router.navigate([`/vendor/${store.vendorId}/store/${store.id}`]);
  } else {
    alert('vendorId or store id missing! Store object: ' + JSON.stringify(store));
  }
}
 }
