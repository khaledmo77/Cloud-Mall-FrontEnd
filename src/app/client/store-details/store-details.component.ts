import { Component } from '@angular/core';
import { Storehome } from '../../shared/storePages/Storehome/Storehome.component';

@Component({
  selector: 'app-store-details',
  imports: [Storehome],
  template: '<app-Storehome></app-Storehome>',
  styleUrl: './store-details.component.scss'
})
export class StoreDetailsComponent {

}
