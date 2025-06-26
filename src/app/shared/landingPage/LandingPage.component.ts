import { CommonModule, isPlatformBrowser } from '@angular/common';

import { Component, Inject, PLATFORM_ID, OnInit, Input } from '@angular/core';

import { RouterLink, Router } from '@angular/router';
import { clientLoginComponent } from "../../client/ClientAuth/Login/ClientLogin.component";
import { ClientRegisterComponent } from "../../client/ClientAuth/Register/ClientRegister.component";



@Component({
  selector: 'app-LandingPage',
  standalone: true,
  imports: [CommonModule, RouterLink, clientLoginComponent, ClientRegisterComponent],
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

  // Method to handle navigation with authentication check
  navigateWithAuth(route: string) {
    if (this.isLoggedIn) {
      this.router.navigate([route]);
    } else {
      this.openClientLogin();
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
    this.refreshAuth(); // Refresh auth state after closing
  }

  refreshAuth() {
    if (this.isBrowser) {
      this.isLoggedIn = !!localStorage.getItem('token');
      this.name = localStorage.getItem('name');
    }
  }
}

