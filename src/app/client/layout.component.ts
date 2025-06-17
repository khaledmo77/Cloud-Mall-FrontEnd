import { Component } from '@angular/core';
import { RouterOutlet,RouterLink, RouterLinkActive } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { NgIf } from '@angular/common';
import { navbarComponent } from "../shared/navbar/navbar.component";
import { footerComponent } from "../shared/footer/footer.component";

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,
    RouterLinkActive,
    MatToolbarModule,
    footerComponent,
    RouterLink,
    MatGridListModule,
    MatIconModule,
    MatListModule, navbarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class ClientLayoutComponent {

}
