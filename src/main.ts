import 'zone.js';
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { ElementHighlightComponent } from './element-highlight/element-highlight.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-element-highlight />
  `,
  imports: [ElementHighlightComponent],
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);
