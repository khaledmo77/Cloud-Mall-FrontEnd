import { Component, AfterViewInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
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
  private initAttempts = 0;
  private maxInitAttempts = 10;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.initSlider();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['products'] && !changes['products'].firstChange) {
      // Wait for DOM to update, then reinitialize slider
      setTimeout(() => {
        this.destroySlider();
        this.initSlider();
        this.cdr.detectChanges();
      }, 100);
    }
  }

  private destroySlider() {
    if (this.slider && typeof this.slider.destroy === 'function') {
      try {
        this.slider.destroy();
      } catch (error) {
        console.warn('Error destroying slider:', error);
      }
      this.slider = null;
    }
    this.initAttempts = 0;
  }

  private initSlider() {
    if (this.initAttempts >= this.maxInitAttempts) {
      console.warn('Max slider initialization attempts reached');
      return;
    }

    // Check if Tiny Slider is available
    if (typeof tns !== 'function') {
      this.initAttempts++;
      setTimeout(() => this.initSlider(), 200);
      return;
    }

    // Check if we have products and the container exists
    if (!this.products || this.products.length === 0) {
      return;
    }

    const container = document.querySelector('.hero-slider');
    if (!container) {
      this.initAttempts++;
      setTimeout(() => this.initSlider(), 100);
      return;
    }

    try {
      // Destroy existing slider if it exists
      this.destroySlider();

      // Initialize new slider with enhanced options
      this.slider = tns({
        container: '.hero-slider',
        items: 1,
        slideBy: 'page',
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayButtonOutput: false,
        controls: true,
        nav: false,
        mouseDrag: true,
        touch: true,
        loop: true,
        rewind: true,
        gutter: 0,
        controlsText: ['<', '>'],
        responsive: {
          0: {
            items: 1
          },
          768: {
            items: 1
          },
          992: {
            items: 1
          }
        },
        onInit: () => {
          console.log('Hero slider initialized successfully');
          this.initAttempts = 0;
        },
        onTransitionStart: () => {
          // Ensure images stay within bounds during transition
          const slides = container.querySelectorAll('.single-slider');
          slides.forEach((slide: any) => {
            if (slide.style.backgroundImage) {
              slide.style.backgroundSize = 'cover';
              slide.style.backgroundPosition = 'center';
              slide.style.backgroundRepeat = 'no-repeat';
            }
          });
        }
      });

      // Ensure proper styling for all slides
      const slides = container.querySelectorAll('.single-slider');
      slides.forEach((slide: any) => {
        slide.style.backgroundSize = 'cover';
        slide.style.backgroundPosition = 'center';
        slide.style.backgroundRepeat = 'no-repeat';
        slide.style.minHeight = '400px';
        slide.style.position = 'relative';
        slide.style.overflow = 'hidden';
      });

    } catch (error) {
      console.error('Error initializing slider:', error);
      this.initAttempts++;
      setTimeout(() => this.initSlider(), 500);
    }
  }

  ngOnDestroy() {
    this.destroySlider();
  }
}
