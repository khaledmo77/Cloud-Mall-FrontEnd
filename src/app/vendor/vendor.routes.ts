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
import { PreviewBlockComponent } from './preview-block/preview-block.component';
import { roleGuard } from '../core/auth.guard';

export const VENDOR_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard(['Vendor'])],
    component: VendorLayoutComponent,
    children: [
      { path: '', component: VendorDashboardComponent },
      { path: 'dashboard', component: VendorDashboardComponent },
      { path: 'dashboard/preview', component: PreviewBlockComponent },
      { path: 'create-store', component: CreateStoreComponent },
      { path: 'store-settings', component: StoreSettingsComponent },
      { path: 'store-settings/:storeId', component: StoreSettingsComponent },
      { path: 'store-preview', component: StorePreviewComponent },
      { path: 'manage-products', component: ManageProductsComponent },
      { path: 'orders', component: VendorOrdersComponent },
    ],
  },
  { 
    path: ':vendorId/store/:storeId',
    loadChildren: () => import('../shared/storePages/store.routes').then(m => m.STORE_ROUTES)
  },
]; 