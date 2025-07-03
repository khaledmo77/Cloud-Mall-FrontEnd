import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeroSlider } from '../../storeComponents/hero-slider/hero-slider';
import { ProductApiService } from '../../../core/storeCore/product-api.service';
import { CommonModule } from '@angular/common';
import { GetProductsApiService } from '../../../core/storeCore/Get-Products-api.service';


@Component({
  selector: 'app-Storehome',
  standalone: true,
  imports: [RouterLink, HeroSlider, CommonModule],
  templateUrl: './Storehome.component.html',
  styleUrls: ['./Storehome.component.scss']
})
export class Storehome {
    storeId: number = 0;
    products: any[] = [];

     constructor( private route: ActivatedRoute, 
     private productService: ProductApiService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('storeId');
      if (id) {
        this.storeId = +id;
        this.loadProducts();
      }
    });
  }
   loadProducts(): void {
    this.productService.getProductsByStore(this.storeId).subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error loading store products:', err);
      }
    });
  }
}
