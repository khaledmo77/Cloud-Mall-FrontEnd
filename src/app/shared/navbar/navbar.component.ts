import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterLink],
  template: `
    <nav>
      <a routerLink="/client">Client</a>
      <a routerLink="/vendor">Vendor</a>
      <a routerLink="/admin">Admin</a>
      <a routerLink="/delivery">Delivery</a>
    </nav>
  `,
  styles: [`
    nav {
      display: flex;
      gap: 1rem;
      background: #222;
      padding: 1rem;
      color: white;
    }
    a {
      color: white;
      text-decoration: none;
    }
  `]
})
export class NavbarComponent {}
