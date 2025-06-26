import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorRegisterComponent } from '../../vendor/VendorAuth/Register/VendorRegister.component';
import { ClientRegisterComponent } from '../../client/ClientAuth/Register/ClientRegister.component'; // if you have it
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, VendorRegisterComponent, ClientRegisterComponent ,RouterLink], // Add ClientRegisterComponent if needed
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class navigationComponent {
  @Input() mode: 'client' | 'vendor' = 'client';

  showClientRegister = false;
  showVendorRegister = false;


  // ✅ Separate methods for vendor
  openVendorRegister() {
    console.log("Opening Vendor Register");
    this.showVendorRegister = true;
  }

  closeVendorRegister() {
    console.log("Closing Vendor Register");
    this.showVendorRegister = false;
  }

  // ✅ Separate methods for client
  openClientRegister() {
    console.log("Opening Client Register");
    this.showClientRegister = true;
  }

  closeClientRegister() {
    console.log("Closing Client Register");
    this.showClientRegister = false;
  }
}
