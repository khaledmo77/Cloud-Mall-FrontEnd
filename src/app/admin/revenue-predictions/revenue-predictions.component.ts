import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ForecastMonth {
  month: number;
  trialVendors: number;
  newPayingVendors: number;
  totalPayingVendors: number;
  subscriptionRevenue: number;
  commissionRevenue: number;
  upsellRevenue: number;
  totalRevenue: number;
  mrr: number;
}

interface GanttPhase {
  name: string;
  startMonth: number;
  endMonth: number;
  color: string;
  description: string;
}

interface RevenueMetric {
  name: string;
  value: string | number;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-revenue-predictions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './revenue-predictions.component.html',
  styleUrls: ['./revenue-predictions.component.scss']
})
export class RevenuePredictionsComponent {
  // Revenue Model Constants
  vendorAcquisitionPerMonth = 100;
  trialDuration = 30; // days
  conversionRate = 0.25; // 25%
  subscriptionFee = 50; // $50/month
  commissionRate = 0.05; // 5%
  averageGMV = 2000; // $2,000
  upsellRevenue = 15; // $15 average

  // Key Metrics
  revenueMetrics: RevenueMetric[] = [
    {
      name: 'Vendor Acquisition',
      value: '100/month',
      description: 'New trial sign-ups per month',
      icon: 'bi-person-plus'
    },
    {
      name: 'Trial Duration',
      value: '30 days',
      description: 'Free use of platform features',
      icon: 'bi-calendar-check'
    },
    {
      name: 'Conversion Rate',
      value: '25%',
      description: 'SaaS industry average',
      icon: 'bi-arrow-up-circle'
    },
    {
      name: 'Subscription Fee',
      value: '$50/vendor',
      description: 'Monthly subscription after trial',
      icon: 'bi-currency-dollar'
    },
    {
      name: 'Commission Rate',
      value: '5%',
      description: 'Charged on all vendor sales',
      icon: 'bi-percent'
    },
    {
      name: 'Average GMV',
      value: '$2,000',
      description: 'Per vendor per month',
      icon: 'bi-graph-up'
    }
  ];

  // 6-Month Forecast Data
  forecastMonths: ForecastMonth[] = [
    { month: 1, trialVendors: 100, newPayingVendors: 0, totalPayingVendors: 0, subscriptionRevenue: 0, commissionRevenue: 10000, upsellRevenue: 0, totalRevenue: 10000, mrr: 0 },
    { month: 2, trialVendors: 100, newPayingVendors: 25, totalPayingVendors: 25, subscriptionRevenue: 1250, commissionRevenue: 11250, upsellRevenue: 250, totalRevenue: 12750, mrr: 1250 },
    { month: 3, trialVendors: 100, newPayingVendors: 25, totalPayingVendors: 50, subscriptionRevenue: 2500, commissionRevenue: 12500, upsellRevenue: 500, totalRevenue: 15500, mrr: 2500 },
    { month: 4, trialVendors: 100, newPayingVendors: 25, totalPayingVendors: 75, subscriptionRevenue: 3750, commissionRevenue: 13750, upsellRevenue: 750, totalRevenue: 18250, mrr: 3750 },
    { month: 5, trialVendors: 100, newPayingVendors: 25, totalPayingVendors: 100, subscriptionRevenue: 5000, commissionRevenue: 15000, upsellRevenue: 1000, totalRevenue: 21000, mrr: 5000 },
    { month: 6, trialVendors: 100, newPayingVendors: 25, totalPayingVendors: 125, subscriptionRevenue: 6250, commissionRevenue: 16250, upsellRevenue: 1250, totalRevenue: 23750, mrr: 6250 }
  ];

  // Gantt Chart Phases
  ganttPhases: GanttPhase[] = [
    {
      name: 'Platform Launch',
      startMonth: 1,
      endMonth: 1,
      color: '#ff6b6b',
      description: 'Initial platform launch with 100 trial vendors'
    },
    {
      name: 'Trial Conversion',
      startMonth: 2,
      endMonth: 3,
      color: '#4ecdc4',
      description: 'First wave of trial-to-paid conversions'
    },
    {
      name: 'Revenue Growth',
      startMonth: 4,
      endMonth: 6,
      color: '#45b7d1',
      description: 'Steady growth in MRR and commission revenue'
    },
    {
      name: 'Market Expansion',
      startMonth: 6,
      endMonth: 12,
      color: '#96ceb4',
      description: 'Scaling operations and expanding vendor base'
    }
  ];

  // Gantt Chart Methods
  getGanttPhaseWidth(phase: GanttPhase): string {
    const duration = phase.endMonth - phase.startMonth + 1;
    return `${duration * 16.67}%`; // 100% / 6 months = 16.67% per month
  }

  getGanttPhaseLeft(phase: GanttPhase): string {
    return `${(phase.startMonth - 1) * 16.67}%`;
  }

  getCurrentMonth(): number {
    return new Date().getMonth() + 1; // 1-based month
  }

  isPhaseActive(phase: GanttPhase): boolean {
    const currentMonth = this.getCurrentMonth();
    return currentMonth >= phase.startMonth && currentMonth <= phase.endMonth;
  }

  // Business Analysis Summary
  getBusinessSummary() {
    return {
      totalPayingVendors: 125,
      monthlyRecurringRevenue: 6250,
      totalMonthlyRevenue: 23750,
      estimatedCosts: '7,000-10,000',
      estimatedNetProfit: '13,000-16,000'
    };
  }
} 