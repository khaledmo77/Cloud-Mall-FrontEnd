import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class navigationComponent {
  // @Input() leftLinks: { label: string; path: string }[] = [];
  // @Input() rightLinks: { label: string; path: string }[] = [];
  @Input() mode: 'client' | 'vendor' = 'client'; 
}
