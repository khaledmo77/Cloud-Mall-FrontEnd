import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent {
  stores = [
    { name: 'Tech Store', owner: 'Alice Smith' },
    { name: 'Fashion Hub', owner: 'Bob Johnson' },
    { name: 'Book World', owner: 'Carol Lee' },
    { name: 'Gadget Zone', owner: 'David Kim' },
  ];
}
