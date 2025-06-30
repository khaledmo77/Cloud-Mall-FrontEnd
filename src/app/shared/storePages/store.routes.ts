import { Routes } from '@angular/router';
import { StoreLayoutComponent } from './StoreLayout.component';
import { Storehome } from './Storehome/Storehome.component';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { Login } from './login/login';
import { Register } from './register/register';
import { ProductGrids } from './product-grids/product-grids';
import { ProductDetails } from './product-details/product-details';
import { Cart } from './cart/cart';
import { Checkout } from './checkout/checkout';
import { Faq } from './faq/faq';
import { MailSuccess } from './mail-success/mail-success';
import { NotFound } from './not-found/not-found';

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
      { path: 'product-details', component: ProductDetails },
      { path: 'cart', component: Cart },
      { path: 'checkout', component: Checkout },
      { path: 'faq', component: Faq },
      { path: 'mail-success', component: MailSuccess },
      { path: '**', component: NotFound }
    ]
  }
];

export default routes; 