import { Component } from '@angular/core';
import { RouterOutlet,RouterLink, RouterLinkActive } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component'; 
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-layout',
  imports: [  RouterOutlet,
    RouterLinkActive,
    MatToolbarModule,
    RouterLink,
    MatGridListModule,
    MatIconModule,
    MatListModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class ClientLayoutComponent {

}
