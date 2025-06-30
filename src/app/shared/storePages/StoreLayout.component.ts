import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-store-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class StoreLayoutComponent implements OnInit {
  ngOnInit() {
    this.loadStyle('assets/css/LineIcons.3.0.css');
    this.loadStyle('assets/css/tiny-slider.css');
    this.loadStyle('assets/css/glightbox.min.css');
    this.loadStyle('assets/css/main.css');
    this.loadScript('assets/js/tiny-slider.js');
    this.loadScript('assets/js/glightbox.min.js');
    this.loadScript('assets/js/main.js');
  }
  loadStyle(href: string) {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  }
  loadScript(src: string) {
    if (!document.querySelector(`script[src="${src}"]`)) {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    }
  }
} 