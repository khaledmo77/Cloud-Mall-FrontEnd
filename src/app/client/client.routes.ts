import { Routes } from '@angular/router';
import { 
  ClientLayoutComponent, 
  ClientHomeComponent, 
  StoreListComponent, 
  StoreDetailsComponent, 
  ProductDetailsComponent, 
  OrdersComponent, 
  CartComponent, 
  CheckoutComponent 
} from './index';
import { roleGuard } from '../core/auth.guard';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard(['Client'])],
    component: ClientLayoutComponent,
    children: [
      { path: '', component: ClientHomeComponent },
      { path: 'store-list', component: StoreListComponent },
      { path: 'store-details/:id', component: StoreDetailsComponent },
      { path: 'product-details', component: ProductDetailsComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
    ],
  },
]; 