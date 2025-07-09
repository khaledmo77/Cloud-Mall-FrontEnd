import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface RevenueExplanation {
  title: string;
  description: string;
  calculation: string;
  assumptions: string[];
  businessLogic: string;
}

@Component({
  selector: 'app-revenue-explanation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './revenue-explanation-modal.component.html',
  styleUrls: ['./revenue-explanation-modal.component.scss']
})
export class RevenueExplanationModalComponent {
  @Input() showModal = false;
  @Input() explanation: RevenueExplanation | null = null;
  @Output() closeModal = new EventEmitter<void>();

  getRevenueExplanations(): { [key: string]: RevenueExplanation } {
    return {
      'Total Revenue': {
        title: 'Total Revenue',
        description: 'The total gross revenue from all vendor sales on the platform',
        calculation: 'Sum of all order subtotals from all vendors',
        assumptions: [
          'Based on actual order data from vendor APIs',
          'Includes all completed orders regardless of status',
          'Represents gross merchandise value (GMV)'
        ],
        businessLogic: 'This represents the total economic activity on our platform. It\'s the foundation for calculating our commission revenue and understanding platform growth.'
      },
      'Commission Revenue': {
        title: 'Commission Revenue',
        description: 'Our primary revenue stream from taking a percentage of vendor sales',
        calculation: 'Total Revenue × 5% Commission Rate',
        assumptions: [
          '5% commission rate on all vendor sales',
          'Applied to both trial and paying vendors',
          'Standard SaaS marketplace model'
        ],
        businessLogic: 'Commission revenue is our core business model. We charge 5% on all sales, even during the 30-day free trial period. This ensures revenue from day one while vendors test our platform.'
      },
      'Subscription Revenue': {
        title: 'Subscription Revenue',
        description: 'Monthly recurring revenue from vendor subscription fees',
        calculation: 'Number of Paying Vendors × $50 Monthly Fee',
        assumptions: [
          '$50/month subscription fee per vendor',
          '25% trial-to-paid conversion rate',
          'Only applies to vendors after trial period'
        ],
        businessLogic: 'After the 30-day free trial, vendors pay a $50 monthly subscription fee. With an estimated 25% conversion rate, this creates predictable recurring revenue.'
      },
      'Upsell Revenue': {
        title: 'Upsell Revenue',
        description: 'Additional revenue from premium features and advertising',
        calculation: 'Number of Paying Vendors × $15 Average Upsell',
        assumptions: [
          '$10-20 per vendor for premium features',
          'Only available to paying subscribers',
          'Includes advertising, advanced analytics, etc.'
        ],
        businessLogic: 'Upsell revenue comes from premium features like advanced analytics, advertising placement, and enhanced store customization. This increases customer lifetime value.'
      }
    };
  }

  getBusinessModelExplanation(): string {
    return `
      <h5>Cloud Mall Revenue Model (30-Day Free Trial)</h5>
      <p><strong>Core Strategy:</strong> We operate on a freemium model with immediate revenue generation through commissions.</p>
      
      <h6>📊 Revenue Streams:</h6>
      <ul>
        <li><strong>Commission Revenue (Primary):</strong> 5% on all sales - generates revenue from day one</li>
        <li><strong>Subscription Revenue (Recurring):</strong> $50/month after 30-day trial</li>
        <li><strong>Upsell Revenue (Growth):</strong> $10-20/month for premium features</li>
      </ul>
      
      <h6>📈 Business Analysis:</h6>
      <ul>
        <li><strong>Vendor Acquisition:</strong> 100 new vendors/month with 30-day free trial</li>
        <li><strong>Conversion Rate:</strong> 25% trial-to-paid (industry standard)</li>
        <li><strong>Average GMV:</strong> $2,000 per vendor/month</li>
        <li><strong>Revenue Predictability:</strong> Commission revenue provides immediate cash flow</li>
      </ul>
      
      <h6>💡 Competitive Advantages:</h6>
      <ul>
        <li>Immediate revenue generation (no waiting for trial conversion)</li>
        <li>Scalable commission model (revenue grows with vendor sales)</li>
        <li>Multiple revenue streams reduce dependency on any single source</li>
        <li>Freemium model reduces vendor acquisition costs</li>
      </ul>
    `;
  }

  onClose() {
    this.closeModal.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
} 