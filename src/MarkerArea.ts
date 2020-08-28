import { SvgHelper } from './core/SvgHelper';
import { Activator } from './core/Activator';
import { Renderer } from './core/Renderer';

import Logo from './assets/markerjs-logo-m.svg';

export class MarkerArea {
  private target: HTMLImageElement;
  private targetRoot: HTMLElement;

  private width: number;
  private height: number;
  private left: number;
  private top: number;

  private markerImage: SVGSVGElement;
  private markerImageHolder: HTMLDivElement;
  private defs: SVGDefsElement;

  private logoUI: HTMLElement;

  constructor(target: HTMLImageElement) {
    this.target = target;
    this.targetRoot = document.body; // @todo allow setting different roots (see v1)

    this.width = target.clientWidth;
    this.height = target.clientHeight;

    this.open = this.open.bind(this);
    this.setTopLeft = this.setTopLeft.bind(this);
  }

  public open(): void {
    this.setTopLeft();
    this.initMarkerCanvas();
    this.attachEvents();

    // @todo restore state (see v1)

    if (!Activator.isLicensed) {
      // NOTE:
      // before removing this call please consider supporting marker.js
      // by visiting https://markerjs.com/ for details
      // thank you!
      this.addLogo();
    }
  }

  public async render(): Promise<string> {
    const renderer = new Renderer();
    return await renderer.rasterize(this.target, this.markerImage);
  }

  public close(): void {
    if (this.markerImage) {
        this.targetRoot.removeChild(this.markerImageHolder);
    }
    if (this.logoUI) {
        this.targetRoot.removeChild(this.logoUI);
    }
  }


  private setTopLeft() {
    const targetRect = this.target.getBoundingClientRect() as DOMRect;
    const bodyRect = this.targetRoot.parentElement.getBoundingClientRect();
    this.left = targetRect.left - bodyRect.left;
    this.top = targetRect.top - bodyRect.top;
  }

  private initMarkerCanvas(): void {
    this.markerImageHolder = document.createElement('div');
    // fix for Edge's touch behavior
    this.markerImageHolder.style.setProperty('touch-action', 'none');
    this.markerImageHolder.style.setProperty('-ms-touch-action', 'none');

    this.markerImage = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    this.markerImage.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.markerImage.setAttribute('width', this.width.toString());
    this.markerImage.setAttribute('height', this.height.toString());
    this.markerImage.setAttribute(
      'viewBox',
      '0 0 ' + this.width.toString() + ' ' + this.height.toString()
    );

    this.markerImageHolder.style.position = 'absolute';
    this.markerImageHolder.style.width = `${this.width}px`;
    this.markerImageHolder.style.height = `${this.height}px`;
    this.markerImageHolder.style.transformOrigin = 'top left';
    this.positionMarkerImage();

    this.defs = SvgHelper.createDefs();
    this.markerImage.appendChild(this.defs);

    this.markerImageHolder.appendChild(this.markerImage);

    this.targetRoot.appendChild(this.markerImageHolder);
  }

  private positionMarkerImage() {
    this.markerImageHolder.style.top = this.top + 'px';
    this.markerImageHolder.style.left = this.left + 'px';
  }

  private attachEvents() {
    this.markerImage.addEventListener('mousedown', this.mouseDown);
    this.markerImage.addEventListener('mousemove', this.mouseMove);
    this.markerImage.addEventListener('mouseup', this.mouseUp);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private mouseDown(event: MouseEvent) {
    // @todo handle all mouse events here (instead of attaching events on markers)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private mouseMove(event: MouseEvent) {
    // @todo handle all mouse events here (instead of attaching events on markers)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private mouseUp(event: MouseEvent) {
    // @todo handle all mouse events here (instead of attaching events on markers)
  }

  /**
   * NOTE:
   *
   * before removing or modifying this method please consider supporting marker.js
   * by visiting https://markerjs.com/#price for details
   *
   * thank you!
   */
  private addLogo() {
    this.logoUI = document.createElement('div');
    this.logoUI.style.display = 'inline-block';
    this.logoUI.style.margin = '0px';
    this.logoUI.style.padding = '0px';
    this.logoUI.style.fill = '#333333';

    const link = document.createElement('a');
    link.href = 'https://markerjs.com/';
    link.target = '_blank';
    link.innerHTML = Logo;
    link.title = 'Powered by marker.js';

    link.style.display = 'grid';
    link.style.alignItems = 'center';
    link.style.justifyItems = 'center';
    link.style.padding = '3px';
    link.style.width = '20px';
    link.style.height = '20px';

    this.logoUI.appendChild(link);

    this.targetRoot.appendChild(this.logoUI);

    this.logoUI.style.position = 'absolute';
    this.positionLogo();
  }

  private positionLogo() {
    if (this.logoUI) {
      this.logoUI.style.left = `${this.left + 10}px`;
      this.logoUI.style.top = `${
        this.top + this.target.offsetHeight - this.logoUI.clientHeight - 10
      }px`;
    }
  }
}
