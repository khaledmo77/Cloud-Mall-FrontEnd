import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StoreHeader } from '../storeComponents/header/StoreHeader.component';
import { StoreFooterComponent } from '../storeComponents/footer/Storefooter.component';

@Component({
  selector: 'app-store-layout',
  standalone: true,
  imports: [RouterOutlet, StoreHeader, StoreFooterComponent],
  template: `
    <div class="store-app">
      <app-StoreHeader></app-StoreHeader>
      <router-outlet></router-outlet>
      <app-StoreFooter></app-StoreFooter>
    </div>
  `
})
export class StoreLayoutComponent implements OnInit, OnDestroy {
  private storeCssHref = 'assets/css/store-main.css';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // CSS files are now handled by Angular build process
      // Only load scripts that are not already included in index.html
      this.loadScript('assets/js/tiny-slider.js');
      this.loadScript('assets/js/glightbox.min.js');
      this.loadScript('assets/js/main.js');
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      const link = document.querySelector(`link[href="${this.storeCssHref}"]`);
      if (link) link.remove();
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