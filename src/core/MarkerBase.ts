import { IPoint } from './IPoint';
import { ToolboxPanel } from '../ui/ToolboxPanel';
import { MarkerBaseState, MarkerState } from './MarkerBaseState';
import { Settings } from './Settings';

/**
 * Base class for all available and custom marker types.
 * 
 * All markers used with marker.js 2 should be descendants of this class.
 */
export class MarkerBase {
  /**
   * String type name of the marker type. 
   * 
   * Used when adding {@link MarkerArea.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'MarkerBase';

  protected _container: SVGGElement;
  /**
   * SVG container object holding the marker's visual.
   */
  public get container(): SVGGElement {
    return this._container;
  }
  protected _overlayContainer: HTMLDivElement;
  /**
   * HTML container that can be used to render overlay objects while the marker is active.
   * 
   * For example, this is used for the text editing layer while editing text in the {@see TextMarker}.
   */
  public get overlayContainer(): HTMLDivElement {
    return this._overlayContainer;
  }
  protected _state: MarkerState = 'new';
  /**
   * Current marker state.
   *
   * Both MarkerArea and the marker itself can react differently to different events based on what state the marker is in.
   */
  public get state(): MarkerState {
    return this._state;
  }
  protected globalSettings: Settings;

  /**
   * Returns the list of toolbox panels for this marker type.
   */
  public get toolboxPanels(): ToolboxPanel[] {
    return [];
  }

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title: string;

  /**
   * SVG icon markup displayed on toolbar buttons.
   */
  public static icon: string;

  /**
   * Method called when marker creation is finished.
   */
  public onMarkerCreated: (marker: MarkerBase) => void;

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   * @param overlayContainer - overlay HTML container to hold additional overlay elements while editing.
   * @param settings - settings object containing default markers settings.
   */
  constructor(container: SVGGElement, overlayContainer: HTMLDivElement, settings: Settings) {
    this._container = container;
    this._overlayContainer = overlayContainer;
    this.globalSettings = settings;
  }

  /**
   * Returns true if passed SVG element belongs to the marker. False otherwise.
   * 
   * @param el - target element.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ownsTarget(el: EventTarget): boolean {
    return false;
  }

  /**
   * Selects this marker and displays appropriate selected marker UI.
   */
  public select(): void {
    this.container.style.cursor = 'move';
  }

  /**
   * Deselects this marker and hides selected marker UI.
   */
  public deselect(): void {
    this.container.style.cursor = 'default';
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) down event.
   * 
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public pointerDown(point: IPoint, target?: EventTarget):void {}

  /**
   * Handles pointer (mouse, touch, stylus, etc.) double click event.
   * 
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public dblClick(point: IPoint, target?: EventTarget):void {}

  /**
   * Handles marker manipulation (move, resize, rotate, etc.).
   * 
   * @param point - event coordinates.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public manipulate(point: IPoint):void {}

  /**
   * Handles pointer (mouse, touch, stylus, etc.) up event.
   * 
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public pointerUp(point: IPoint):void {}

  /**
   * Disposes the marker and clean's up.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public dispose(): void {}

  protected addMarkerVisualToContainer(element: SVGElement): void {
    if (this.container.childNodes.length > 0) {
      this.container.insertBefore(element, this.container.childNodes[0]);
    } else {
      this.container.appendChild(element);
    }
  }

  /**
   * Returns current marker state that can be restored in the future.
   */
  public getState(): MarkerBaseState {
    return { 
      typeName: MarkerBase.typeName, 
      state: this.state 
    };
  }

  /**
   * Restores previously saved marker state.
   * 
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    this._state = state.state;
  }
}
