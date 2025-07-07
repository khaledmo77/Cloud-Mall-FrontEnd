import { CommonModule, isPlatformBrowser } from '@angular/common';

import { Component, Inject, PLATFORM_ID, OnInit, Input, HostListener } from '@angular/core';

import { RouterLink, Router } from '@angular/router';
import { ClientLoginComponent } from "../../client/ClientAuth/Login/ClientLogin.component";
import { ClientRegisterComponent } from "../../client/ClientAuth/Register/ClientRegister.component";
import { VendorLoginComponent } from "../../vendor/VendorAuth/Login/VendorLogin.component";
import { VendorRegisterComponent } from "../../vendor/VendorAuth/Register/VendorRegister.component";



@Component({
  selector: 'app-LandingPage',
  standalone: true,
  imports: [CommonModule, ClientLoginComponent, ClientRegisterComponent, VendorLoginComponent, VendorRegisterComponent],
  templateUrl: './LandingPage.component.html',
  styleUrls: ['./LandingPage.component.scss']
})

export class LandingPageComponent implements OnInit {

showVendorRegister = false;
  showClientRegister = false;
  showVendorLogin = false;
  showClientLogin = false;
  isLoggedIn = false;
  name: string | null = null;
  isBrowser: boolean;
   isScrolled = false;
    navOpen = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }


  ngOnInit(): void {
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      const name = localStorage.getItem('name'); // Make sure to store this during login

      this.isLoggedIn = !!token;
      this.name = name;
    }
  }

  // Method to handle navigation with authentication check for clients
  navigateWithAuth(route: string) {
    if (this.isLoggedIn) {
      this.router.navigate([route]);
    } else {
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
    this.showVendorRegister = false; 
    this.showVendorLogin = true;
    this.showClientLogin = false;
    this.showClientRegister = false;
  }

  openClientLogin(){
    this.showClientLogin = true; // hide vendor login
    this.showClientRegister = false; // hide client register
    this.showVendorLogin = false;
    this.showVendorRegister = false;
  }

  closeClientLogin() {
    this.showClientLogin = false;
    this.refreshAuth(); // Refresh auth state after closing
  }

  openVendorRegister() {
    this.showVendorLogin = false; // hide login
    this.showVendorRegister = true;
    this.showClientLogin = false;
    this.showClientRegister = false;
  }

  closeVendorRegister() {
    this.showVendorRegister = false;
    this.refreshAuth(); // Refresh auth state after closing
  }

  closeVendorLogin() {
    this.showVendorLogin = false;
    this.refreshAuth(); 
  }

  openClientRegister() {
    this.showClientRegister = true;
    this.showClientLogin = false;
    this.showVendorLogin = false;
    this.showVendorRegister = false;
  }

  closeClientRegister() {
    this.showClientRegister = false;
    this.refreshAuth(); // Refresh auth state after closing
  }

  refreshAuth() {
    if (this.isBrowser) {
      this.isLoggedIn = !!localStorage.getItem('token');
      this.name = localStorage.getItem('name');
    }
  }

    @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    this.isScrolled = scrollY > 50;
  }
    toggleNav() {
    this.navOpen = !this.navOpen;
  }

  scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

}

