import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dashboard-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() loading: boolean = false;
}
