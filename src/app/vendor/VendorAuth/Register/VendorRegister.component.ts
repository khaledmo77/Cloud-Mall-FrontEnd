import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import {  Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-VendorRegister',
  imports: [    MatDialogModule],
  templateUrl: './VendorRegister.component.html',
  styleUrl: './VendorRegister.component.scss'
})
export class VendorRegisterComponent {
  @Output() close = new EventEmitter<void>();
  
  closePopup() {
    this.close.emit();
  }
}
