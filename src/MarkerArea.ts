import { SvgHelper } from './core/SvgHelper';
import { Activator } from './core/Activator';
import { Renderer } from './core/Renderer';

import Logo from './assets/markerjs-logo-m.svg';
import { MarkerBase } from './core/MarkerBase';
import { Toolbar, ToolbarButtonType } from './ui/Toolbar';
import { Toolbox } from './ui/Toolbox';
import { FrameMarker } from './markers/frame-marker/FrameMarker';
import { Settings } from './core/Settings';
import { Style } from './core/Style';
import { LineMarker } from './markers/line-marker/LineMarker';
import { TextMarker } from './markers/text-marker/TextMarker';
import { FreehandMarker } from './markers/freehand-marker/FreehandMarker';
import { ArrowMarker } from './markers/arrow-marker/ArrowMarker';
import { CoverMarker } from './markers/cover-marker/CoverMarker';
import { HighlightMarker } from './markers/highlight-marker/HighlightMarker';
import { CalloutMarker } from './markers/callout-marker/CalloutMarker';
import { MarkerAreaState } from './MarkerAreaState';
import { EllipseMarker } from './markers/ellipse-marker/EllipseMarker';
import { IStyleSettings } from './core/IStyleSettings';
import { MeasurementMarker } from './markers/measurement-marker/MeasurementMarker';
import { IPoint } from './core/IPoint';

export type MarkerAreaMode = 'select' | 'create' | 'delete';

export type MarkerTypeIdentifier = string | typeof MarkerBase;

export type RenderEventHandler = (dataURL: string, state?: MarkerAreaState) => void;
export type CloseEventHandler = () => void;

export class MarkerArea {
  private target: HTMLImageElement;
  public targetRoot: HTMLElement;

  private width: number;
  private height: number;
  private imageWidth: number;
  private imageHeight: number;
  private left: number;
  private top: number;

  private markerImage: SVGSVGElement;
  private markerImageHolder: HTMLDivElement;
  private defs: SVGDefsElement;

  private coverDiv: HTMLDivElement;
  private uiDiv: HTMLDivElement;
  private contentDiv: HTMLDivElement;
  private editorCanvas: HTMLDivElement;
  private editingTarget: HTMLImageElement;
  private overlayContainer: HTMLDivElement;

  private logoUI: HTMLElement;

  public get ALL_MARKER_TYPES(): typeof MarkerBase[] { 
    return [
      FrameMarker,
      FreehandMarker,
      ArrowMarker,
      TextMarker,
      EllipseMarker,
      HighlightMarker,
      CalloutMarker,
      MeasurementMarker,
      CoverMarker,
      LineMarker
    ];
  }

  public get DEFAULT_MARKER_TYPES(): typeof MarkerBase[] { 
    return [
      FrameMarker,
      FreehandMarker,
      ArrowMarker,
      TextMarker,
      EllipseMarker,
      HighlightMarker,
      CalloutMarker
    ];
  }

  public get BASIC_MARKER_TYPES(): typeof MarkerBase[] { 
    return [
      FrameMarker,
      FreehandMarker,
      ArrowMarker,
      TextMarker,
      HighlightMarker
    ];
  }

  private _availableMarkerTypes: typeof MarkerBase[] = this.DEFAULT_MARKER_TYPES;

  public get availableMarkerTypes(): MarkerTypeIdentifier[] {
    return this._availableMarkerTypes;
  }

  public set availableMarkerTypes(value: MarkerTypeIdentifier[]) {
    this._availableMarkerTypes.splice(0);
    value.forEach(mt => {
      if (typeof mt === 'string') {
        const typeType = this.ALL_MARKER_TYPES.find(allT => allT.typeName === mt);
        if (typeType !== undefined) {
          this._availableMarkerTypes.push(typeType);
        }
      } else {
        this._availableMarkerTypes.push(mt);
      }
    });
  }

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

  public settings: Settings = new Settings();
  public uiStyleSettings: IStyleSettings = Style.settings;

  private _isOpen = false;
  public get isOpen(): boolean {
    return this._isOpen;
  }

  public renderAtNaturalSize = false;
  public renderImageType = 'image/png';
  public renderImageQuality?: number;
  public renderMarkersOnly = false;

  constructor(target: HTMLImageElement) {
    this.target = target;
    this.targetRoot = document.body;

    this.width = target.clientWidth;
    this.height = target.clientHeight;

    this.open = this.open.bind(this);
    this.setTopLeft = this.setTopLeft.bind(this);

    this.toolbarButtonClicked = this.toolbarButtonClicked.bind(this);
    this.createNewMarker = this.createNewMarker.bind(this);
    this.addNewMarker = this.addNewMarker.bind(this);
    this.markerCreated = this.markerCreated.bind(this);
    this.setCurrentMarker = this.setCurrentMarker.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onDblClick = this.onDblClick.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.overrideOverflow = this.overrideOverflow.bind(this);
    this.restoreOverflow = this.restoreOverflow.bind(this);
    this.close = this.close.bind(this);
    this.closeUI = this.closeUI.bind(this);
    this.addCloseEventListener = this.addCloseEventListener.bind(this);
    this.removeCloseEventListener = this.removeCloseEventListener.bind(this);
    this.addRenderEventListener = this.addRenderEventListener.bind(this);
    this.removeRenderEventListener = this.removeRenderEventListener.bind(this);
    this.clientToLocalCoordinates = this.clientToLocalCoordinates.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
  }

  private open(): void {
    this.setEditingTarget();
    this.setTopLeft();
    this.initMarkerCanvas();
    this.initOverlay();
    this.attachEvents();

    if (!Activator.isLicensed) {
      // NOTE:
      // before removing this call please consider supporting marker.js
      // by visiting https://markerjs.com/ for details
      // thank you!
      this.addLogo();
    }

    this._isOpen = true;
  }

  public show(): void {
    this.showUI();
    this.open();
  }

  public async render(): Promise<string> {
    this.setCurrentMarker();
    const renderer = new Renderer();
    renderer.naturalSize = this.renderAtNaturalSize;
    renderer.imageType = this.renderImageType;
    renderer.imageQuality = this.renderImageQuality;
    renderer.markersOnly = this.renderMarkersOnly;
    return await renderer.rasterize(this.target, this.markerImage);
  }

  public close(): void {
    if (this.isOpen) {
      // if (this.markerImage) {
      //   this.targetRoot.removeChild(this.markerImageHolder);
      // }
      // if (this.logoUI) {
      //   this.targetRoot.removeChild(this.logoUI);
      // }
      if (this.coverDiv) {
        this.closeUI();
      }
      this.closeEventListeners.forEach((listener) => listener());
      this._isOpen = false;
    }
  }

  public addMarkersToToolbar(...markers: typeof MarkerBase[]): void {
    this._availableMarkerTypes.push(...markers);
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
    this.imageWidth = Math.round(this.target.clientWidth);
    this.imageHeight = Math.round(this.target.clientHeight);
    this.editingTarget.src = this.target.src;
    this.editingTarget.width = this.imageWidth;
    this.editingTarget.height = this.imageHeight;
    this.editingTarget.style.width = `${this.imageWidth}px`;
    this.editingTarget.style.height = `${this.imageHeight}px`;
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
    this.markerImage.setAttribute('width', this.imageWidth.toString());
    this.markerImage.setAttribute(
      'height',
      this.imageHeight.toString()
    );
    this.markerImage.setAttribute(
      'viewBox',
      '0 0 ' +
        this.imageWidth.toString() +
        ' ' +
        this.imageHeight.toString()
    );
    this.markerImage.style.pointerEvents = 'auto';

    this.markerImageHolder.style.position = 'absolute';
    this.markerImageHolder.style.width = `${this.imageWidth}px`;
    this.markerImageHolder.style.height = `${this.imageHeight}px`;
    this.markerImageHolder.style.transformOrigin = 'top left';
    this.positionMarkerImage();

    this.defs = SvgHelper.createDefs();
    this.markerImage.appendChild(this.defs);

    this.markerImageHolder.appendChild(this.markerImage);

    this.editorCanvas.appendChild(this.markerImageHolder);
  }

  private initOverlay(): void {
    this.overlayContainer = document.createElement('div');
    this.overlayContainer.style.position = 'absolute';
    this.overlayContainer.style.left = '0px';
    this.overlayContainer.style.top = '0px';
    this.overlayContainer.style.width = `${this.imageWidth}px`;
    this.overlayContainer.style.height = `${this.imageHeight}px`;
    this.overlayContainer.style.display = 'flex';
    this.markerImageHolder.appendChild(this.overlayContainer);
  }

  private positionMarkerImage() {
    this.markerImageHolder.style.top = this.top + 'px';
    this.markerImageHolder.style.left = this.left + 'px';
  }

  private attachEvents() {
    this.markerImage.addEventListener('pointerdown', this.onPointerDown);
    this.markerImage.addEventListener('dblclick', this.onDblClick);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('resize', this.onWindowResize)
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
    this.logoUI.style.pointerEvents = 'all';
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
    if (this.settings.displayMode === 'popup') {
      this.overrideOverflow();
    }

    this.coverDiv = document.createElement('div');
    this.coverDiv.className = Style.CLASS_PREFIX;
    switch(this.settings.displayMode) {
      case 'inline': {
        this.coverDiv.style.position = 'absolute';
        const coverTop =
          this.target.offsetTop > Style.settings.toolbarHeight
            ? this.target.offsetTop - Style.settings.toolbarHeight
            : 0;
        this.coverDiv.style.top = `${coverTop}px`;
        this.coverDiv.style.left = `${this.target.offsetLeft.toString()}px`;
        this.coverDiv.style.width = `${this.target.offsetWidth.toString()}px`;
        //this.coverDiv.style.height = `${this.target.offsetHeight.toString()}px`;
        this.coverDiv.style.zIndex = '1000';
        // flex causes the ui to stretch when toolbox has wider nowrap panels
        //this.coverDiv.style.display = 'flex';
        break;
      }
      case 'popup': {
        this.coverDiv.style.position = 'absolute';
        this.coverDiv.style.top = '0px';
        this.coverDiv.style.left = '0px';
        this.coverDiv.style.width = '100vw';
        this.coverDiv.style.height = '100vh';
        this.coverDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        this.coverDiv.style.zIndex = '1000';
        this.coverDiv.style.display = 'flex';
      }
    }
    this.targetRoot.appendChild(this.coverDiv);

    this.uiDiv = document.createElement('div');
    this.uiDiv.style.display = 'flex';
    this.uiDiv.style.flexDirection = 'column';
    this.uiDiv.style.flexGrow = '2';
    this.uiDiv.style.margin = this.settings.displayMode === 'popup' ? '30px' : '0px';
    this.uiDiv.style.border = '0px';
    this.uiDiv.style.backgroundColor = '#ffffff';
    this.coverDiv.appendChild(this.uiDiv);

    this.toolbar = new Toolbar(this.uiDiv, this._availableMarkerTypes, this.uiStyleSettings);
    this.toolbar.addButtonClickListener(this.toolbarButtonClicked);
    this.toolbar.show();

    this.contentDiv = document.createElement('div');
    this.contentDiv.style.display = 'flex';
    this.contentDiv.style.flexDirection = 'row';
    this.contentDiv.style.flexGrow = '2';
    this.uiDiv.appendChild(this.contentDiv);

    this.editorCanvas = document.createElement('div');
    this.editorCanvas.style.flexGrow = '2';
    this.editorCanvas.style.position = 'relative';
    this.editorCanvas.style.overflow = 'hidden';
    this.editorCanvas.style.display = 'flex';
    if (this.settings.displayMode === 'popup') {
      this.editorCanvas.style.alignItems = 'center';
      this.editorCanvas.style.justifyContent = 'center';
    }
    this.editorCanvas.style.pointerEvents = 'none';
    this.contentDiv.appendChild(this.editorCanvas);

    this.editingTarget = document.createElement('img');
    this.editorCanvas.appendChild(this.editingTarget);

    this.toolbox = new Toolbox(this.uiDiv, this.settings.displayMode, this.uiStyleSettings);
    this.toolbox.show();
  }

  private closeUI() {
    if (this.settings.displayMode === 'popup') {
      this.restoreOverflow();
    }
    // @todo better cleanup
    this.targetRoot.removeChild(this.coverDiv);
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
          if (this.currentMarker !== undefined) {
            this.currentMarker.select();
          }
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
    const state = this.getState();
    this.renderEventListeners.forEach((listener) => listener(result, state));
    this.close();
  }

  public getState(): MarkerAreaState {
    const result: MarkerAreaState = { 
      width: this.width,
      height: this.height,
      markers: [] 
    };
    this.markers.forEach(marker => result.markers.push(marker.getState()));
    return result;
  }

  public restoreState(state: MarkerAreaState): void {
    this.markers.splice(0);
    state.markers.forEach(markerState => {
      const markerType = this._availableMarkerTypes.find(mType => mType.typeName === markerState.typeName);
      if (markerType !== undefined) {
        const marker = this.addNewMarker(markerType);
        marker.restoreState(markerState);
        this.markers.push(marker);
      }
    })
  }

  private addNewMarker(markerType: typeof MarkerBase): MarkerBase {
    const g = SvgHelper.createGroup();
    this.markerImage.appendChild(g);

    return new markerType(
      g,
      this.overlayContainer,
      this.settings
    );
  }

  private createNewMarker(markerType: typeof MarkerBase) {
    this.setCurrentMarker();
    this.currentMarker = this.addNewMarker(markerType);
    this.currentMarker.onMarkerCreated = this.markerCreated;
    this.markerImage.style.cursor = 'crosshair';
    this.toolbox.setPanelButtons(this.currentMarker.toolboxPanels);
  }

  private markerCreated(marker: MarkerBase) {
    this.mode = 'select';
    this.markerImage.style.cursor = 'default';
    this.toolbar.setSelectMode();
    this.markers.push(marker);
    this.setCurrentMarker(marker);
  }

  private setCurrentMarker(marker?: MarkerBase) {
    if (this.currentMarker !== undefined) {
      this.currentMarker.deselect();
      this.toolbar.setCurrentMarker();
      this.toolbox.setPanelButtons([]);
    }
    this.currentMarker = marker;
    if (this.currentMarker !== undefined) {
      this.currentMarker.select();
      this.toolbar.setCurrentMarker(this.currentMarker);
      this.toolbox.setPanelButtons(this.currentMarker.toolboxPanels);
    }
  }

  private onPointerDown(ev: PointerEvent) {
    if (
      this.currentMarker !== undefined &&
      (this.currentMarker.state === 'new' ||
        this.currentMarker.state === 'creating')
    ) {
      this.isDragging = true;
      this.currentMarker.pointerDown(
        this.clientToLocalCoordinates(ev.clientX, ev.clientY)
      );
    } else if (this.mode === 'select') {
      const hitMarker = this.markers.find((m) => m.ownsTarget(ev.target));
      if (hitMarker !== undefined) {
        this.setCurrentMarker(hitMarker);
        this.isDragging = true;
        this.currentMarker.pointerDown(
          this.clientToLocalCoordinates(ev.clientX, ev.clientY),
          ev.target
        );
      } else {
        this.setCurrentMarker();
      }
    }
  }

  private onDblClick(ev: PointerEvent) {
    if (this.mode === 'select') {
      const hitMarker = this.markers.find((m) => m.ownsTarget(ev.target));
      if (hitMarker !== undefined && hitMarker !== this.currentMarker) {
        this.setCurrentMarker(hitMarker);
      }
      if (this.currentMarker !== undefined) {
        this.currentMarker.dblClick(
          this.clientToLocalCoordinates(ev.clientX, ev.clientY),
          ev.target
        );
      } else {
        this.setCurrentMarker();
      }
    }
  }

  private onPointerMove(ev: PointerEvent) {
    if (this.currentMarker !== undefined || this.isDragging) {
      ev.preventDefault();
      this.currentMarker.manipulate(
        this.clientToLocalCoordinates(ev.clientX, ev.clientY)
      );
    }
  }
  private onPointerUp(ev: PointerEvent) {
    if (this.isDragging && this.currentMarker !== undefined) {
      this.currentMarker.pointerUp(
        this.clientToLocalCoordinates(ev.clientX, ev.clientY)
      );
    }
    this.isDragging = false;
  }

  private clientToLocalCoordinates(x: number, y: number): IPoint {
    const clientRect = this.markerImage.getBoundingClientRect();
    return { x: x - clientRect.x, y: y - clientRect.y };
  }

  private onWindowResize() {
    this.positionUI();
  }

  private positionUI() {
    this.setTopLeft();
    switch(this.settings.displayMode) {
      case 'inline': {
        const coverTop =
          this.target.offsetTop > Style.settings.toolbarHeight
            ? this.target.offsetTop - Style.settings.toolbarHeight
            : 0;
        this.coverDiv.style.top = `${coverTop}px`;
        this.coverDiv.style.left = `${this.target.offsetLeft.toString()}px`;
        break;
      }
      case 'popup': {
        this.coverDiv.style.top = '0px';
        this.coverDiv.style.left = '0px';
        this.coverDiv.style.width = '100vw';
        this.coverDiv.style.height = '100vh';
      }
    }
    this.positionMarkerImage();
    this.positionLogo();
  }
}
