import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preview-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-block.component.html',
  styleUrls: ['./preview-block.component.scss']
})
export class PreviewBlockComponent implements OnInit {
  html: SafeHtml | null = null;
  loading = true;
  error = '';

  constructor(
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    @Inject(DomSanitizer) private sanitizer: DomSanitizer,
    @Inject(HttpClient) private http: HttpClient,
    @Inject(ChangeDetectorRef) private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const block = params['block'];
      if (!block) {
        this.error = 'No block specified.';
        this.loading = false;
        this.cdr.markForCheck();
        return;
      }
      // Path relative to assets
      const url = `assets/blocks/${block}`;
      this.http.get(url, { responseType: 'text' }).subscribe({
        next: (html) => {
          this.html = this.sanitizer.bypassSecurityTrustHtml(html);
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.error = 'Failed to load block.';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    });
  }
}
