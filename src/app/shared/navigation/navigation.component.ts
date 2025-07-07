import { Component, Inject, PLATFORM_ID, OnInit, Input } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { VendorRegisterComponent } from '../../vendor/VendorAuth/Register/VendorRegister.component';

import { VendorLoginComponent } from '../../vendor/VendorAuth/Login/VendorLogin.component';
import { ClientRegisterComponent } from '../../client/ClientAuth/Register/ClientRegister.component';
import { ClientLoginComponent } from "../../client/ClientAuth/Login/ClientLogin.component";

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,

  imports: [CommonModule, VendorRegisterComponent, ClientRegisterComponent, VendorLoginComponent, ClientLoginComponent,RouterLink],

  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class navigationComponent implements OnInit {
  @Input() mode: 'client' | 'vendor' = 'client';

showVendorRegister = false;
  showClientRegister = false;
  showVendorLogin = false;
  showClientLogin = false;
  isLoggedIn = false;
  name: string | null = null;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.refreshAuth(); // Use the same method for consistency
    }
  }

  logout() {
    if (this.isBrowser) {
      // Clear all session data
      localStorage.removeItem('token');
      localStorage.removeItem('name');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      localStorage.removeItem('vendorId');
      
      // Update component state
      this.isLoggedIn = false;
      this.name = null;
      
      console.log('Logged out successfully');
      
      // Navigate to landing page
      this.router.navigate(['/landing']);
    }
  }

  openVendorLogin() {
    console.log("Opening Vendor Login");
      this.showVendorRegister = false; 
    this.showVendorLogin = true;
  }
  openClientLogin(){
  console.log("Opening Client Login");
    this.showClientLogin = true; // hide vendor login
    this.showClientRegister = false; // hide client register
      this.showVendorLogin = false;
  this.showVendorRegister = false;
  }
  closeClientLogin() {
    console.log("Closing Client Login");
    this.showClientLogin = false;
    this.refreshAuth(); // Refresh auth state after closing
  }
openVendorRegister() {
  console.log("Opening Vendor Register");
  this.showVendorLogin = false; // hide login
  this.showVendorRegister = true;
}
closeVendorRegister() {
  console.log("Closing Vendor Register");
  this.showVendorRegister = false;
  this.refreshAuth(); // Refresh auth state after closing
}

  closeVendorLogin() {
    console.log("Closing Vendor Login");
    this.showVendorLogin = false;
    this.refreshAuth(); 
  }

  openClientRegister() {
    console.log("Opening Client Register");
    this.showClientRegister = true;
      this.showClientLogin = false;
     this.showVendorLogin = false;
  this.showVendorRegister = false;
  }

  closeClientRegister() {
    console.log("Closing Client Register");
    this.showClientRegister = false;
  }

  refreshAuth() {
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      const name = localStorage.getItem('name');
      const role = localStorage.getItem('role');
      
      this.isLoggedIn = !!token;
      this.name = name;
      
      console.log('refreshAuth - token:', token, 'name:', name, 'role:', role, 'isLoggedIn:', this.isLoggedIn);
    }
  }
}
