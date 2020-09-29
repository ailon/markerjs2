import { SvgHelper } from './core/SvgHelper';
import { Activator } from './core/Activator';
import { Renderer } from './core/Renderer';

import Logo from './assets/markerjs-logo-m.svg';
import { MarkerBase } from './core/MarkerBase';
import { DummyMarker } from '../test/manual';
import { Toolbar, ToolbarButtonType } from './ui/Toolbar';
import { Toolbox } from './ui/Toolbox';

export type MarkerAreaMode = 'select' | 'create' | 'delete';

export interface IPoint {
  x: number,
  y: number
}

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

  private toolbarMarkers: typeof MarkerBase[] = [DummyMarker];

  private toolbar: Toolbar;
  private toolbox: Toolbox;

  private mode: MarkerAreaMode = 'select';

  private currentMarker?: MarkerBase;
  private markers: MarkerBase[] = [];

  private isDragging = false;

  constructor(target: HTMLImageElement) {
    this.target = target;
    this.targetRoot = document.body; // @todo allow setting different roots (see v1)

    this.width = target.clientWidth;
    this.height = target.clientHeight;

    this.open = this.open.bind(this);
    this.setTopLeft = this.setTopLeft.bind(this);

    this.toolbarButtonClicked = this.toolbarButtonClicked.bind(this);
    this.createNewMarker = this.createNewMarker.bind(this);
    this.markerCreated = this.markerCreated.bind(this);
    this.setCurrentMarker = this.setCurrentMarker.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
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

  public show(): void {
    this.open();
    this.showUI();
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

  public addMarkersToToolbar(...markers: typeof MarkerBase[]): void {
    this.toolbarMarkers.push(...markers);
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
    this.markerImage.addEventListener('mousedown', this.onMouseDown);
    this.markerImage.addEventListener('mousemove', this.onMouseMove);
    this.markerImage.addEventListener('mouseup', this.onMouseUp);
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

  private showUI(): void {
    this.toolbar = new Toolbar(this.toolbarMarkers);
    this.toolbar.addButtonClickListener(this.toolbarButtonClicked);
    this.toolbar.show();

    this.toolbox = new Toolbox();
    this.toolbox.show();
  }

  private toolbarButtonClicked(
    buttonType: ToolbarButtonType,
    value?: typeof MarkerBase | string
  ) {
    if (buttonType === 'marker' && value !== undefined) {
      this.createNewMarker(<typeof MarkerBase>value);
    } else if (buttonType === 'action') {
      switch (value) {
        case 'select': {
          this.mode = 'select';
          break;
        }
        case 'delete': {
          if (this.currentMarker !== undefined) {
            this.currentMarker.dispose();
            this.markerImage.removeChild(this.currentMarker.container);
            this.markers.splice(this.markers.indexOf(this.currentMarker), 1);
          }
          break;
        }
      }
    }
  }

  private createNewMarker(markerType: typeof MarkerBase) {
    const g = SvgHelper.createGroup();
    this.markerImage.appendChild(g);

    this.currentMarker = new markerType(g);
    this.currentMarker.onMarkerCreated = this.markerCreated;
    console.log(this.currentMarker.name);
  }

  private markerCreated(marker: MarkerBase) {
    console.log('created');
    this.mode = 'select';
    this.toolbar.setSelectMode();
    this.markers.push(marker);
    this.setCurrentMarker(marker);
  }

  private setCurrentMarker(marker: MarkerBase) {
    if (this.currentMarker !== undefined) {
      this.currentMarker.deselect();
    }
    this.currentMarker = marker;
    this.currentMarker.select();
    this.toolbox.setPanels(this.currentMarker.toolboxPanels);
  }

  private onMouseDown(ev: MouseEvent) {
    console.log(ev.target);
    this.isDragging = true;
    if (
      this.currentMarker !== undefined &&
      (this.currentMarker.state === 'new' ||
        this.currentMarker.state === 'creating')
    ) {
      this.currentMarker.mouseDown(this.clientToLocalCoordinates(ev.clientX, ev.clientY));
      console.log('mouse down' + ev.target);
    } else if (this.mode === 'select') {
      const hitMarker = this.markers.find(m => m.ownsTarget(ev.target));
      if (hitMarker !== undefined) {
        this.setCurrentMarker(hitMarker);
        this.currentMarker.mouseDown(
          this.clientToLocalCoordinates(ev.clientX, ev.clientY), 
          ev.target
        );
      }
    }
  }

  private onMouseMove(ev: MouseEvent) {
    if (
      this.currentMarker !== undefined && this.isDragging
    ) {
      this.currentMarker.manipulate(this.clientToLocalCoordinates(ev.clientX, ev.clientY));
    }
  }
  private onMouseUp(ev: MouseEvent) {
    this.isDragging = false;
    if (
      this.currentMarker !== undefined
    ) {
      this.currentMarker.mouseUp(this.clientToLocalCoordinates(ev.clientX, ev.clientY));
    }
  }

  private clientToLocalCoordinates(x: number, y: number): IPoint {
    const clientRect = this.markerImage.getBoundingClientRect();
    return { x: (x - clientRect.x), y: (y - clientRect.y) };
  }
}
