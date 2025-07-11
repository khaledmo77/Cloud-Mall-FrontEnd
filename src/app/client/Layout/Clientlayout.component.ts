import { Component, Input } from '@angular/core';
import { RouterOutlet} from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';



import { footerComponent } from '../../shared/footer/footer.component';
import { navigationComponent } from '../../shared/navigation/navigation.component';


@Component({
  selector: 'app-client-layout',
  imports: [
    RouterOutlet,
    navigationComponent,
    MatToolbarModule,
    footerComponent,
    MatGridListModule,
    MatIconModule,
    MatListModule,
    
],
  templateUrl: './Clientlayout.component.html',
  styleUrl: './Clientlayout.component.scss',
})
export class ClientLayoutComponent {
  //    leftLinks =[
  //   { label: 'Home', path: '/client' },
  //   { label: 'Stores', path: '/client/store-list' },
  //   { label: 'Orders', path: '/client/orders' }
  //    ];
  // rightLinks = [
  //     { label: 'Cart', path: '/client/cart' },
  //   { label: 'Checkout', path: '/client/checkout' }
  // ];
}
