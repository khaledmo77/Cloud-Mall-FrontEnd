import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {
  showAdd = false;
  showConfirm = false;
  deleteIndex: number | null = null;
  newAdmin = { name: '', email: '', password: '', confirmPassword: '' };
  admins: any[] = [];
  loading = false;
  error = '';
  success = '';
  isSuperAdmin = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    // Check role from token (for demo, set true; in real app, decode token)
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.isSuperAdmin = payload.role === 'SuperAdmin';
      } catch {
        this.isSuperAdmin = false;
      }
    }
  }

  ngOnInit() {
    if (this.isSuperAdmin) {
      this.loading = true;
      this.error = '';
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      this.http.get<any>('https://cloudmall.runasp.net/api/Auth/SuperAdmin/GetAllAdminsBySuperAdmin', { headers })
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.admins = response.data;
            } else {
              this.error = response.message || 'Failed to fetch admins.';
            }
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.error = err.error?.message || 'Error fetching admins.';
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
    }
  }

  addAdmin() {
    if (this.newAdmin.name && this.newAdmin.email && this.newAdmin.password && this.newAdmin.confirmPassword) {
      this.loading = true;
      this.error = '';
      this.success = '';
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      this.http.post<any>(`${environment.apiBaseUrl}/Auth/SuperAdmin/CreateAdmin`, this.newAdmin, { headers })
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.admins.push({ name: this.newAdmin.name, email: this.newAdmin.email });
              this.success = 'Admin created successfully!';
              this.newAdmin = { name: '', email: '', password: '', confirmPassword: '' };
              this.showAdd = false;
            } else {
              this.error = response.message || 'Failed to create admin.';
            }
            this.loading = false;
          },
          error: (err) => {
            this.error = err.error?.message || 'Error creating admin.';
            this.loading = false;
          }
        });
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
