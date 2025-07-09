import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Client {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface ClientsResponse {
  success: boolean;
  data: Client[];
  message?: string;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  loading = false;
  error = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.loading = true;
    this.error = '';
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<ClientsResponse>('https://cloudmall.runasp.net/api/Auth/Admin/GetAllClientsByAdmin', { headers })
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.clients = response.data;
          } else {
            this.error = response.message || 'Failed to fetch clients.';
          }
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = err.error?.message || 'Error fetching clients.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }
} 