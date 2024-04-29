import { Component } from '@angular/core';
import { HighlightOverlayDirective } from '../highlight-overlay.directive';

@Component({
  selector: 'app-element-highlight',
  templateUrl: './element-highlight.component.html',
  styleUrls: ['./element-highlight.component.css'],
  standalone: true,
  imports: [HighlightOverlayDirective],
})
export class ElementHighlightComponent {
  highlightVisibility = true;
}
