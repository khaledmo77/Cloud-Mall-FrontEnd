import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-store-list',
  imports: [CommonModule],
  templateUrl: './store-list.component.html',
  styleUrl: './store-list.component.scss'
})
export class StoreListComponent {
   stores: Store[] = [
  {
    id: 1,
    name: 'store 1',
    image: 'assets/img/gallery/11.jpg',
    description: 'This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.'
  },
  {
    id: 2,
    name: 'store 2',
    image: 'assets/img/gallery/11.jpg',
    description: 'This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.'
  },
  {
    id: 3,
    name: 'store 3',
    image: 'assets/img/gallery/11.jpg',
    description: 'This is a longer card with supporting text below as a natural lead-in to additional content.'
  },
  {
    id: 4,
    name: 'store 4',
    image: 'assets/img/gallery/11.jpg',
    description: 'This is a longer card with supporting text below as a natural lead-in to additional content.'
  },
  {
    id: 5,
    name: 'store 5',
    image: 'assets/img/gallery/11.jpg',
    description: 'This is a longer card with supporting text below as a natural lead-in to additional content.'
  },
  {
    id: 6,
    name: 'store 6',
    image: 'assets/img/gallery/11.jpg',
    description: 'This is a longer card with supporting text below as a natural lead-in to additional content.'
  },
  {
    id: 7,
    name: 'store 7',
    image: 'assets/img/gallery/11.jpg',
    description: 'This is a longer card with supporting text below as a natural lead-in to additional content.'
  },
    {
    id: 8,
    name: 'store 8',
    image: 'assets/img/gallery/11.jpg',
    description: 'This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.'
  },
    {
    id: 9,
    name: 'store 9',
    image: 'assets/img/gallery/11.jpg',
    description: 'This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.'
  },

];//create array of stores
    
  
}
interface Store{
    id: number;
    name: string;
    image: string;
    description: string;
}
