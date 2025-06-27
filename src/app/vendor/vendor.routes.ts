import { Routes } from '@angular/router';
import { 
  VendorLayoutComponent, 
  VendorHomeComponent, 
  VendorDashboardComponent, 
  CreateStoreComponent, 
  StoreSettingsComponent, 
  StorePreviewComponent, 
  ManageProductsComponent, 
  VendorOrdersComponent 
} from './index';
import { roleGuard } from '../core/auth.guard';

export const VENDOR_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard(['Vendor'])],
    component: VendorLayoutComponent,
    children: [
      { path: '', component: VendorHomeComponent },
      { path: 'dashboard', component: VendorDashboardComponent },
      { path: 'create-store', component: CreateStoreComponent },
      { path: 'store-settings', component: StoreSettingsComponent },
      { path: 'store-preview', component: StorePreviewComponent },
      { path: 'manage-products', component: ManageProductsComponent },
      { path: 'orders', component: VendorOrdersComponent },
    ],
  },
]; 