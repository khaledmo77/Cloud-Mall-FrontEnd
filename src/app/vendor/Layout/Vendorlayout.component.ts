import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { NgIf } from '@angular/common';
import { preloaderComponent } from '../../shared/preloader/preloader.component';
import { navigationComponent } from '../../shared/navigation/navigation.component';

@Component({
  selector: 'app-vendor-layout',
  imports: [
    RouterOutlet,
    preloaderComponent,
    navigationComponent,
    MatToolbarModule,
    MatGridListModule,
    MatIconModule,
    MatListModule,
  
  ],
  templateUrl: './Vendorlayout.component.html',
  styleUrl: './Vendorlayout.component.scss',
})
export class VendorLayoutComponent {}
