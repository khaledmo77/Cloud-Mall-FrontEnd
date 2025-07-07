import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

export interface CartItem {
  productId: number;
  productName: string;
  productDescription?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  imageURL?: string; // Server response field
  productImageUrl?: string; // For backward compatibility
}

@Injectable({
  providedIn: 'root'
})
export class CartService{
     private cart: CartItem[] = [];
     private cartSubject = new BehaviorSubject<CartItem[]>([]);//holds the cart items as first empty cart.

     cart$ = this.cartSubject.asObservable(); //"observable"to protect the cart state from being changed
     
      total$ = this.cart$.pipe(  // to be updated automatically 
    map(items => items.reduce((total, item) => total + item.price * item.quantity, 0))
  );
      constructor(
        private http: HttpClient,
        private authService: AuthService
      ) {
    // Load cart from localStorage if it exists
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.cartSubject.next(this.cart);
    }
    
    // Load cart from server on initialization
    this.loadCartFromServer();
  }
  
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Load cart from server
  private loadCartFromServer(): void {
    const headers = this.getHeaders();
    this.http.get<any[]>(`${environment.apiBaseUrl}/Product/cart`, { headers })
      .subscribe({
        next: (serverCart) => {
          console.log('Loaded cart from server:', serverCart);
          
          // Transform server response to match our CartItem interface
          this.cart = (serverCart || []).map(item => ({
            productId: item.productId,
            productName: item.name,
            productDescription: item.description,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageURL,
            productImageUrl: item.imageURL
          }));
          
          this.updateCartState();
        },
        error: (error) => {
          console.error('Failed to load cart from server:', error);
          // Keep local cart if server fails
        }
      });
  }

  // Add item to server cart
  private addToServerCart(productId: number, quantity: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${environment.apiBaseUrl}/Product/cart`, 
      { productId, quantity }, 
      { headers }
    );
  }

   private updateCartState() {
    this.cartSubject.next(this.cart); // update observable
    localStorage.setItem('cart', JSON.stringify(this.cart)); // save in storage
  }

     addToCart(product: CartItem){   //to add products to cart
          const existing = this.cart.find(p => p.productId === product.productId);//to get product with same id i found so will be saved in existing variable 
           if (existing) {
            existing.quantity += product.quantity;//add same product so inc its quantity
           } else {
           this.cart.push(product);//not found so add it for first time
           }
           this.updateCartState();
           
           // Add to server cart
           this.addToServerCart(product.productId, product.quantity).subscribe({
             next: (response) => {
               console.log('Added to server cart:', response);
               // Reload cart from server to get updated data
               this.loadCartFromServer();
             },
             error: (error) => {
               console.error('Failed to add to server cart:', error);
             }
           });
     }

     removeFromCart(productId: number){
        this.cart = this.cart.filter(p => p.productId !== productId);
        this.updateCartState(); // to be updated and saved in storage 
        
        // TODO: Implement remove from server cart if API supports it
     }

     updateQuantity(productId: number, newQuantity: number){
        const item = this.cart.find(p => p.productId === productId);
        if (item) {
          if (newQuantity <= 0) {
            this.removeFromCart(productId);
          } else {
            item.quantity = newQuantity;
            this.updateCartState();
            
            // Update quantity on server
            this.addToServerCart(productId, newQuantity).subscribe({
              next: (response) => {
                console.log('Updated quantity on server:', response);
                this.loadCartFromServer();
              },
              error: (error) => {
                console.error('Failed to update quantity on server:', error);
              }
            });
          }
        }
     }

     cleanCart(){
        this.cart = [];
        this.updateCartState(); 
        
        // TODO: Implement clear server cart if API supports it
     }
}