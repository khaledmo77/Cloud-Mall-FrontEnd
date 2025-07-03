import { Component, AfterViewInit } from '@angular/core';

declare var tns: any; // Tiny Slider global

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  templateUrl: './hero-slider.html',
  styleUrl: './hero-slider.scss'
})
export class HeroSlider implements AfterViewInit {
  ngAfterViewInit() {
    const tryInitSlider = () => {
      if (typeof tns === 'function') {
        tns({
          container: '.hero-slider',
          items: 1,
          slideBy: 'page',
          autoplay: true,
          controls: true,
          nav: false,
          autoplayButtonOutput: false,
          mouseDrag: true,
          gutter: 0,
          controlsText: ['<', '>']
        });
      } else {
        setTimeout(tryInitSlider, 100); // Try again in 100ms
      }
    };
    tryInitSlider();
  }
}
