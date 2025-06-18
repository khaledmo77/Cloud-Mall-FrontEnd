import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-vendor-home',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './Vendorhome.component.html',
  styleUrls: ['./Vendorhome.component.scss']
})
export class VendorHomeComponent implements OnInit, AfterViewInit {
  title = 'Slick Landing Page';

  ngOnInit() {
    // Initialize any component logic here
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      this.initializeLandingPage();
    }
  }

  private initializeLandingPage() {
    // Hide preloader after page loads
    setTimeout(() => {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }
    }, 1000);

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.navbar-slick');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });

    // Form submission handling
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form submission logic here
        alert('Thank you for your message! We will get back to you soon.');
        (contactForm as HTMLFormElement).reset();
      });
    }
  }
}