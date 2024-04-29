import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core';

interface PathProps {
  width: number;
  height: number;
  hole: {
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
    borderRadius: number;
    padding: number;
  };
}

@Directive({
  selector: '[highlightOverlay]',
  standalone: true,
})
export class HighlightOverlayDirective {
  @Input()
  set enabled(value: boolean) {
    this._enabled = value;

    this._setupOverlay();
  }

  private _elementRef = inject(ElementRef);
  private _renderer = inject(Renderer2);

  options = {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
  }

  private _enabled = false;

  private _setupOverlay(): void {
    if (this._enabled) {
      const overlay: HTMLElement = this._renderer.createElement('div');
      const border: HTMLElement = this._renderer.createElement('div');
      const body = document.body;

      this._renderer.addClass(overlay, 'overlay');
      this._renderer.addClass(border, 'overlay-border');
      this._renderer.appendChild(body, overlay);
      this._renderer.appendChild(overlay, border);

      const observer = new ResizeObserver((entries) => {
        const { width, height } = body.getBoundingClientRect();
        const { clientWidth, clientHeight, offsetLeft, offsetTop } = entries[0]
          .target as HTMLElement;

        this._renderer.setStyle(
          overlay,
          'clip-path',
          this._calculateClipPath({
            width,
            height,
            hole: {
              width: clientWidth,
              height: clientHeight,
              offsetX: offsetLeft,
              offsetY: offsetTop,
              borderRadius: this.options.borderRadius,
              padding: this.options.padding,
            },
          })
        );

        this._renderer.setStyle(border, 'width', `${clientWidth + this.options.padding + this.options.borderWidth * 2}px`);
        this._renderer.setStyle(border, 'height', `${clientHeight + this.options.padding + this.options.borderWidth * 2}px`);
        this._renderer.setStyle(border, 'top', `${-this.options.padding / 2 + offsetTop - this.options.borderWidth}px`);
        this._renderer.setStyle(border, 'left', `${-this.options.padding / 2 + offsetLeft - this.options.borderWidth}px`);
        this._renderer.setStyle(border, 'border-radius', `${this.options.borderRadius + this.options.borderWidth}px`);
      });

      observer.observe(this._elementRef.nativeElement);
    }
  }

  private _calculateClipPath(props: PathProps): string {
    const { width, height, hole } = props;
    const background = `M0 0 V${height} H${width} V0 H0 Z`;

    let {
      offsetX,
      offsetY,
      width: holeWidth,
      height: holeHeight,
      borderRadius,
      padding,
    } = hole;

    holeWidth += padding;
    holeHeight += padding;
    offsetX -= padding / 2;
    offsetY -= padding / 2;

    const holePath = [
      `M${offsetX + borderRadius} ${offsetY + holeHeight}`,
      `C${offsetX + borderRadius / 2} ${offsetY + holeHeight} ${offsetX} ${offsetY + holeHeight - borderRadius / 2} ${offsetX} ${offsetY + holeHeight - borderRadius}`,
      `V${offsetY + borderRadius}`,
      `C${offsetX} ${offsetY + borderRadius / 2} ${offsetX + borderRadius / 2} ${offsetY} ${offsetX + borderRadius} ${offsetY}`,
      `H${offsetX + holeWidth - borderRadius}`,
      `C${offsetX + holeWidth - borderRadius / 2} ${offsetY} ${offsetX + holeWidth} ${offsetY + borderRadius / 2} ${offsetX + holeWidth} ${offsetY + borderRadius}`,
      `V${offsetY + holeHeight - borderRadius}`,
      `C${offsetX + holeWidth} ${offsetY + holeHeight - borderRadius / 2} ${offsetX + holeWidth - borderRadius / 2} ${offsetY + holeHeight} ${offsetX + holeWidth - borderRadius} ${offsetY + holeHeight}`,
      'Z',
    ].join(' ');

    return `path(evenodd,'${background} ${holePath}')`;
  }
}
