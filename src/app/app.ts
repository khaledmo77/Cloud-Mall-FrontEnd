import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,    ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  template: `<router-outlet></router-outlet>`
})
export class App {
  protected title = 'cloudmall-frontend';
}
