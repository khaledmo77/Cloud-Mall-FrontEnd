import { CommonModule, isPlatformBrowser } from '@angular/common';

import { Component, Inject, PLATFORM_ID, OnInit, Input } from '@angular/core';

import { RouterLink, Router } from '@angular/router';
import { ClientLoginComponent } from "../../client/ClientAuth/Login/ClientLogin.component";
import { ClientRegisterComponent } from "../../client/ClientAuth/Register/ClientRegister.component";
import { VendorLoginComponent } from "../../vendor/VendorAuth/Login/VendorLogin.component";
import { VendorRegisterComponent } from "../../vendor/VendorAuth/Register/VendorRegister.component";



@Component({
  selector: 'app-LandingPage',
  standalone: true,
  imports: [CommonModule, RouterLink, ClientLoginComponent, ClientRegisterComponent, VendorLoginComponent, VendorRegisterComponent],
  templateUrl: './LandingPage.component.html',
  styleUrls: ['./LandingPage.component.scss']
})

export class LandingPageComponent {

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
      const token = localStorage.getItem('token');
      const name = localStorage.getItem('name'); // Make sure to store this during login

      this.isLoggedIn = !!token;
      this.name = name;
      console.log(this.isLoggedIn, this.name);
    }
  }

  // Method to handle navigation with authentication check for clients
  navigateWithAuth(route: string) {
    console.log("navigateWithAuth called with route:", route);
    console.log("Current isLoggedIn state:", this.isLoggedIn);
    if (this.isLoggedIn) {
      console.log("User is logged in, navigating to:", route);
      this.router.navigate([route]);
    } else {
      console.log("User is not logged in, opening client login");
      this.openClientLogin();
    }
  }

  // Method to handle navigation with authentication check for vendors
  navigateVendorWithAuth(route: string) {
    if (this.isLoggedIn) {
      this.router.navigate([route]);
    } else {
      this.openVendorLogin();
    }
  }

  openVendorLogin() {
    console.log("Opening Vendor Login");
    this.showVendorRegister = false; 
    this.showVendorLogin = true;
    this.showClientLogin = false;
    this.showClientRegister = false;
  }

  openClientLogin(){
    console.log("Opening Client Login - Method called");
    console.log("Previous state - showClientLogin:", this.showClientLogin);
    this.showClientLogin = true; // hide vendor login
    this.showClientRegister = false; // hide client register
    this.showVendorLogin = false;
    this.showVendorRegister = false;
    console.log("New state - showClientLogin:", this.showClientLogin);
    console.log("All popup states:", {
      showClientLogin: this.showClientLogin,
      showClientRegister: this.showClientRegister,
      showVendorLogin: this.showVendorLogin,
      showVendorRegister: this.showVendorRegister
    });
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
    this.showClientLogin = false;
    this.showClientRegister = false;
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
    this.refreshAuth(); // Refresh auth state after closing
  }

  refreshAuth() {
    if (this.isBrowser) {
      this.isLoggedIn = !!localStorage.getItem('token');
      this.name = localStorage.getItem('name');
    }
  }
}

