import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent implements OnInit {
  @Input() storeId: number | null = null;
  @Input() vendorId: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('Loader component initialized');
    console.log('Store ID:', this.storeId);
    console.log('Vendor ID:', this.vendorId);
    
    // Start the typing effect when the component initializes
    this.startTypingEffect();
    
    // The dashboard component will handle navigation after 2 seconds
    // We don't need to navigate here to avoid conflicts
  }

  private startTypingEffect() {
    const textToType = "QuickCrow";
    const targetElement = document.getElementById('loader-text');
    if (targetElement) {
      targetElement.textContent = textToType;
    }
  }
} 