import { IPoint } from '../core/IPoint';
import { SvgHelper } from '../core/SvgHelper';
import { RectangularBoxMarkerBase } from './RectangularBoxMarkerBase';
import { Settings } from '../core/Settings';
import { RectangleMarkerState } from './RectangleMarkerState';
import { MarkerBaseState } from '../core/MarkerBaseState';

/**
 * RecatngleMarker is a base class for all rectangular markers (Frame, Cover, Highlight, etc.)
 */
export abstract class RectangleMarker extends RectangularBoxMarkerBase {
  /**
   * String type name of the marker type. 
   * 
   * Used when adding {@link MarkerArea.availableMarkerTypes} via a string and to save and restore state.
   */
  public static title = 'Rectangle marker';

  /**
   * Recangle fill color.
   */
  protected fillColor = 'transparent';
  /**
   * Rectangle stroke color.
   */
  protected strokeColor = 'transparent';
  /**
   * Rectangle border stroke width.
   */
  protected strokeWidth = 0;
  /**
   * Rectangle border stroke dash array.
   */
  protected strokeDasharray = '';
  /**
   * Rectangle opacity (alpha). 0 to 1.
   */
  protected opacity = 1;

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   * @param overlayContainer - overlay HTML container to hold additional overlay elements while editing.
   * @param settings - settings object containing default markers settings.
   */
  constructor(container: SVGGElement, overlayContainer: HTMLDivElement, settings: Settings) {
    super(container, overlayContainer, settings);

    this.setStrokeColor = this.setStrokeColor.bind(this);
    this.setFillColor = this.setFillColor.bind(this);
    this.setStrokeWidth = this.setStrokeWidth.bind(this);
    this.setStrokeDasharray = this.setStrokeDasharray.bind(this);
    this.createVisual = this.createVisual.bind(this);
  }

  /**
   * Returns true if passed SVG element belongs to the marker. False otherwise.
   * 
   * @param el - target element.
   */
  public ownsTarget(el: EventTarget): boolean {
    if (super.ownsTarget(el) || el === this.visual) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Creates the marker's rectangle visual.
   */
  protected createVisual(): void {
    this.visual = SvgHelper.createRect(1, 1, [
      ['fill', this.fillColor],
      ['stroke', this.strokeColor],
      ['stroke-width', this.strokeWidth.toString()],
      ['stroke-dasharray', this.strokeDasharray],
      ['opacity', this.opacity.toString()]
    ]);
    const translate = SvgHelper.createTransform();
    this.visual.transform.baseVal.appendItem(translate);
    this.addMarkerVisualToContainer(this.visual);
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) down event.
   * 
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  public pointerDown(point: IPoint, target?: EventTarget): void {
    super.pointerDown(point, target);
    if (this.state === 'new') {
      this.createVisual();

      this.moveVisual(point);

      this._state = 'creating';
    }
  }

  /**
   * Handles marker manipulation (move, resize, rotate, etc.).
   * 
   * @param point - event coordinates.
   */
  public manipulate(point: IPoint): void {
    super.manipulate(point);
  }

  /**
   * Resizes the marker based on the pointer coordinates.
   * @param point - current pointer coordinates.
   */
  protected resize(point: IPoint): void {
    super.resize(point);
    this.setSize();
  }

  /**
   * Sets visual's width and height attributes based on marker's width and height.
   */
  protected setSize(): void {
    super.setSize();
    SvgHelper.setAttributes(this.visual, [
      ['width', this.width.toString()],
      ['height', this.height.toString()],
    ]);
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) up event.
   * 
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  public pointerUp(point: IPoint): void {
    super.pointerUp(point);
    this.setSize();
  }

  /**
   * Sets rectangle's border stroke color.
   * @param color - color as string
   */
  protected setStrokeColor(color: string): void {
    this.strokeColor = color;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke', this.strokeColor]]);
    }
  }
  /**
   * Sets rectangle's fill color.
   * @param color - color as string
   */
  protected setFillColor(color: string): void {
    this.fillColor = color;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['fill', this.fillColor]]);
    }
  }
  /**
   * Sets rectangle's border stroke (line) width.
   * @param color - color as string
   */
  protected setStrokeWidth(width: number): void {
    this.strokeWidth = width;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke-width', this.strokeWidth.toString()]]);
    }
  }
  /**
   * Sets rectangle's border stroke dash array.
   * @param color - color as string
   */
  protected setStrokeDasharray(dashes: string): void {
    this.strokeDasharray = dashes;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke-dasharray', this.strokeDasharray]]);
    }
  }

  /**
   * Returns current marker state that can be restored in the future.
   */
  public getState(): RectangleMarkerState {
    const result: RectangleMarkerState = Object.assign({
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      strokeDasharray: this.strokeDasharray,
      opacity: this.opacity
    }, super.getState());

    return result;
  }

  /**
   * Restores previously saved marker state.
   * 
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    const rectState = state as RectangleMarkerState;
    this.fillColor = rectState.fillColor;
    this.strokeColor = rectState.strokeColor;
    this.strokeWidth = rectState.strokeWidth;
    this.strokeDasharray = rectState.strokeDasharray;
    this.opacity = rectState.opacity;

    this.createVisual();
    super.restoreState(state);
    this.setSize();
  }
}
