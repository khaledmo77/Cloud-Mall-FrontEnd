import { LoginComponent } from './shared/login/login.component';
import { Routes } from '@angular/router';
import { ClientLayoutComponent } from './client/Layout/Clientlayout.component';
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
import { StoreListComponent } from './client/store-list/store-list.component';
import { StoreDetailsComponent } from './client/store-details/store-details.component';
import { ProductDetailsComponent } from './client/product-details/product-details.component';
import { OrdersComponent } from './client/orders/orders.component';
import { CartComponent } from './client/cart/cart.component';
import { CheckoutComponent } from './client/checkout/checkout.component';
import { VendorRegisterComponent } from './vendor/VendorAuth/Register/VendorRegister.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'client',
    component: ClientLayoutComponent,
    children: [{ path: '', component: ClientHomeComponent },
      {path: 'store-list',component:StoreListComponent}, // /client/store-list
      {path: 'store-details',component:StoreDetailsComponent},
      {path: 'product-details',component:ProductDetailsComponent},
      {path: 'orders',component:OrdersComponent},
      {path: 'cart',component:CartComponent},
      {path:'checkout',component:CheckoutComponent}

    ],
  },
  {
    path: 'vendor',
    component: VendorLayoutComponent,
    // canActivate: [VendorGuard], // Optional: protects the whole layout
    children: [
      { path: '', component: VendorHomeComponent }, // /vendor
      {path: 'register', component: VendorRegisterComponent}, // /vendor/register
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
