import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StoreHeader } from '../storeComponents/header/StoreHeader.component';
import { StoreFooterComponent } from '../storeComponents/footer/Storefooter.component';

@Component({
  selector: 'app-store-layout',
  standalone: true,
  imports: [RouterOutlet, StoreHeader, StoreFooterComponent],
  template: `
    <app-StoreHeader></app-StoreHeader>
    <router-outlet></router-outlet>
    <app-StoreFooter></app-StoreFooter>
  `
})
export class StoreLayoutComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadStyle('assets/css/LineIcons.3.0.css');
      this.loadStyle('assets/css/tiny-slider.css');
      this.loadStyle('assets/css/glightbox.min.css');
      this.loadStyle('assets/css/main.css');
      this.loadScript('assets/js/tiny-slider.js');
      this.loadScript('assets/js/glightbox.min.js');
      this.loadScript('assets/js/main.js');
    }
  }
  loadStyle(href: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
    }
  }
  loadScript(src: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }
} 