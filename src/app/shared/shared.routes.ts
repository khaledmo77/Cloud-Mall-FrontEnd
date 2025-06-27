import { Routes } from '@angular/router';
import { ClientLoginComponent } from '../client/ClientAuth/Login/ClientLogin.component';
import { ClientRegisterComponent } from '../client/ClientAuth/Register/ClientRegister.component';
import { VendorLoginComponent } from '../vendor/VendorAuth/Login/VendorLogin.component';
import { VendorRegisterComponent } from '../vendor/VendorAuth/Register/VendorRegister.component';

export const SHARED_ROUTES: Routes = [
  { path: 'client/login', component: ClientLoginComponent },
  { path: 'client/register', component: ClientRegisterComponent },
  { path: 'vendor/login', component: VendorLoginComponent },
  { path: 'vendor/register', component: VendorRegisterComponent },
]; 