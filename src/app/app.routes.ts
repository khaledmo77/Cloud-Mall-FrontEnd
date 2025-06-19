import { LoginComponent } from './shared/login/login.component';
import { Routes } from '@angular/router';
import { ClientLayoutComponent } from './client/Layout/layout.component';
import { ClientHomeComponent } from './client/Home/home.component';
import { VendorLayoutComponent } from './vendor/Layout/Vendorlayout.component';
import { VendorHomeComponent } from './vendor/Home/Vendorhome.component';
import { AdminLayoutComponent } from './admin/Layout/layout.component';
import { AdminHomeComponent } from './admin/Home/home.component';
import { DeliveryLayoutComponent } from './delivery/Layout/layout.component';
import { DeliveryHomeComponent } from './delivery/Home/home.component';
import { roleGuard } from './core/auth.guard';
import { CreateStoreComponent } from './vendor/Create-Store/CreateStore.Component';
import { StoreSettingsComponent } from './vendor/Store-Settings/StoreSettings.component';
import { StorePreviewComponent } from './vendor/Store-Preview/StorePreview.component';
import { ManageProductsComponent } from './vendor/Manage-Products/ManageProducts.component';
import { VendorOrdersComponent } from './vendor/Orders/VendorOrders.component';
import { VendorDashboardComponent } from './vendor/VendorDashboard/VendorDashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'client',
    component: ClientLayoutComponent,
    children: [{ path: '', component: ClientHomeComponent }],
  },
  {
    path: 'vendor',
    component: VendorLayoutComponent,
    // canActivate: [VendorGuard], // Optional: protects the whole layout
    children: [
      { path: '', component: VendorHomeComponent }, // /vendor
      { path: 'dashboard', component: VendorDashboardComponent }, // /vendor/dashboard
      { path: 'create-store', component: CreateStoreComponent }, // /vendor/create-store
      { path: 'store-settings', component: StoreSettingsComponent }, // /vendor/store-settings
      { path: 'store-preview', component: StorePreviewComponent }, // /vendor/store-preview
      { path: 'manage-products', component: ManageProductsComponent }, // /vendor/manage-products
      { path: 'orders', component: VendorOrdersComponent }, // /vendor/orders
    ],
  },
  {
    path: 'admin',
    canActivate: [roleGuard(['Admin'])],
    component: AdminLayoutComponent,
    children: [{ path: '', component: AdminHomeComponent }],
  },
  {
    path: 'delivery',
    component: DeliveryLayoutComponent,
    children: [{ path: '', component: DeliveryHomeComponent }],
  },
  { path: '', redirectTo: '/client', pathMatch: 'full' },
  { path: '**', redirectTo: '/client' },
];
