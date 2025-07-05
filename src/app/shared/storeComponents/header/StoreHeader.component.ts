import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/ClientCore/client-cart-api.service';
import { CartItem } from '../../../core/ClientCore/client-cart-api.service'; // update the path as needed

@Component({
  selector: 'app-StoreHeader',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './StoreHeader.component.html',
  styleUrl: './StoreHeader.component.scss'
})
export class StoreHeader implements OnInit {
  cartItems: CartItem[] = [];
  totalCount = 0;
  totalAmount =0;

   constructor(private cartService: CartService,) {}

   ngOnInit(): void {
       this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
      this.totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    });
   }

   
  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }
   clearCart() {
    this.cartService.cleanCart();
  }

}
