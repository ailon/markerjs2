import { SvgHelper } from './core/SvgHelper';
import { Activator } from './core/Activator';
import { Renderer } from './core/Renderer';

import Logo from './assets/markerjs-logo-m.svg';
import { MarkerBase } from './core/MarkerBase';
import { DummyMarker } from '../test/manual';
import { Toolbar, ToolbarButtonType } from './ui/Toolbar';
import { Toolbox } from './ui/Toolbox';
import { RectangleMarker } from './markers/rectangle-marker/RectangleMarker';

export type MarkerAreaMode = 'select' | 'create' | 'delete';

export interface IPoint {
  x: number,
  y: number
}

export type RenderEventHandler = (dataURL: string) => void;
export type CloseEventHandler = () => void;

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

  private coverDiv: HTMLDivElement;
  private uiDiv: HTMLDivElement;
  private editorCanvas: HTMLDivElement;
  private editingTarget: HTMLImageElement;

  private logoUI: HTMLElement;

  private toolbarMarkers: typeof MarkerBase[] = [RectangleMarker, DummyMarker];

  private toolbar: Toolbar;
  private toolbox: Toolbox;

  private mode: MarkerAreaMode = 'select';

  private currentMarker?: MarkerBase;
  private markers: MarkerBase[] = [];

  private isDragging = false;

  // for preserving orginal window state before opening the editor
  private bodyOverflowState: string;
  private scrollYState: number;
  private scrollXState: number;

  private renderEventListeners: RenderEventHandler[] = [];
  private closeEventListeners: CloseEventHandler[] = [];

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
    this.overrideOverflow = this.overrideOverflow.bind(this);
    this.restoreOverflow = this.restoreOverflow.bind(this);
    this.close = this.close.bind(this);
    this.closeUI = this.closeUI.bind(this);
    this.addCloseEventListener = this.addCloseEventListener.bind(this);
    this.removeCloseEventListener = this.removeCloseEventListener.bind(this);
    this.addRenderEventListener = this.addRenderEventListener.bind(this);
    this.removeRenderEventListener = this.removeRenderEventListener.bind(this);
  }

  private open(): void {
    this.setEditingTarget();
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
    this.showUI();
    this.open();
  }

  public async render(): Promise<string> {
    const renderer = new Renderer();
    return await renderer.rasterize(this.target, this.markerImage);
  }

  public close(): void {
    // if (this.markerImage) {
    //   this.targetRoot.removeChild(this.markerImageHolder);
    // }
    // if (this.logoUI) {
    //   this.targetRoot.removeChild(this.logoUI);
    // }
    if (this.coverDiv) {
      this.closeUI();
    }
    this.closeEventListeners.forEach(listener => listener());
  }

  public addMarkersToToolbar(...markers: typeof MarkerBase[]): void {
    this.toolbarMarkers.push(...markers);
  }

  public addRenderEventListener(listener: RenderEventHandler): void {
    this.renderEventListeners.push(listener);
  }

  public removeRenderEventListener(listener: RenderEventHandler): void {
    if (this.renderEventListeners.indexOf(listener) > -1) {
      this.renderEventListeners.splice(
        this.renderEventListeners.indexOf(listener),
        1
      );
    }
  }

  public addCloseEventListener(listener: CloseEventHandler): void {
    this.closeEventListeners.push(listener);
  }

  public removeCloseEventListener(listener: CloseEventHandler): void {
    if (this.closeEventListeners.indexOf(listener) > -1) {
      this.closeEventListeners.splice(
        this.closeEventListeners.indexOf(listener),
        1
      );
    }
  }

  private setEditingTarget() {
    this.editingTarget.src = this.target.src;
    this.editingTarget.width = this.target.clientWidth;
    this.editingTarget.height = this.target.clientHeight;
  }

  private setTopLeft() {
    const targetRect = this.editingTarget.getBoundingClientRect();
    const bodyRect = this.editorCanvas.getBoundingClientRect();
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
    this.markerImage.setAttribute('width', this.editingTarget.width.toString());
    this.markerImage.setAttribute(
      'height',
      this.editingTarget.height.toString()
    );
    this.markerImage.setAttribute(
      'viewBox',
      '0 0 ' +
        this.editingTarget.width.toString() +
        ' ' +
        this.editingTarget.height.toString()
    );

    this.markerImageHolder.style.position = 'absolute';
    this.markerImageHolder.style.width = `${this.editingTarget.width}px`;
    this.markerImageHolder.style.height = `${this.editingTarget.height}px`;
    this.markerImageHolder.style.transformOrigin = 'top left';
    this.positionMarkerImage();

    this.defs = SvgHelper.createDefs();
    this.markerImage.appendChild(this.defs);

    this.markerImageHolder.appendChild(this.markerImage);

    this.editorCanvas.appendChild(this.markerImageHolder);
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

    this.editorCanvas.appendChild(this.logoUI);

    this.logoUI.style.position = 'absolute';
    this.positionLogo();
  }

  private positionLogo() {
    if (this.logoUI) {
      this.logoUI.style.left = `${this.markerImageHolder.offsetLeft + 10}px`;
      this.logoUI.style.top = `${
        this.markerImageHolder.offsetTop +
        this.markerImageHolder.offsetHeight -
        this.logoUI.clientHeight -
        10
      }px`;
    }
  }

  private overrideOverflow() {
    // backup current state of scrolling and overflow
    this.scrollXState = window.scrollX;
    this.scrollYState = window.scrollY;
    this.bodyOverflowState = document.body.style.overflow;

    window.scroll({ top: 0, left: 0 });
    document.body.style.overflow = 'hidden';
  }

  private restoreOverflow() {
    document.body.style.overflow = this.bodyOverflowState;
    window.scroll({ top: this.scrollYState, left: this.scrollXState });
  }

  private showUI(): void {
    this.overrideOverflow();

    this.coverDiv = document.createElement('div');
    this.coverDiv.style.position = 'absolute';
    this.coverDiv.style.top = '0px';
    this.coverDiv.style.left = '0px';
    this.coverDiv.style.width = '100vw';
    this.coverDiv.style.height = '100vh';
    this.coverDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
    this.coverDiv.style.zIndex = '1000';
    this.coverDiv.style.display = 'flex';

    document.body.appendChild(this.coverDiv);

    this.uiDiv = document.createElement('div');
    this.uiDiv.style.display = 'flex';
    this.uiDiv.style.flexDirection = 'column';
    this.uiDiv.style.flexGrow = '2';
    this.uiDiv.style.margin = '30px';
    this.uiDiv.style.border = '0px';
    this.uiDiv.style.backgroundColor = '#ffffff';
    this.coverDiv.appendChild(this.uiDiv);

    this.toolbar = new Toolbar(this.uiDiv, this.toolbarMarkers);
    this.toolbar.addButtonClickListener(this.toolbarButtonClicked);
    this.toolbar.show();

    this.editorCanvas = document.createElement('div');
    this.editorCanvas.style.flexGrow = '2';
    this.editorCanvas.style.position = 'relative';
    this.editorCanvas.style.overflow = 'auto';
    this.editorCanvas.style.display = 'flex';
    this.editorCanvas.style.alignItems = 'center';
    this.editorCanvas.style.justifyContent = 'center';
    this.uiDiv.appendChild(this.editorCanvas);

    this.editingTarget = document.createElement('img');
    this.editorCanvas.appendChild(this.editingTarget);

    this.toolbox = new Toolbox(this.uiDiv);
    this.toolbox.show();
  }

  private closeUI() {
    this.restoreOverflow();
    // @todo better cleanup
    document.body.removeChild(this.coverDiv);
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
        case 'close': {
          this.close();
          break;
        }
        case 'render': {
          this.renderClicked();
          break;
        }
      }
    }
  }

  private async renderClicked() {
    const result = await this.render();
    this.renderEventListeners.forEach((listener) => listener(result));
    this.close();
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
      this.currentMarker.mouseDown(
        this.clientToLocalCoordinates(ev.clientX, ev.clientY)
      );
      console.log('mouse down' + ev.target);
    } else if (this.mode === 'select') {
      const hitMarker = this.markers.find((m) => m.ownsTarget(ev.target));
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
    if (this.currentMarker !== undefined && this.isDragging) {
      this.currentMarker.manipulate(
        this.clientToLocalCoordinates(ev.clientX, ev.clientY)
      );
    }
  }
  private onMouseUp(ev: MouseEvent) {
    this.isDragging = false;
    if (this.currentMarker !== undefined) {
      this.currentMarker.mouseUp(
        this.clientToLocalCoordinates(ev.clientX, ev.clientY)
      );
    }
  }

  private clientToLocalCoordinates(x: number, y: number): IPoint {
    const clientRect = this.markerImage.getBoundingClientRect();
    return { x: x - clientRect.x, y: y - clientRect.y };
  }
}
