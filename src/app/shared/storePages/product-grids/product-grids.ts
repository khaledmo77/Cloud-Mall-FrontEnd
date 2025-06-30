import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-grids',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-grids.html',
  styleUrls: ['./product-grids.scss']
})
export class ProductGrids {}
