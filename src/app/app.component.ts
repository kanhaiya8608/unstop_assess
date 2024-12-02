import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // Standalone component usage
  imports: [RouterOutlet], // RouterOutlet for routing
  templateUrl: './app.component.html', // Template file reference
  styleUrls: ['./app.component.scss'], // Corrected styleUrls syntax
})
export class AppComponent {
  title = 'unstop_assess';
}
