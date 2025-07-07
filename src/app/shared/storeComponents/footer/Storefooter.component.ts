import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductApiService } from '../../../core/storeCore/product-api.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-StoreFooter',
  standalone: true,
  imports: [],
  templateUrl: './Storefooter.component.html',
  styleUrl: './Storefooter.component.scss'
})
export class StoreFooterComponent implements OnInit {
  storeName = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Get store name from route parameters
    this.route.params.subscribe(params => {
      const storeId = params['storeId'];
      if (storeId) {
        this.productService.getStoreDetails(storeId).subscribe({
          next: (res: any) => {
            if (res && res.data) {
              this.storeName = res.data.name || 'Store';
              this.cdr.detectChanges();
            }
          },
          error: (err: any) => {
            this.storeName = 'Store';
            this.cdr.detectChanges();
          }
        });
      }
    });
  }
}
