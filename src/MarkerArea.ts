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
import { EllipseFrameMarker } from './markers/ellipse-frame-marker/EllipseFrameMarker';
import { UndoRedoManager } from './core/UndoRedoManager';

/**
 * @ignore
 */
export type MarkerAreaMode = 'select' | 'create' | 'delete';

/**
 * Identifier for marker type when setting {@linkcode availableMarkerTypes}.
 * Marker type can be set as either a string or a marker type reference.
 */
export type MarkerTypeIdentifier = string | typeof MarkerBase;

/**
 * Event handler type for {@linkcode MarkerArea} `render` event.
 */
export type RenderEventHandler = (
  dataURL: string,
  state?: MarkerAreaState
) => void;
/**
 * Event handler type for {@linkcode MarkerArea} `close` event.
 */
export type CloseEventHandler = () => void;

/**
 * MarkerArea is the main class of marker.js 2. It controls the behavior and appearance of the library.
 *
 * The simplest marker.js 2 usage scenario looks something like this:
 *
 * ```typescript
 * import * as markerjs2 from 'markerjs2';
 * // create an instance of MarkerArea and pass the target image reference as a parameter
 * let markerArea = new markerjs2.MarkerArea(document.getElementById('myimg'));
 *
 * // register an event listener for when user clicks OK/save in the marker.js UI
 * markerArea.addRenderEventListener(dataUrl => {
 *   // we are setting the markup result to replace our original image on the page
 *   // but you can set a different image or upload it to your server
 *   document.getElementById('myimg').src = dataUrl;
 * });
 *
 * // finally, call the show() method and marker.js UI opens
 * markerArea.show();
 * ```
 */
export class MarkerArea {
  private target: HTMLImageElement;
  private targetObserver: ResizeObserver;

  private width: number;
  private height: number;
  private imageWidth: number;
  private imageHeight: number;
  private left: number;
  private top: number;
  private windowHeight: number;
  private createMarkerCallbacks = [];

  private markerImage: SVGSVGElement;
  private markerImageHolder: HTMLDivElement;
  private defs: SVGDefsElement;

  private coverDiv: HTMLDivElement;
  private uiDiv: HTMLDivElement;
  private contentDiv: HTMLDivElement;
  private editorCanvas: HTMLDivElement;
  private editingTarget: HTMLImageElement;
  private overlayContainer: HTMLDivElement;

  private touchPoints = 0;

  private logoUI: HTMLElement;

  /**
   * `targetRoot` is used to set an alternative positioning root for the marker.js UI.
   *
   * This is useful in cases when your target image is positioned, say, inside a div with `position: relative;`
   *
   * ```typescript
   * // set targetRoot to a specific div instead of document.body
   * markerArea.targetRoot = document.getElementById('myRootElement');
   * ```
   *
   * @default document.body
   */
  public targetRoot: HTMLElement;

  /**
   * Returns a list of all built-in marker types for use with {@linkcode availableMarkerTypes}
   *
   * @readonly
   */
  public get ALL_MARKER_TYPES(): typeof MarkerBase[] {
    return [
      FrameMarker,
      FreehandMarker,
      ArrowMarker,
      TextMarker,
      EllipseFrameMarker,
      EllipseMarker,
      HighlightMarker,
      CalloutMarker,
      MeasurementMarker,
      CoverMarker,
      LineMarker,
    ];
  }

  /**
   * Returns a list of default set of built-in marker types.
   * Used when {@linkcode availableMarkerTypes} isn't set explicitly.
   *
   * @readonly
   */
  public get DEFAULT_MARKER_TYPES(): typeof MarkerBase[] {
    return [
      FrameMarker,
      FreehandMarker,
      ArrowMarker,
      TextMarker,
      EllipseMarker,
      HighlightMarker,
      CalloutMarker,
    ];
  }

  /**
   * Returns a short list of essential built-in marker types for use with {@linkcode availableMarkerTypes}
   *
   * @readonly
   */
  public get BASIC_MARKER_TYPES(): typeof MarkerBase[] {
    return [
      FrameMarker,
      FreehandMarker,
      ArrowMarker,
      TextMarker,
      HighlightMarker,
    ];
  }

  private _availableMarkerTypes: typeof MarkerBase[] = this
    .DEFAULT_MARKER_TYPES;

  /**
   * Gets or sets a list of marker types avaiable to the user in the toolbar.
   * The types can be passed as either type reference or a string type name.
   *
   * ```typescript
   * this.markerArea1.availableMarkerTypes = ['CalloutMarker', ...this.markerArea1.BASIC_MARKER_TYPES];
   * ```
   *
   * @default {@linkcode DEFAULT_MARKER_TYPES}
   */
  public get availableMarkerTypes(): MarkerTypeIdentifier[] {
    return this._availableMarkerTypes;
  }

  public set availableMarkerTypes(value: MarkerTypeIdentifier[]) {
    this._availableMarkerTypes.splice(0);
    value.forEach((mt) => {
      if (typeof mt === 'string') {
        const typeType = this.ALL_MARKER_TYPES.find(
          (allT) => allT.typeName === mt
        );
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
  public uiStyleSettings: IStyleSettings;

  private _isOpen = false;
  /**
   * Returns `true` when MarkerArea is open and `false` otherwise.
   *
   * @readonly
   */
  public get isOpen(): boolean {
    return this._isOpen;
  }

  private undoRedoManager: UndoRedoManager<
    MarkerAreaState
  > = new UndoRedoManager<MarkerAreaState>();

  /**
   * When set to true resulting image will be rendered at the natural (original) resolution
   * of the target image. Otherwise (default), screen dimensions of the image are used.
   *
   * @default false (use screen dimensions)
   */
  public renderAtNaturalSize = false;
  /**
   * Type of image for the rendering result. Eg. `image/png` (default) or `image/jpeg`.
   *
   * @default `image/png`
   */
  public renderImageType = 'image/png';
  /**
   * When rendering engine/format supports it (jpeg, for exmample),
   * sets the rendering quality for the resulting image.
   *
   * In case of `image/jpeg` the value should be between 0 (worst quality) and 1 (best quality).
   */
  public renderImageQuality?: number;
  /**
   * When set to `true`, will render only the marker layer without the original image.
   * This could be useful when you want to non-destructively overlay markers on top of the original image.
   *
   * Note that in order for the markers layer to have a transparent background {@linkcode renderImageType}
   * should be set to a format supporting transparency, such as `image/png`.
   *
   * @default false
   */
  public renderMarkersOnly = false;

  /**
   * When set and {@linkcode renderAtNaturalSize} is `false` sets the width of the rendered image.
   *
   * Both `renderWidth` and `renderHeight` have to be set for this to take effect.
   */
  public renderWidth?: number;
  /**
   * When set and {@linkcode renderAtNaturalSize} is `false` sets the height of the rendered image.
   *
   * Both `renderWidth` and `renderHeight` have to be set for this to take effect.
   */
  public renderHeight?: number;

  /**
   * Creates a new MarkerArea for the specified target image.
   *
   * ```typescript
   * // create an instance of MarkerArea and pass the target image reference as a parameter
   * let markerArea = new markerjs2.MarkerArea(document.getElementById('myimg'));
   * ```
   *
   * @param target image object to mark up.
   */
  constructor(target: HTMLImageElement) {
    Style.settings = Style.defaultSettings;
    this.uiStyleSettings = Style.settings;

    this.target = target;
    this.targetRoot = document.body;

    this.width = target.clientWidth;
    this.height = target.clientHeight;

    Style.removeStyleSheet();

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
    this.onKeyUp = this.onKeyUp.bind(this);
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
    this.deleteSelectedMarker = this.deleteSelectedMarker.bind(this);
    this.setWindowHeight = this.setWindowHeight.bind(this);
    this.removeMarker = this.removeMarker.bind(this);
    this.colorChanged = this.colorChanged.bind(this);
    this.fillColorChanged = this.fillColorChanged.bind(this);
    this.onPopupTargetResize = this.onPopupTargetResize.bind(this);
    this.showNotesEditor = this.showNotesEditor.bind(this);
    this.hideNotesEditor = this.hideNotesEditor.bind(this);
  }

  private open(): void {
    this.setupResizeObserver();
    this.setEditingTarget();
    this.setTopLeft();
    this.initMarkerCanvas();
    this.initOverlay();
    this.attachEvents();
    if (this.settings.displayMode === 'popup') {
      this.onPopupTargetResize();
    }

    if (!Activator.isLicensed) {
      // NOTE:
      // before removing this call please consider supporting marker.js
      // by visiting https://markerjs.com/ for details
      // thank you!
      this.addLogo();
    }

    this._isOpen = true;
  }

  /**
   * Initializes the MarkerArea and opens the UI.
   */
  public show(): void {
    this.setWindowHeight();
    this.showUI();
    this.open();
  }

  /**
   * Renders the annotation result.
   *
   * Normally, you should use {@linkcode addRenderEventListener} method to set a listener for the `render` event
   * rather than calling this method directly.
   */
  public async render(): Promise<string> {
    this.setCurrentMarker();

    const renderer = new Renderer();
    renderer.naturalSize = this.renderAtNaturalSize;
    renderer.imageType = this.renderImageType;
    renderer.imageQuality = this.renderImageQuality;
    renderer.markersOnly = this.renderMarkersOnly;
    renderer.width = this.renderWidth;
    renderer.height = this.renderHeight;

    // workaround for an issue in Safari where FreeHand marker
    // is not rendered on the first try for some reason
    await renderer.rasterize(this.target, this.markerImage);

    return await renderer.rasterize(this.target, this.markerImage);
  }

  /**
   * Closes the MarkerArea UI.
   */
  public close(): void {
    if (this.isOpen) {
      if (this.coverDiv) {
        this.closeUI();
      }
      if (this.targetObserver) {
        this.targetObserver.unobserve(this.target);
      }
      if (this.settings.displayMode === 'popup') {
        window.removeEventListener('resize', this.setWindowHeight);
      }
      this.closeEventListeners.forEach((listener) => listener());
      this._isOpen = false;
    }
  }

  /**
   * Adds one or more markers to the toolbar.
   *
   * @param markers - one or more marker types to be added.
   */
  public addMarkersToToolbar(...markers: typeof MarkerBase[]): void {
    this._availableMarkerTypes.push(...markers);
  }

  /**
   * Add a `render` event listener which is called when user clicks on the OK/save button
   * in the toolbar.
   *
   * ```typescript
   * // register an event listener for when user clicks OK/save in the marker.js UI
   * markerArea.addRenderEventListener(dataUrl => {
   *   // we are setting the markup result to replace our original image on the page
   *   // but you can set a different image or upload it to your server
   *   document.getElementById('myimg').src = dataUrl;
   * });
   * ```
   *
   * This is where you place your code to save a resulting image and/or MarkerAreaState.
   *
   * @param listener - a method handling rendering results
   *
   * @see {@link MarkerAreaState}
   */
  public addRenderEventListener(listener: RenderEventHandler): void {
    this.renderEventListeners.push(listener);
  }

  /**
   * Remove a `render` event handler.
   *
   * @param listener - previously registered `render` event handler.
   */
  public removeRenderEventListener(listener: RenderEventHandler): void {
    if (this.renderEventListeners.indexOf(listener) > -1) {
      this.renderEventListeners.splice(
        this.renderEventListeners.indexOf(listener),
        1
      );
    }
  }

  /**
   * Add a `close` event handler to perform actions in your code after the user
   * clicks on the close button (without saving).
   *
   * @param listener - close event listener
   */
  public addCloseEventListener(listener: CloseEventHandler): void {
    this.closeEventListeners.push(listener);
  }

  /**
   * Remove a `close` event handler.
   *
   * @param listener - previously registered `close` event handler.
   */
  public removeCloseEventListener(listener: CloseEventHandler): void {
    if (this.closeEventListeners.indexOf(listener) > -1) {
      this.closeEventListeners.splice(
        this.closeEventListeners.indexOf(listener),
        1
      );
    }
  }

  private setupResizeObserver() {
    if (this.settings.displayMode === 'inline') {
      if (window.ResizeObserver) {
        this.targetObserver = new ResizeObserver(() => {
          this.resize(this.target.clientWidth, this.target.clientHeight);
        });
        this.targetObserver.observe(this.target);
      }
    } else if (this.settings.displayMode === 'popup') {
      if (window.ResizeObserver) {
        this.targetObserver = new ResizeObserver(() =>
          this.onPopupTargetResize()
        );
        this.targetObserver.observe(this.editorCanvas);
      }
      window.addEventListener('resize', this.setWindowHeight);
    }
  }

  private onPopupTargetResize() {
    const ratio = (1.0 * this.target.clientWidth) / this.target.clientHeight;
    const newWidth =
      this.editorCanvas.clientWidth / ratio > this.editorCanvas.clientHeight
        ? this.editorCanvas.clientHeight * ratio
        : this.editorCanvas.clientWidth;
    const newHeight =
      newWidth < this.editorCanvas.clientWidth
        ? this.editorCanvas.clientHeight
        : this.editorCanvas.clientWidth / ratio;
    this.resize(newWidth, newHeight);
  }

  private setWindowHeight() {
    this.windowHeight = window.innerHeight;
  }

  private resize(newWidth: number, newHeight: number) {
    const scaleX = newWidth / this.imageWidth;
    const scaleY = newHeight / this.imageHeight;

    this.imageWidth = Math.round(newWidth);
    this.imageHeight = Math.round(newHeight);
    this.editingTarget.src = this.target.src;
    this.editingTarget.width = this.imageWidth;
    this.editingTarget.height = this.imageHeight;
    this.editingTarget.style.width = `${this.imageWidth}px`;
    this.editingTarget.style.height = `${this.imageHeight}px`;

    this.markerImage.setAttribute('width', this.imageWidth.toString());
    this.markerImage.setAttribute('height', this.imageHeight.toString());
    this.markerImage.setAttribute(
      'viewBox',
      '0 0 ' + this.imageWidth.toString() + ' ' + this.imageHeight.toString()
    );

    this.markerImageHolder.style.width = `${this.imageWidth}px`;
    this.markerImageHolder.style.height = `${this.imageHeight}px`;

    this.overlayContainer.style.width = `${this.imageWidth}px`;
    this.overlayContainer.style.height = `${this.imageHeight}px`;

    if (this.settings.displayMode !== 'popup') {
      this.coverDiv.style.width = `${this.imageWidth.toString()}px`;
    } else {
      this.setTopLeft();
      this.positionMarkerImage();
    }

    if (this.toolbar !== undefined) {
      this.toolbar.adjustLayout();
    }

    this.positionLogo();

    this.scaleMarkers(scaleX, scaleY);
  }

  private scaleMarkers(scaleX: number, scaleY: number) {
    let preScaleSelectedMarker: MarkerBase;
    if (!(this.currentMarker && this.currentMarker instanceof TextMarker)) {
      preScaleSelectedMarker = this.currentMarker;
      this.setCurrentMarker();
      this.toolbar.setSelectMode();
    }
    this.markers.forEach((marker) => marker.scale(scaleX, scaleY));
    if (preScaleSelectedMarker !== undefined) {
      this.setCurrentMarker(preScaleSelectedMarker);
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
    this.markerImageHolder.style.setProperty('touch-action', 'pinch-zoom');

    this.markerImage = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    this.markerImage.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.markerImage.setAttribute('width', this.imageWidth.toString());
    this.markerImage.setAttribute('height', this.imageHeight.toString());
    this.markerImage.setAttribute(
      'viewBox',
      '0 0 ' + this.imageWidth.toString() + ' ' + this.imageHeight.toString()
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
    window.addEventListener('pointercancel', () => {
      if (this.touchPoints > 0) {
        this.touchPoints--;
      }
    });
    window.addEventListener('pointerout', () => {
      if (this.touchPoints > 0) {
        this.touchPoints--;
      }
    });
    window.addEventListener('pointerleave', this.onPointerUp);
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('keyup', this.onKeyUp);
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
    // hardcode font size so nothing inside is affected by higher up settings
    this.coverDiv.style.fontSize = '16px';
    this.coverDiv.style.userSelect = 'none';
    switch (this.settings.displayMode) {
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
        this.coverDiv.style.zIndex = '5';
        // flex causes the ui to stretch when toolbox has wider nowrap panels
        //this.coverDiv.style.display = 'flex';
        break;
      }
      case 'popup': {
        this.coverDiv.style.position = 'absolute';
        this.coverDiv.style.top = '0px';
        this.coverDiv.style.left = '0px';
        this.coverDiv.style.width = '100vw';
        this.coverDiv.style.height = `${window.innerHeight}px`;
        this.coverDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        this.coverDiv.style.zIndex = '1000';
        this.coverDiv.style.display = 'flex';
        // this.coverDiv.style.overflow = 'auto';
      }
    }
    this.targetRoot.appendChild(this.coverDiv);

    this.uiDiv = document.createElement('div');
    this.uiDiv.style.display = 'flex';
    this.uiDiv.style.flexDirection = 'column';
    this.uiDiv.style.flexGrow = '2';
    this.uiDiv.style.margin =
      this.settings.displayMode === 'popup'
        ? `${this.settings.popupMargin}px`
        : '0px';
    this.uiDiv.style.border = '0px';
    // this.uiDiv.style.overflow = 'hidden';
    //this.uiDiv.style.backgroundColor = '#ffffff';
    this.coverDiv.appendChild(this.uiDiv);

    this.toolbar = new Toolbar(
      this.uiDiv,
      this.settings.displayMode,
      this._availableMarkerTypes,
      this.uiStyleSettings
    );
    this.toolbar.addButtonClickListener(this.toolbarButtonClicked);
    this.toolbar.show(this.uiStyleSettings.hideToolbar ? 'hidden' : 'visible');

    this.contentDiv = document.createElement('div');
    this.contentDiv.style.display = 'flex';
    this.contentDiv.style.flexDirection = 'row';
    this.contentDiv.style.flexGrow = '2';
    this.contentDiv.style.flexShrink = '1';
    this.contentDiv.style.backgroundColor = this.uiStyleSettings.canvasBackgroundColor;
    if (this.settings.displayMode === 'popup') {
      this.contentDiv.style.maxHeight = `${
        this.windowHeight -
        this.settings.popupMargin * 2 -
        this.uiStyleSettings.toolbarHeight * 3.5
      }px`;
      // this.contentDiv.style.maxHeight = `calc(100vh - ${
      //   this.settings.popupMargin * 2 + this.uiStyleSettings.toolbarHeight * 3.5}px)`;
      this.contentDiv.style.maxWidth = `calc(100vw - ${
        this.settings.popupMargin * 2
      }px)`;
    }
    this.uiDiv.appendChild(this.contentDiv);

    this.editorCanvas = document.createElement('div');
    this.editorCanvas.style.flexGrow = '2';
    this.editorCanvas.style.flexShrink = '1';
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

    this.toolbox = new Toolbox(
      this.uiDiv,
      this.settings.displayMode,
      this.uiStyleSettings
    );
    this.toolbox.show(this.uiStyleSettings.hideToolbox ? 'hidden' : 'visible');
  }

  private closeUI() {
    if (this.settings.displayMode === 'popup') {
      this.restoreOverflow();
    }
    // @todo better cleanup
    this.targetRoot.removeChild(this.coverDiv);
  }

  private removeMarker(marker: MarkerBase) {
    this.markerImage.removeChild(marker.container);
    if (this.markers.indexOf(marker) > -1) {
      this.markers.splice(this.markers.indexOf(marker), 1);
    }
    marker.dispose();
  }

  private switchToSelectMode() {
    this.mode = 'select';
    this.hideNotesEditor();
    if (this.currentMarker !== undefined) {
      if (this.currentMarker.state !== 'new') {
        this.currentMarker.select();
      } else {
        this.removeMarker(this.currentMarker);
        this.setCurrentMarker();
        this.markerImage.style.cursor = 'default';
      }
      this.addUndoStep();
    }
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
          this.switchToSelectMode();
          break;
        }
        case 'delete': {
          this.deleteSelectedMarker();
          break;
        }
        case 'undo': {
          this.switchToSelectMode();
          this.addUndoStep();
          this.undo();
          break;
        }
        case 'redo': {
          this.switchToSelectMode();
          this.redo();
          break;
        }
        case 'notes': {
          if (this.notesArea === undefined) {
            this.switchToSelectMode();
            this.showNotesEditor();
          } else {
            this.switchToSelectMode();
          }
          break;
        }
        case 'close': {
          this.close();
          break;
        }
        case 'render': {
          this.switchToSelectMode();
          this.startRenderAndClose();
          break;
        }
      }
    }
  }

  /**
   * Removes currently selected marker.
   */
  public deleteSelectedMarker(): void {
    if (this.currentMarker !== undefined) {
      this.currentMarker.dispose();
      this.markerImage.removeChild(this.currentMarker.container);
      this.markers.splice(this.markers.indexOf(this.currentMarker), 1);
      this.addUndoStep();
    }
  }

  private notesArea?: HTMLTextAreaElement;
  private get isNotesAreaOpen(): boolean {
    return this.notesArea !== undefined;
  }

  private showNotesEditor() {
    if (this.currentMarker !== undefined) {
      this.overlayContainer.innerHTML = '';
      this.notesArea = document.createElement('textarea');
      this.notesArea.className = this.uiStyleSettings.notesAreaStyleClassName;
      this.notesArea.style.pointerEvents = 'auto';
      this.notesArea.style.alignSelf = 'stretch';
      this.notesArea.style.width = '100%';
      this.notesArea.style.margin = `${
        this.uiStyleSettings.toolbarHeight / 4
      }px`;
      this.notesArea.value = this.currentMarker.notes ?? '';
      this.overlayContainer.appendChild(this.notesArea);
    }
  }
  private hideNotesEditor() {
    if (this.isNotesAreaOpen) {
      if (this.currentMarker !== undefined) {
        this.currentMarker.notes =
          this.notesArea.value.trim() !== '' ? this.notesArea.value : undefined;
      }
      this.overlayContainer.removeChild(this.notesArea);
      this.notesArea = undefined;
    }
  }

  private selectLastMarker() {
    if (this.markers.length > 0) {
      this.setCurrentMarker(this.markers[this.markers.length - 1]);
    }
  }

  private addUndoStep() {
    if (
      this.currentMarker === undefined ||
      this.currentMarker.state !== 'edit'
    ) {
      this.undoRedoManager.addUndoStep(this.getState());
    }
  }

  /**
   * Undo last action.
   *
   * @since 2.6.0
   */
  public undo(): void {
    const stepData = this.undoRedoManager.undo();
    if (stepData !== undefined) {
      this.restoreState(stepData);
      this.selectLastMarker();
    }
  }

  /**
   * Redo previously undone action.
   *
   * @since 2.6.0
   */
  public redo(): void {
    const stepData = this.undoRedoManager.redo();
    if (stepData !== undefined) {
      this.restoreState(stepData);
      this.selectLastMarker();
    }
  }

  /**
   * Initiates markup rendering.
   *
   * Get results by adding a render event listener via {@linkcode addRenderEventListener}.
   */
  public async startRenderAndClose(): Promise<void> {
    const result = await this.render();
    const state = this.getState();
    this.renderEventListeners.forEach((listener) => listener(result, state));
    this.close();
  }

  /**
   * Returns the complete state for the MarkerArea that can be preserved and used
   * to continue annotation next time.
   *
   * @param deselectCurrentMarker - when `true` is passed, currently selected marker will be deselected before getting the state.
   */
  public getState(deselectCurrentMarker?: boolean): MarkerAreaState {
    if (deselectCurrentMarker === true) {
      this.setCurrentMarker();
    }
    const result: MarkerAreaState = {
      width: this.imageWidth,
      height: this.imageHeight,
      markers: [],
    };
    this.markers.forEach((marker) => result.markers.push(marker.getState()));
    return result;
  }

  public addBoxCreateCallback(boxCreateCallback){
    this.createMarkerCallbacks.push(boxCreateCallback)
  }

  public resetBoxCallbacks(){
    this.createMarkerCallbacks = []
  }

  /**
   * Restores MarkerArea state to continue previous annotation session.
   *
   * **IMPORTANT**: call `restoreState()` __after__ you've opened the MarkerArea with {@linkcode show}.
   *
   * ```typescript
   * this.markerArea1.show();
   * if (this.currentState) {
   *   this.markerArea1.restoreState(this.currentState);
   * }
   * ```
   *
   * @param state - previously saved state object.
   */
  public restoreState(state: MarkerAreaState): void {
    this.markers.splice(0);
    while (this.markerImage.lastChild) {
      this.markerImage.removeChild(this.markerImage.lastChild);
    }
    state.markers.forEach((markerState) => {
      const markerType = this._availableMarkerTypes.find(
        (mType) => mType.typeName === markerState.typeName
      );
      if (markerType !== undefined) {
        const marker = this.addNewMarker(markerType);
        marker.restoreState(markerState);
        this.markers.push(marker);
      }
    });
    if (
      state.width &&
      state.height &&
      (state.width !== this.imageWidth || state.height !== this.imageHeight)
    ) {
      this.scaleMarkers(
        this.imageWidth / state.width,
        this.imageHeight / state.height
      );
    }
  }

  private addNewMarker(markerType: typeof MarkerBase): MarkerBase {
    const g = SvgHelper.createGroup();
    this.markerImage.appendChild(g);

    return new markerType(g, this.overlayContainer, this.settings);
  }

  /**
   * Initiate new marker creation.
   *
   * marker.js switches to marker creation mode for the marker type specified
   * and users can draw a new marker like they would by pressing a corresponding
   * toolbar button.
   *
   * This example initiates creation of a `FrameMarker`:
   * ```typescript
   * this.markerArea1.createNewMarker(FrameMarker);
   * ```
   *
   * @param markerType
   */
  public createNewMarker(markerType: typeof MarkerBase): void {
    this.setCurrentMarker();
    this.currentMarker = this.addNewMarker(markerType);
    this.currentMarker.onMarkerCreated = this.markerCreated;
    this.currentMarker.onColorChanged = this.colorChanged;
    this.currentMarker.onFillColorChanged = this.fillColorChanged;
    this.markerImage.style.cursor = 'crosshair';
    this.toolbox.setPanelButtons(this.currentMarker.toolboxPanels);
  }

  private markerCreated(marker: MarkerBase) {
    this.mode = 'select';
    this.markerImage.style.cursor = 'default';
    this.markers.push(marker);

    this.createMarkerCallbacks.forEach((callback)=>{
      callback()
    })

    this.setCurrentMarker(marker);
    if (
      marker instanceof FreehandMarker &&
      this.settings.newFreehandMarkerOnPointerUp
    ) {
      this.createNewMarker(FreehandMarker);
    } else {
      this.toolbar.setSelectMode();
    }
    this.addUndoStep();
  }

  private colorChanged(color: string): void {
    if (this.settings.defaultColorsFollowCurrentColors) {
      this.settings.defaultColor = color;
      this.settings.defaultStrokeColor = color;
    }
  }
  private fillColorChanged(color: string): void {
    if (this.settings.defaultColorsFollowCurrentColors) {
      this.settings.defaultFillColor = color;
    }
  }

  /**
   * Sets the currently selected marker or deselects it if no parameter passed.
   *
   * @param marker marker to select. Deselects current marker if undefined.
   */
  public setCurrentMarker(marker?: MarkerBase): void {
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
    this.touchPoints++;
    if (this.touchPoints === 1 || ev.pointerType !== 'touch') {
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
    if (this.touchPoints === 1 || ev.pointerType !== 'touch') {
      if (this.currentMarker !== undefined || this.isDragging) {
        // don't swallow the event when editing text markers
        if (
          this.currentMarker === undefined ||
          this.currentMarker.state !== 'edit'
        ) {
          ev.preventDefault();
        }
        this.currentMarker.manipulate(
          this.clientToLocalCoordinates(ev.clientX, ev.clientY)
        );
      }
    }
  }
  private onPointerUp(ev: PointerEvent) {
    if (this.touchPoints > 0) {
      this.touchPoints--;
    }
    if (this.touchPoints === 0) {
      if (this.isDragging && this.currentMarker !== undefined) {
        this.currentMarker.pointerUp(
          this.clientToLocalCoordinates(ev.clientX, ev.clientY)
        );
      }
    }
    this.isDragging = false;
    this.addUndoStep();
  }

  private onKeyUp(ev: KeyboardEvent) {
    if (
      this.currentMarker !== undefined &&
      this.notesArea === undefined &&
      (ev.key === 'Delete' || ev.key === 'Backspace')
    ) {
      this.removeMarker(this.currentMarker);
      this.setCurrentMarker();
      this.markerImage.style.cursor = 'default';
      this.addUndoStep();
    }
  }

  private clientToLocalCoordinates(x: number, y: number): IPoint {
    const clientRect = this.markerImage.getBoundingClientRect();
    return { x: x - clientRect.left, y: y - clientRect.top };
  }

  private onWindowResize() {
    this.positionUI();
  }

  private positionUI() {
    this.setTopLeft();
    switch (this.settings.displayMode) {
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
        this.coverDiv.style.height = `${this.windowHeight}px`;
        this.contentDiv.style.maxHeight = `${
          this.windowHeight -
          this.settings.popupMargin * 2 -
          this.uiStyleSettings.toolbarHeight * 3.5
        }px`;
      }
    }
    this.positionMarkerImage();
    this.positionLogo();
  }
}
