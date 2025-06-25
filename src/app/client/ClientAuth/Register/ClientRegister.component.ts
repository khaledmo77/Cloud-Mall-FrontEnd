import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import {  Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-ClientRegister',
  imports: [    MatDialogModule],
  templateUrl: './ClientRegister.component.html',
  styleUrl: './ClientRegister.component.scss'
})
export class ClientRegisterComponent {
  @Output() close = new EventEmitter<void>();
  
  closePopup() {
    this.close.emit();
  }
}
