import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/ClientCore/client-cart-api.service';
import { CartItem } from '../../../core/ClientCore/client-cart-api.service'; // update the path as needed
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-StoreHeader',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './StoreHeader.component.html',
  styleUrl: './StoreHeader.component.scss'
})
export class StoreHeader implements OnInit {
  cartItems: CartItem[] = [];
  totalCount = 0;
  totalAmount = 0;
  isVendor = false;

   constructor(
     private cartService: CartService,
     private authService: AuthService
   ) {}

   ngOnInit(): void {
       this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
      this.totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    });
    
    // Check if user is vendor
    this.isVendor = this.authService.getUserRole() === 'Vendor';
   }

   
  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }
   clearCart() {
    this.cartService.cleanCart();
  }

}
