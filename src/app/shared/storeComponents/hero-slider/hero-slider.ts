import { Component, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

declare var tns: any; // Tiny Slider global

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  templateUrl: './hero-slider.html',
  styleUrl: './hero-slider.scss',
  imports: [CommonModule]
})
export class HeroSlider implements AfterViewInit, OnChanges {
  @Input() products: any[] = [];
  @Input() isVendor: boolean = false;
  @Input() getProductImageUrl!: (imagesURL: string) => string;
  @Input() openProductModal!: (productId: number) => void;

  private slider: any;

  ngAfterViewInit() {
    this.initSlider();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['products'] && !changes['products'].firstChange) {
      setTimeout(() => this.initSlider(), 0);
    }
  }

  private initSlider() {
    if (this.slider && typeof this.slider.destroy === 'function') {
      this.slider.destroy();
    }
    if (typeof tns === 'function' && this.products && this.products.length > 0) {
      this.slider = tns({
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
    }
  }
}
