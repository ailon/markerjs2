import { SvgHelper } from './core/SvgHelper';
import { Activator } from './core/Activator';
import { Renderer } from './core/Renderer';

import Logo from './assets/markerjs-logo-m.svg';
import { MarkerBase } from './core/MarkerBase';
import { Toolbar, ToolbarButtonType } from './ui/Toolbar';
import { Toolbox } from './ui/Toolbox';
import { FrameMarker } from './markers/frame-marker/FrameMarker';
import { Settings } from './core/Settings';
import { StyleManager, Style } from './core/Style';
import { LineMarker } from './markers/line-marker/LineMarker';
import { TextMarker } from './markers/text-marker/TextMarker';
import { FreehandMarker } from './markers/freehand-marker/FreehandMarker';
import { ArrowMarker } from './markers/arrow-marker/ArrowMarker';
import { HighlightMarker } from './markers/highlight-marker/HighlightMarker';
import { CalloutMarker } from './markers/callout-marker/CalloutMarker';
import { MarkerAreaState } from './MarkerAreaState';
import { EllipseMarker } from './markers/ellipse-marker/EllipseMarker';
import { IStyleSettings } from './core/IStyleSettings';
import { IPoint } from './core/IPoint';
import { EllipseFrameMarker } from './markers/ellipse-frame-marker/EllipseFrameMarker';
import { UndoRedoManager } from './core/UndoRedoManager';
import {
  EventHandler,
  EventListenerRepository,
  IEventListenerRepository,
  MarkerAreaEvent,
  MarkerAreaRenderEvent,
  MarkerEvent
} from './core/Events';

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
 * markerArea.addEventListener('render', event => {
 *   // we are setting the markup result to replace our original image on the page
 *   // but you can set a different image or upload it to your server
 *   document.getElementById('myimg').src = event.dataUrl;
 * });
 *
 * // finally, call the show() method and marker.js UI opens
 * markerArea.show();
 * ```
 */
export class MarkerArea {
  private target: HTMLImageElement | HTMLElement;
  private targetObserver: ResizeObserver;

  private width: number;
  private height: number;
  private imageWidth: number;
  private imageHeight: number;
  private left: number;
  private top: number;
  private windowHeight: number;

  private markerImage: SVGSVGElement;
  private markerImageHolder: HTMLDivElement;
  private defs: SVGDefsElement;

  private coverDiv: HTMLDivElement;
  private uiDiv: HTMLDivElement;
  private contentDiv: HTMLDivElement;
  private editorCanvas: HTMLDivElement;
  private editingTarget: HTMLImageElement | HTMLCanvasElement;
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
  public get ALL_MARKER_TYPES(): (typeof MarkerBase)[] {
    return [
      ArrowMarker,
      FreehandMarker,
      FrameMarker,
      EllipseFrameMarker,
      CalloutMarker
    ];
  }

  /**
   * Returns a list of default set of built-in marker types.
   * Used when {@linkcode availableMarkerTypes} isn't set explicitly.
   *
   * @readonly
   */
  public get DEFAULT_MARKER_TYPES(): (typeof MarkerBase)[] {
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

  /**
   * Returns a short list of essential built-in marker types for use with {@linkcode availableMarkerTypes}
   *
   * @readonly
   */
  public get BASIC_MARKER_TYPES(): (typeof MarkerBase)[] {
    return [
      FrameMarker,
      FreehandMarker,
      ArrowMarker,
      TextMarker,
      HighlightMarker
    ];
  }

  private _availableMarkerTypes: (typeof MarkerBase)[] =
    this.DEFAULT_MARKER_TYPES;

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

  private _currentMarker?: MarkerBase;
  /**
   * Gets currently selected marker
   *
   * @readonly
   * @since 2.27.0
   */
  public get currentMarker(): MarkerBase | undefined {
    return this._currentMarker;
  }
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

  private undoRedoManager: UndoRedoManager<MarkerAreaState> =
    new UndoRedoManager<MarkerAreaState>();

  /**
   * Returns true if undo operation can be performed (undo stack is not empty).
   *
   * @since 2.26.0
   */
  public get isUndoPossible(): boolean {
    return this.undoRedoManager && this.undoRedoManager.isUndoPossible;
  }

  /**
   * Returns true if redo operation can be performed (redo stack is not empty).
   *
   * @since 2.26.0
   */
  public get isRedoPossible(): boolean {
    return this.undoRedoManager && this.undoRedoManager.isRedoPossible;
  }

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
   * If a canvas is specified here, then marker.js will render the output to this canvas
   * in addition to generating an image.
   *
   * @since 2.14.0
   */
  public renderTarget?: HTMLCanvasElement;

  /**
   * Pressing zoom button iterates through values in this array.
   *
   * @since 2.12.0
   */
  public zoomSteps = [1, 1.5, 2, 4];
  private _zoomLevel = 1;
  /**
   * Gets current zoom level.
   *
   * @since 2.12.0
   */
  public get zoomLevel(): number {
    return this._zoomLevel;
  }
  /**
   * Sets current zoom level.
   *
   * @since 2.12.0
   */
  public set zoomLevel(value: number) {
    this._zoomLevel = value;
    if (this.editorCanvas && this.contentDiv) {
      this.editorCanvas.style.transform = `scale(${this._zoomLevel})`;
      this.contentDiv.scrollTo({
        left:
          (this.editorCanvas.clientWidth * this._zoomLevel -
            this.contentDiv.clientWidth) /
          2,
        top:
          (this.editorCanvas.clientHeight * this._zoomLevel -
            this.contentDiv.clientHeight) /
          2
      });
    }
  }

  private static instanceCounter = 0;
  private _instanceNo: number;
  public get instanceNo(): number {
    return this._instanceNo;
  }

  /**
   * Manage style releated settings via the `styles` property.
   */
  public styles: StyleManager;

  /**
   * Creates a new MarkerArea for the specified target image.
   *
   * ```typescript
   * // create an instance of MarkerArea and pass the target image (or other HTML element) reference as a parameter
   * let markerArea = new markerjs2.MarkerArea(document.getElementById('myimg'));
   * ```
   *
   * When `target` is not an image object the output is limited to "markers only" (@linkcode renderMarkersOnly)
   * and "popup" mode won't work properly as the target object stays in it's original position and, unlike images,
   * is not copied.
   *
   * @param target image object to mark up.
   */
  constructor(target: HTMLImageElement | HTMLElement) {
    this._instanceNo = MarkerArea.instanceCounter++;

    this.styles = new StyleManager(this.instanceNo);

    this.uiStyleSettings = this.styles.settings;

    this.target = target;
    this.targetRoot = document.body;

    this.width = target.clientWidth;
    this.height = target.clientHeight;

    this.styles.removeStyleSheet();

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
    this.onPointerOut = this.onPointerOut.bind(this);
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
    this.stepZoom = this.stepZoom.bind(this);
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.markerStateChanged = this.markerStateChanged.bind(this);
    this.switchToSelectMode = this.switchToSelectMode.bind(this);
    this.addDefs = this.addDefs.bind(this);
    this.addDefsToImage = this.addDefsToImage.bind(this);
    this.addMarkerEvents = this.addMarkerEvents.bind(this);
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
    this._isFocused = true;
  }

  /**
   * Initializes the MarkerArea and opens the UI.
   */
  public show(): void {
    // backwards compatibility with deprecated static Style class
    if (
      this.styles.styleSheetRoot === undefined &&
      Style.styleSheetRoot !== undefined
    ) {
      this.styles.styleSheetRoot = Style.styleSheetRoot;
    }

    // reset markers array
    this.markers.splice(0);

    this.setWindowHeight();
    this.showUI();
    this.open();
    this.eventListeners['show'].forEach((listener) =>
      listener(new MarkerAreaEvent(this))
    );
  }

  /**
   * Renders the annotation result.
   *
   * Normally, you should use {@linkcode addEventListener} method to set a listener for the `render` event
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
    await renderer.rasterize(
      this.target instanceof HTMLImageElement ? this.target : null,
      this.markerImage,
      this.renderTarget
    );

    return await renderer.rasterize(
      this.target instanceof HTMLImageElement ? this.target : null,
      this.markerImage,
      this.renderTarget
    );
  }

  /**
   * Closes the MarkerArea UI.
   */
  public close(suppressBeforeClose = false): void {
    if (this.isOpen) {
      let cancel = false;

      if (!suppressBeforeClose) {
        this.eventListeners['beforeclose'].forEach((listener) => {
          const ev = new MarkerAreaEvent(this, true);
          listener(ev);
          if (ev.defaultPrevented) {
            cancel = true;
          }
        });
      }

      if (!cancel) {
        if (this.coverDiv) {
          this.closeUI();
        }
        if (this.targetObserver) {
          this.targetObserver.unobserve(this.target);
          this.targetObserver.unobserve(this.editorCanvas);
        }
        if (this.settings.displayMode === 'popup') {
          window.removeEventListener('resize', this.setWindowHeight);
        }
        //this.closeEventListeners.forEach((listener) => listener());
        this.eventListeners['close'].forEach((listener) =>
          listener(new MarkerAreaEvent(this))
        );
        this.detachEvents();
        this._isOpen = false;
      }
    }
  }

  /**
   * Adds one or more markers to the toolbar.
   *
   * @param markers - one or more marker types to be added.
   */
  public addMarkersToToolbar(...markers: (typeof MarkerBase)[]): void {
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
   * @deprecated use `addEventListener('render', ...)` instead.
   */
  public addRenderEventListener(listener: RenderEventHandler): void {
    //this.renderEventListeners.push(listener);
    this.addEventListener('render', (event: MarkerAreaRenderEvent) => {
      listener(event.dataUrl, event.state);
    });
  }

  /**
   * Remove a `render` event handler.
   *
   * @param listener - previously registered `render` event handler.
   * @deprecated use `removeEventListener('render', ...)` instead.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public removeRenderEventListener(listener: RenderEventHandler): void {
    // if (this.renderEventListeners.indexOf(listener) > -1) {
    //   this.renderEventListeners.splice(
    //     this.renderEventListeners.indexOf(listener),
    //     1
    //   );
    // }
  }

  /**
   * Add a `close` event handler to perform actions in your code after the user
   * clicks on the close button (without saving).
   *
   * @param listener - close event listener
   * @deprecated use `addEventListener('close', ...)` instead.
   */
  public addCloseEventListener(listener: CloseEventHandler): void {
    //this.closeEventListeners.push(listener);
    this.addEventListener('close', () => {
      listener();
    });
  }

  /**
   * Remove a `close` event handler.
   *
   * @param listener - previously registered `close` event handler.
   * @deprecated use `removeEventListener('close', ...)` instead.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public removeCloseEventListener(listener: CloseEventHandler): void {
    // if (this.closeEventListeners.indexOf(listener) > -1) {
    //   this.closeEventListeners.splice(
    //     this.closeEventListeners.indexOf(listener),
    //     1
    //   );
    // }
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

  private _isResizing = false;
  private resize(newWidth: number, newHeight: number) {
    this._isResizing = true;

    const scaleX = newWidth / this.imageWidth;
    const scaleY = newHeight / this.imageHeight;

    this.imageWidth = Math.round(newWidth);
    this.imageHeight = Math.round(newHeight);
    if (
      this.target instanceof HTMLImageElement &&
      this.editingTarget instanceof HTMLImageElement
    ) {
      this.editingTarget.src = this.target.src;
    }
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

    this._isResizing = false;
  }

  private scaleMarkers(scaleX: number, scaleY: number) {
    let preScaleSelectedMarker: MarkerBase;
    if (!(this._currentMarker && this._currentMarker instanceof TextMarker)) {
      // can't unselect text marker as it would hide keyboard on mobile
      preScaleSelectedMarker = this._currentMarker;
      this.setCurrentMarker();
    } else {
      this._currentMarker.scale(scaleX, scaleY);
    }
    this.markers.forEach((marker) => {
      if (marker !== this._currentMarker) {
        marker.scale(scaleX, scaleY);
      }
    });
    if (preScaleSelectedMarker !== undefined) {
      this.setCurrentMarker(preScaleSelectedMarker);
    }
  }

  private setEditingTarget() {
    this.imageWidth = Math.round(this.target.clientWidth);
    this.imageHeight = Math.round(this.target.clientHeight);
    if (
      this.target instanceof HTMLImageElement &&
      this.editingTarget instanceof HTMLImageElement
    ) {
      this.editingTarget.src = this.target.src;
    }
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

    this.markerImageHolder.appendChild(this.markerImage);

    this.editorCanvas.appendChild(this.markerImageHolder);
  }

  /**
   * Adds "defs" element to the marker SVG element.
   * Useful for using custom fonts and potentially other scenarios.
   *
   * @param {(...(string | Node)[])} nodes
   * @see Documentation article on adding custom fonts for an example
   */
  public addDefs(...nodes: (string | Node)[]): void {
    this.defs = SvgHelper.createDefs();
    this.addDefsToImage();

    this.defs.append(...nodes);
  }

  private addDefsToImage() {
    if (this.defs) {
      this.markerImage.insertBefore(this.defs, this.markerImage.firstChild);
    }
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
    this.markerImageHolder.style.top = this.top / this.zoomLevel + 'px';
    this.markerImageHolder.style.left = this.left / this.zoomLevel + 'px';
  }

  private attachEvents() {
    this.markerImage.addEventListener('pointerdown', this.onPointerDown);
    // workaround to prevent a bug with Apple Pencil
    // https://bugs.webkit.org/show_bug.cgi?id=217430
    this.markerImage.addEventListener('touchmove', (ev) => ev.preventDefault());

    this.markerImage.addEventListener('dblclick', this.onDblClick);
    this.attachWindowEvents();
  }

  private attachWindowEvents() {
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerOut);
    window.addEventListener('pointerout', this.onPointerOut);
    window.addEventListener('pointerleave', this.onPointerUp);
    window.addEventListener('resize', this.onWindowResize);
  }

  private detachEvents() {
    this.markerImage.removeEventListener('pointerdown', this.onPointerDown);
    this.markerImage.removeEventListener('dblclick', this.onDblClick);
    this.detachWindowEvents();
  }

  private detachWindowEvents() {
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerOut);
    window.removeEventListener('pointerout', this.onPointerOut);
    window.removeEventListener('pointerleave', this.onPointerUp);
    window.removeEventListener('resize', this.onWindowResize);
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
      if (this.uiStyleSettings.logoPosition !== 'right') {
        this.logoUI.style.left = `${this.markerImageHolder.offsetLeft + 10}px`;
      } else {
        this.logoUI.style.left = `${
          this.markerImageHolder.offsetLeft +
          this.markerImageHolder.offsetWidth -
          this.logoUI.clientWidth -
          10
        }px`;
      }
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
    this.coverDiv = document.createElement('div');
    // prevent UI from blinking when just rendering state
    this.coverDiv.style.visibility = this._silentRenderMode
      ? 'hidden'
      : 'visible';
    this.coverDiv.className = `${this.styles.classNamePrefixBase} ${this.styles.classNamePrefix}`;
    // hardcode font size so nothing inside is affected by higher up settings
    this.coverDiv.style.fontSize = '16px';
    this.coverDiv.style.userSelect = 'none';

    switch (this.settings.displayMode) {
      case 'inline': {
        this.coverDiv.style.position = 'absolute';
        this.coverDiv.style.top = 'auto';
        this.coverDiv.style.left = 'auto';
        this.coverDiv.style.width = `${this.target.offsetWidth.toString()}px`;
        //this.coverDiv.style.height = `${this.target.offsetHeight.toString()}px`;
        this.coverDiv.style.zIndex = '9999999999999999999999999999';
        break;
      }
    }
    this.targetRoot.appendChild(this.coverDiv);

    this.uiDiv = document.createElement('div');
    this.uiDiv.style.display = 'flex';
    this.uiDiv.style.flexDirection = 'column';
    this.uiDiv.style.flexGrow = '2';
    this.uiDiv.style.height = '100%';
    this.uiDiv.style.margin =
      this.settings.displayMode === 'popup'
        ? `${this.settings.popupMargin}px`
        : '0px';
    if (this.settings.displayMode === 'popup') {
      this.uiDiv.style.maxWidth = `calc(100vw - ${
        this.settings.popupMargin * 2
      }px`;
    }
    this.uiDiv.style.border = '0px';
    // this.uiDiv.style.overflow = 'hidden';
    //this.uiDiv.style.backgroundColor = '#ffffff';
    this.coverDiv.appendChild(this.uiDiv);

    this.toolbar = new Toolbar(
      this.uiDiv,
      this.settings.displayMode,
      this._availableMarkerTypes,
      this.uiStyleSettings,
      this.styles
    );
    this.toolbar.addButtonClickListener(this.toolbarButtonClicked);
    this.toolbar.show(
      this._silentRenderMode || this.uiStyleSettings.hideToolbar
        ? 'hidden'
        : 'visible'
    );

    this.contentDiv = document.createElement('div');
    this.contentDiv.style.display = 'flex';
    this.contentDiv.style.flexDirection = 'row';
    this.contentDiv.style.flexGrow = '2';
    this.contentDiv.style.flexShrink = '1';
    if (this.settings.displayMode === 'popup') {
      this.contentDiv.style.backgroundColor =
        this.uiStyleSettings.canvasBackgroundColor;
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
    this.contentDiv.style.overflow = 'auto';
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
    this.editorCanvas.style.transformOrigin = 'left top';
    this.editorCanvas.style.transform = `scale(${this.zoomLevel})`;
    this.contentDiv.appendChild(this.editorCanvas);

    this.editingTarget =
      this.target instanceof HTMLImageElement
        ? document.createElement('img')
        : document.createElement('canvas');
    if (
      this.settings.displayMode === 'inline' &&
      this.settings.uiOffsetTop === undefined &&
      this.target.offsetTop < this.styles.settings.toolbarHeight
    ) {
      this.editingTarget.style.marginTop = '0px';
    }
    this.editorCanvas.appendChild(this.editingTarget);

    this.toolbox = new Toolbox(
      this.uiDiv,
      this.settings.displayMode,
      this.uiStyleSettings,
      this.styles
    );
    this.toolbox.show(
      this._silentRenderMode || this.uiStyleSettings.hideToolbox
        ? 'hidden'
        : 'visible'
    );

    setTimeout(() => {
      this.toolbarButtonClicked('marker', ArrowMarker);
    }, 400);
  }

  private closeUI() {
    if (this.settings.displayMode === 'popup') {
      this.restoreOverflow();
    }
    // @todo better cleanup
    this.targetRoot.removeChild(this.coverDiv);
    this.coverDiv.remove();
    this.coverDiv = null;
  }

  private removeMarker(marker: MarkerBase) {
    this.markerImage.removeChild(marker.container);
    if (this.markers.indexOf(marker) > -1) {
      this.markers.splice(this.markers.indexOf(marker), 1);
    }
    marker.dispose();
  }

  public switchToSelectMode(): void {
    this.mode = 'select';
    this.hideNotesEditor();
    if (this._currentMarker !== undefined) {
      if (this._currentMarker.state !== 'new') {
        this._currentMarker.select();
      } else {
        this.removeMarker(this._currentMarker);
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
          // workaround for text markers in continuos mode
          // otherwise it continues creation until clicked a second time
          this.switchToSelectMode();
          break;
        }
        case 'delete': {
          this.deleteSelectedMarker();
          break;
        }
        case 'clear': {
          this.clear();
          break;
        }
        case 'undo': {
          this.undo();
          break;
        }
        case 'redo': {
          this.redo();
          break;
        }
        case 'zoom': {
          this.stepZoom();
          break;
        }
        case 'zoom-out': {
          this.zoomLevel = 1;
          break;
        }
        case 'notes': {
          if (this.notesArea === undefined) {
            this.switchToSelectMode();
            this.zoomLevel = 1;
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
    if (this._currentMarker !== undefined) {
      let cancel = false;

      this.eventListeners['markerbeforedelete'].forEach((listener) => {
        const ev = new MarkerEvent(this, this._currentMarker, true);
        listener(ev);
        if (ev.defaultPrevented) {
          cancel = true;
        }
      });

      if (!cancel) {
        const marker = this._currentMarker;
        this._currentMarker.dispose();
        this.markerImage.removeChild(this._currentMarker.container);
        this.markers.splice(this.markers.indexOf(this._currentMarker), 1);
        this.setCurrentMarker();
        this.addUndoStep();
        this.eventListeners['markerdelete'].forEach((listener) =>
          listener(new MarkerEvent(this, marker))
        );
      }
    }
  }

  /**
   * Removes all markers.
   *
   * @since 2.15.0
   */
  public clear(): void {
    let cancel = false;
    if (this.markers.length > 0) {
      this.eventListeners['markerbeforedelete'].forEach((listener) => {
        const ev = new MarkerEvent(this, undefined, true);
        listener(ev);
        if (ev.defaultPrevented) {
          cancel = true;
        }
      });
      if (!cancel) {
        this.setCurrentMarker();
        for (let i = this.markers.length - 1; i >= 0; i--) {
          const marker = this.markers[i];
          this.setCurrentMarker(this.markers[i]);
          this._currentMarker.dispose();
          this.markerImage.removeChild(this._currentMarker.container);
          this.markers.splice(this.markers.indexOf(this._currentMarker), 1);
          this.eventListeners['markerdelete'].forEach((listener) =>
            listener(new MarkerEvent(this, marker))
          );
        }
        this.addUndoStep();
      }
    }
  }

  private notesArea?: HTMLTextAreaElement;
  private get isNotesAreaOpen(): boolean {
    return this.notesArea !== undefined;
  }

  private showNotesEditor() {
    if (this._currentMarker !== undefined) {
      this.overlayContainer.innerHTML = '';
      this.notesArea = document.createElement('textarea');
      this.notesArea.className = this.uiStyleSettings.notesAreaStyleClassName;
      this.notesArea.style.pointerEvents = 'auto';
      this.notesArea.style.alignSelf = 'stretch';
      this.notesArea.style.width = '100%';
      this.notesArea.style.margin = `${
        this.uiStyleSettings.toolbarHeight / 4
      }px`;
      this.notesArea.value = this._currentMarker.notes ?? '';
      this.overlayContainer.appendChild(this.notesArea);
    }
  }
  private hideNotesEditor() {
    if (this.isNotesAreaOpen) {
      if (this._currentMarker !== undefined) {
        this._currentMarker.notes =
          this.notesArea.value.trim() !== '' ? this.notesArea.value : undefined;
      }
      this.overlayContainer.removeChild(this.notesArea);
      this.notesArea = undefined;
    }
  }

  private selectLastMarker() {
    if (this.markers.length > 0) {
      this.setCurrentMarker(this.markers[this.markers.length - 1]);
    } else {
      this.setCurrentMarker();
    }
  }

  private addUndoStep() {
    if (
      this._currentMarker === undefined ||
      this._currentMarker.state !== 'edit'
    ) {
      const currentState = this.getState();
      const lastUndoState = this.undoRedoManager.getLastUndoStep();
      if (
        lastUndoState &&
        (lastUndoState.width !== currentState.width ||
          lastUndoState.height !== currentState.height)
      ) {
        // if the size changed just replace the last step with a resized one
        this.undoRedoManager.replaceLastUndoStep(currentState);
        // @todo was sometimes fired on zoom events in popup mode
        // need to find the root cause before restoring statechange event here (if needed?)
        // this.eventListeners['statechange'].forEach((listener) =>
        //   listener(new MarkerAreaEvent(this))
        // );
      } else {
        const beforeSteps = this.undoRedoManager.undoStepCount;
        this.undoRedoManager.addUndoStep(currentState);
        if (beforeSteps < this.undoRedoManager.undoStepCount) {
          this.eventListeners['statechange'].forEach((listener) =>
            listener(new MarkerAreaEvent(this))
          );
        }
      }
    }
  }

  /**
   * Undo last action.
   *
   * @since 2.6.0
   */
  public undo(): void {
    this.switchToSelectMode();
    this.addUndoStep();
    this.undoStep();
  }

  private undoStep(): void {
    const stepData = this.undoRedoManager.undo();
    if (stepData !== undefined) {
      this.restoreState(stepData);
      this.addDefsToImage();
      this.selectLastMarker();
      this.eventListeners['statechange'].forEach((listener) =>
        listener(new MarkerAreaEvent(this))
      );
    }
  }

  /**
   * Redo previously undone action.
   *
   * @since 2.6.0
   */
  public redo(): void {
    this.switchToSelectMode();
    this.redoStep();
  }

  private redoStep(): void {
    const stepData = this.undoRedoManager.redo();
    if (stepData !== undefined) {
      this.restoreState(stepData);
      this.addDefsToImage();
      this.selectLastMarker();
      this.eventListeners['statechange'].forEach((listener) =>
        listener(new MarkerAreaEvent(this))
      );
    }
  }

  /**
   * Iterate zoom steps (@linkcode zoomSteps).
   * Next zoom level is selected or returns to the first zoom level restarting the sequence.
   *
   * @since 2.12.0
   */
  public stepZoom(): void {
    const zoomStepIndex = this.zoomSteps.indexOf(this.zoomLevel);
    this.zoomLevel =
      zoomStepIndex < this.zoomSteps.length - 1
        ? this.zoomSteps[zoomStepIndex + 1]
        : this.zoomSteps[0];
  }

  private prevPanPoint: IPoint = { x: 0, y: 0 };
  private panTo(point: IPoint) {
    this.contentDiv.scrollBy({
      left: this.prevPanPoint.x - point.x,
      top: this.prevPanPoint.y - point.y
    });
    this.prevPanPoint = point;
  }

  /**
   * Initiates markup rendering.
   *
   * Get results by adding a render event listener via {@linkcode addRenderEventListener}.
   */
  public async startRenderAndClose(): Promise<void> {
    const result = await this.render();
    const state = this.getState();
    //this.renderEventListeners.forEach((listener) => listener(result, state));
    this.eventListeners['render'].forEach((listener) =>
      listener(new MarkerAreaRenderEvent(this, result, state))
    );
    this.close(true);
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
      markers: []
    };
    this.markers.forEach((marker) => result.markers.push(marker.getState()));
    return result;
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
        this.addMarkerEvents(marker);
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
    this.eventListeners['restorestate'].forEach((listener) =>
      listener(new MarkerAreaEvent(this))
    );
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
  public createNewMarker(markerType: typeof MarkerBase | string): void {
    let mType: typeof MarkerBase;

    if (typeof markerType === 'string') {
      mType = this._availableMarkerTypes.find(
        (mt) => mt.typeName === markerType
      );
    } else {
      mType = markerType;
    }

    if (mType) {
      this.setCurrentMarker();
      this.addUndoStep();
      this._currentMarker = this.addNewMarker(mType);
      this.addMarkerEvents(this._currentMarker);
      this.markerImage.style.cursor = 'crosshair';
      this.toolbar.setActiveMarkerButton(mType.typeName);
      this.toolbox.setPanelButtons(this._currentMarker.toolboxPanels);
      this.eventListeners['markercreating'].forEach((listener) =>
        listener(new MarkerEvent(this, this._currentMarker))
      );
    }
  }

  private addMarkerEvents(marker: MarkerBase) {
    marker.onMarkerCreated = this.markerCreated;
    marker.onColorChanged = this.colorChanged;
    marker.onFillColorChanged = this.fillColorChanged;
    marker.onStateChanged = this.markerStateChanged;
  }

  private markerCreated(marker: MarkerBase) {
    this.mode = 'select';
    this.markerImage.style.cursor = 'default';
    this.markers.push(marker);
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
    this.eventListeners['markercreate'].forEach((listener) =>
      listener(new MarkerEvent(this, marker))
    );
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

  private markerStateChanged(marker: MarkerBase): void {
    this.eventListeners['markerchange'].forEach((listener) =>
      listener(new MarkerEvent(this, marker))
    );
  }

  /**
   * Sets the currently selected marker or deselects it if no parameter passed.
   *
   * @param marker marker to select. Deselects current marker if undefined.
   */
  public setCurrentMarker(marker?: MarkerBase): void {
    if (this._currentMarker !== marker) {
      // no need to deselect if not changed
      if (this._currentMarker !== undefined) {
        this._currentMarker.deselect();
        this.toolbar.setCurrentMarker();

        if (!this._isResizing) {
          this.eventListeners['markerdeselect'].forEach((listener) =>
            listener(new MarkerEvent(this, this._currentMarker))
          );
        }
      }
    }
    this._currentMarker = marker;
    if (this._currentMarker !== undefined && !this._currentMarker.isSelected) {
      if (this._currentMarker.state !== 'new') {
        this._currentMarker.select();
      }
      this.toolbar.setCurrentMarker(this._currentMarker);
      this.toolbox.setPanelButtons(this._currentMarker.toolboxPanels);

      if (!this._isResizing) {
        this.eventListeners['markerselect'].forEach((listener) =>
          listener(new MarkerEvent(this, this._currentMarker))
        );
      }
    }
  }

  private onPointerDown(ev: PointerEvent) {
    if (!this._isFocused) {
      this.focus();
    }

    this.touchPoints++;
    if (this.touchPoints === 1 || ev.pointerType !== 'touch') {
      if (
        this._currentMarker !== undefined &&
        (this._currentMarker.state === 'new' ||
          this._currentMarker.state === 'creating')
      ) {
        this.isDragging = true;
        this._currentMarker.pointerDown(
          this.clientToLocalCoordinates(ev.clientX, ev.clientY)
        );
      } else if (this.mode === 'select') {
        const hitMarker = this.markers.find((m) => m.ownsTarget(ev.target));
        if (hitMarker !== undefined) {
          this.setCurrentMarker(hitMarker);
          this.isDragging = true;
          this._currentMarker.pointerDown(
            this.clientToLocalCoordinates(ev.clientX, ev.clientY),
            ev.target
          );
        } else {
          this.setCurrentMarker();
          this.isDragging = true;
          this.prevPanPoint = { x: ev.clientX, y: ev.clientY };
        }
      }
    }
  }

  private onDblClick(ev: PointerEvent) {
    if (!this._isFocused) {
      this.focus();
    }

    if (this.mode === 'select') {
      const hitMarker = this.markers.find((m) => m.ownsTarget(ev.target));
      if (hitMarker !== undefined && hitMarker !== this._currentMarker) {
        this.setCurrentMarker(hitMarker);
      }
      if (this._currentMarker !== undefined) {
        this._currentMarker.dblClick(
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
      if (this._currentMarker !== undefined || this.isDragging) {
        // don't swallow the event when editing text markers
        if (
          this._currentMarker === undefined ||
          this._currentMarker.state !== 'edit'
        ) {
          ev.preventDefault();
        }

        if (this._currentMarker !== undefined) {
          this._currentMarker.manipulate(
            this.clientToLocalCoordinates(ev.clientX, ev.clientY)
          );
        } else if (this.zoomLevel > 1) {
          this.panTo({ x: ev.clientX, y: ev.clientY });
        }
      }
    }
  }
  private onPointerUp(ev: PointerEvent) {
    if (this.touchPoints > 0) {
      this.touchPoints--;
    }
    if (this.touchPoints === 0) {
      if (this.isDragging && this._currentMarker !== undefined) {
        this._currentMarker.pointerUp(
          this.clientToLocalCoordinates(ev.clientX, ev.clientY)
        );
      }
    }
    this.isDragging = false;
    this.addUndoStep();
  }

  private onPointerOut(/*ev: PointerEvent*/) {
    if (this.touchPoints > 0) {
      this.touchPoints--;
    }
  }

  private clientToLocalCoordinates(x: number, y: number): IPoint {
    const clientRect = this.markerImage.getBoundingClientRect();
    const scaleX = clientRect.width / this.imageWidth / this.zoomLevel;
    const scaleY = clientRect.height / this.imageHeight / this.zoomLevel;
    return {
      x: (x - clientRect.left) / this.zoomLevel / scaleX,
      y: (y - clientRect.top) / this.zoomLevel / scaleY
    };
  }

  private onWindowResize() {
    this.positionUI();
  }

  private positionUI() {
    this.setTopLeft();
    switch (this.settings.displayMode) {
      case 'inline': {
        this.coverDiv.style.top = 'auto';
        this.coverDiv.style.left = 'auto';
        break;
      }
      case 'popup': {
        this.coverDiv.style.top = 'auto';
        this.coverDiv.style.left = 'auto';
        this.coverDiv.style.width = '100vw';
        this.coverDiv.style.height = `${this.windowHeight}px`;
        this.contentDiv.style.maxHeight = `${
          this.windowHeight -
          this.settings.popupMargin * 2 -
          this.styles.settings.toolbarHeight * 3.5
        }px`;
      }
    }
    this.positionMarkerImage();
    this.positionLogo();
  }

  /**
   * Add license key.
   *
   * This is a proxy method for {@linkcode Activator.addKey()}.
   *
   * @param key - commercial license key.
   */
  public addLicenseKey(key: string): void {
    Activator.addKey(key);
  }

  private eventListeners = new EventListenerRepository();
  /**
   * Adds an event listener for one of the marker.js Live events.
   *
   * @param eventType - type of the event.
   * @param handler - function handling the event.
   *
   * @since 2.16.0
   */
  public addEventListener<T extends keyof IEventListenerRepository>(
    eventType: T,
    handler: EventHandler<T>
  ): void {
    this.eventListeners.addEventListener(eventType, handler);
  }

  /**
   * Removes an event listener for one of the marker.js Live events.
   *
   * @param eventType - type of the event.
   * @param handler - function currently handling the event.
   *
   * @since 2.16.0
   */
  public removeEventListener<T extends keyof IEventListenerRepository>(
    eventType: T,
    handler: EventHandler<T>
  ): void {
    this.eventListeners.removeEventListener(eventType, handler);
  }

  private _silentRenderMode = false;
  /**
   * Renders previously saved state without user intervention.
   *
   * The rendered image is returned to the `render` event handlers (as in the regular interactive process).
   * Rendering options set on `MarkerArea` are respected.
   *
   * @param state state to render
   *
   * @since 2.17.0
   */
  public renderState(state: MarkerAreaState): void {
    this._silentRenderMode = true;
    this.settings.displayMode = 'inline';
    if (!this.isOpen) {
      this.show();
    }
    this.restoreState(state);
    this.startRenderAndClose();
    this._silentRenderMode = false;
  }

  private _isFocused = false;
  /**
   * Returns true when this MarkerArea is focused.
   *
   * @since 2.19.0
   */
  public get isFocused(): boolean {
    return this._isFocused;
  }

  private _previousCurrentMarker?: MarkerBase;

  /**
   * Focuses the MarkerArea to receive all input from the window.
   *
   * Is called automatically when user clicks inside of the marker area. Call manually to set focus explicitly.
   *
   * @since 2.19.0
   */
  public focus(): void {
    if (!this._isFocused) {
      this.attachWindowEvents();
      this._isFocused = true;
      if (this._previousCurrentMarker !== undefined) {
        this.setCurrentMarker(this._previousCurrentMarker);
      }
      this.eventListeners['focus'].forEach((listener) =>
        listener(new MarkerAreaEvent(this))
      );
    }
  }

  /**
   * Tells MarkerArea to stop reacting to input outside of the immediate marker image.
   *
   * Call `focus()` to re-enable.
   *
   * @since 2.19.0
   */
  public blur(): void {
    if (this._isFocused) {
      this.detachWindowEvents();
      this._isFocused = false;
      this._previousCurrentMarker = this._currentMarker;
      this.setCurrentMarker();
      this.eventListeners['blur'].forEach((listener) =>
        listener(new MarkerAreaEvent(this))
      );
    }
  }
}
