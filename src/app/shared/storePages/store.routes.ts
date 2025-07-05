import { Routes } from '@angular/router';
import { StoreLayoutComponent } from './StoreLayout.component';
import { Storehome } from './Storehome/Storehome.component';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { Login } from './login/login';
import { Register } from './register/register';
import { ProductGrids } from './product-grids/product-grids';
import { ProductDetailsComponent } from './product-details/product-details';
import { StoreCartComponent } from './cart/cart';
import { StoreCheckoutComponent } from './checkout/checkout';
import { Faq } from './faq/faq';
import { MailSuccess } from './mail-success/mail-success';
import { NotFound } from './not-found/not-found';
import { StoreSettingsComponent } from '../../vendor/Store-Settings/StoreSettings.component';

const routes: Routes = [
  {
    path: '',
    component: StoreLayoutComponent,
    children: [
      { path: '', component: Storehome },
      { path: 'about', component: About },
      { path: 'contact', component: Contact },
      { path: 'login', component: Login },
      { path: 'register', component: Register },
      { path: 'product-grids', component: ProductGrids },
      { path: 'product-details', component: ProductDetailsComponent },
      { path: 'cart', component: StoreCartComponent },
      { path: 'checkout', component: StoreCheckoutComponent },
      { path: 'faq', component: Faq },
      { path: 'mail-success', component: MailSuccess },
      { path: 'storesettings', component: StoreSettingsComponent },
      { path: '**', component: NotFound }
    ]
  }
];

export const STORE_ROUTES = routes;
