import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './Layout/layout.component';
import { AdminHomeComponent } from './Home/home.component';
import { ClientsComponent } from './clients/clients.component';
import { StoresComponent } from './stores/stores.component';
import { OrdersComponent } from './orders/orders.component';
import { RevenueComponent } from './revenue/revenue.component';
import { RevenuePredictionsComponent } from './revenue-predictions/revenue-predictions.component';
import { AdminsComponent } from './admins/admins.component';
import { StoreCategoriesComponent } from './store-categories/store-categories.component';
import { VendorsComponent } from './vendors/vendors.component';
import { VendorsStoresComponent } from './vendors-stores/vendors-stores.component';
import { DeletedStoresComponent } from './deleted-stores/deleted-stores.component';
import { DisabledStoresComponent } from './disabled-stores/disabled-stores.component';
import { roleGuard } from '../core/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard(['Admin', 'SuperAdmin'])],
    component: AdminLayoutComponent,
    children: [
      { path: '', component: AdminHomeComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'stores', component: StoresComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'revenue', component: RevenueComponent },
      { path: 'revenue-predictions', component: RevenuePredictionsComponent },
      { path: 'admins', component: AdminsComponent, canActivate: [roleGuard(['SuperAdmin'])] },
      { path: 'store-categories', component: StoreCategoriesComponent },
      { path: 'vendors', component: VendorsComponent },
    
      {path: 'deleted-stores', component: DeletedStoresComponent},
      {
        path: 'disabled-stores',
        loadComponent: () => import('./disabled-stores/disabled-stores.component').then(m => m.DisabledStoresComponent)
      },
      {
        path: 'adminstore/:storeId/products',
        loadComponent: () => import('./store-products/store-products.component').then(m => m.StoreProductsComponent)
      },
    ],
  },
]; 

export default ADMIN_ROUTES; 