import { Component } from '@angular/core';
import { RouterOutlet,RouterLink, RouterLinkActive } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-footer',
  imports: [  RouterOutlet,
    RouterLinkActive,
    MatToolbarModule,
    RouterLink,
    MatGridListModule,
    MatIconModule,
    MatListModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class footerComponent {

}
