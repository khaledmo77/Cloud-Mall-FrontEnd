import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent {
  showAdd = false;
  showConfirm = false;
  deleteIndex: number | null = null;
  newAdmin = { name: '', email: '' };
  admins = [
    { name: 'Super Admin', email: 'superadmin@example.com' },
    { name: 'Alice Admin', email: 'alice.admin@example.com' },
  ];

  addAdmin() {
    if (this.newAdmin.name && this.newAdmin.email) {
      this.admins.push({ ...this.newAdmin });
      this.newAdmin = { name: '', email: '' };
      this.showAdd = false;
    }
  }

  confirmDelete(index: number) {
    this.deleteIndex = index;
    this.showConfirm = true;
  }

  deleteConfirmed() {
    if (this.deleteIndex !== null) {
      this.admins.splice(this.deleteIndex, 1);
      this.deleteIndex = null;
      this.showConfirm = false;
    }
  }
}
