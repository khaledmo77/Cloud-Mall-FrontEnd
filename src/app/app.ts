import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  template: `<router-outlet></router-outlet>`
})
export class App {
  protected title = 'cloudmall-frontend';
}
