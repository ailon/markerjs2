import Icon from './ellipse-marker-icon.svg';
import { IPoint } from '../../core/IPoint';
import { SvgHelper } from '../../core/SvgHelper';
import { RectangularBoxMarkerBase } from '../RectangularBoxMarkerBase';
import { Settings } from '../../core/Settings';
import { RectangleMarkerState } from '../RectangleMarkerState';
import { MarkerBaseState } from '../../core/MarkerBaseState';
import { ColorPickerPanel } from '../../ui/toolbox-panels/ColorPickerPanel';
import { LineWidthPanel } from '../../ui/toolbox-panels/LineWidthPanel';
import { LineStylePanel } from '../../ui/toolbox-panels/LineStylePanel';
import { ToolboxPanel } from '../../ui/ToolboxPanel';
import FillColorIcon from '../../ui/toolbox-panels/fill-color-icon.svg';
import { OpacityPanel } from '../../ui/toolbox-panels/OpacityPanel';

export class EllipseMarker extends RectangularBoxMarkerBase {
  /**
   * String type name of the marker type. 
   * 
   * Used when adding {@link MarkerArea.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'EllipseMarker';
  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Ellipse marker';
  /**
   * SVG icon markup displayed on toolbar buttons.
   */
  public static icon = Icon;

  /**
   * Ellipse fill color.
   */
  protected fillColor = 'transparent';
  /**
   * Ellipse border color.
   */
  protected strokeColor = 'transparent';
  /**
   * Ellipse border line width.
   */
  protected strokeWidth = 0;
  /**
   * Ellipse border dash array.
   */
  protected strokeDasharray = '';
  /**
   * Ellipse opacity (0..1).
   */
  protected opacity = 1;

  protected strokePanel: ColorPickerPanel;
  protected fillPanel: ColorPickerPanel;
  protected strokeWidthPanel: LineWidthPanel;
  protected strokeStylePanel: LineStylePanel;
  protected opacityPanel: OpacityPanel;

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   * @param overlayContainer - overlay HTML container to hold additional overlay elements while editing.
   * @param settings - settings object containing default markers settings.
   */
  constructor(container: SVGGElement, overlayContainer: HTMLDivElement, settings: Settings) {
    super(container, overlayContainer, settings);

    this.strokeColor = settings.defaultColor;
    this.strokeWidth = settings.defaultStrokeWidth;
    this.strokeDasharray = settings.defaultStrokeDasharray;
    this.fillColor = settings.defaultFillColor;

    this.setStrokeColor = this.setStrokeColor.bind(this);
    this.setFillColor = this.setFillColor.bind(this);
    this.setStrokeWidth = this.setStrokeWidth.bind(this);
    this.setStrokeDasharray = this.setStrokeDasharray.bind(this);
    this.setOpacity = this.setOpacity.bind(this);
    this.createVisual = this.createVisual.bind(this);

    this.strokePanel = new ColorPickerPanel(
      'Line color',
      [...settings.defaultColorSet, 'transparent'],
      settings.defaultColor
    );
    this.strokePanel.onColorChanged = this.setStrokeColor;

    this.fillPanel = new ColorPickerPanel(
      'Fill color',
      [...settings.defaultColorSet, 'transparent'],
      this.fillColor,
      FillColorIcon
    );
    this.fillPanel.onColorChanged = this.setFillColor;

    this.strokeWidthPanel = new LineWidthPanel(
      'Line width',
      settings.defaultStrokeWidths,
      settings.defaultStrokeWidth
    );
    this.strokeWidthPanel.onWidthChanged = this.setStrokeWidth;

    this.strokeStylePanel = new LineStylePanel(
      'Line style',
      settings.defaultStrokeDasharrays,
      settings.defaultStrokeDasharray
    );
    this.strokeStylePanel.onStyleChanged = this.setStrokeDasharray;

    this.opacityPanel = new OpacityPanel(
      'Opacity',
      settings.defaultOpacitySteps,
      this.opacity
    );
    this.opacityPanel.onOpacityChanged = this.setOpacity;
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
   * Creates marker visual.
   */
  protected createVisual(): void {
    this.visual = SvgHelper.createEllipse(this.width / 2, this.height / 2, [
      ['fill', this.fillColor],
      ['stroke', this.strokeColor],
      ['stroke-width', this.strokeWidth.toString()],
      ['stroke-dasharray', this.strokeDasharray],
      ['opacity', this.opacity.toString()]
    ]);
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
   * Resize marker based on current pointer coordinates and context.
   * @param point 
   */
  protected resize(point: IPoint): void {
    super.resize(point);
    this.setSize();
  }

  /**
   * Sets marker's visual size after manipulation.
   */
  protected setSize(): void {
    super.setSize();
    SvgHelper.setAttributes(this.visual, [
      ['cx', (this.width / 2).toString()],
      ['cy', (this.height / 2).toString()],
      ['rx', (this.width / 2).toString()],
      ['ry', (this.height / 2).toString()],
    ]);
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) up event.
   * 
   * @param point - event coordinates.
   */
  public pointerUp(point: IPoint): void {
    super.pointerUp(point);
    this.setSize();
  }

  /**
   * Sets marker's line color.
   * @param color - new line color.
   */
  protected setStrokeColor(color: string): void {
    this.strokeColor = color;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke', this.strokeColor]]);
    }
  }
  /**
   * Sets marker's fill (background) color.
   * @param color - new fill color.
   */
  protected setFillColor(color: string): void {
    this.fillColor = color;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['fill', this.fillColor]]);
    }
  }
  /**
   * Sets marker's line width.
   * @param width - new line width
   */
  protected setStrokeWidth(width: number): void {
    this.strokeWidth = width;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke-width', this.strokeWidth.toString()]]);
    }
  }
  /**
   * Sets marker's border dash array.
   * @param dashes - new dash array.
   */
  protected setStrokeDasharray(dashes: string): void {
    this.strokeDasharray = dashes;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke-dasharray', this.strokeDasharray]]);
    }
  }
  /**
   * Sets marker's opacity.
   * @param opacity - new opacity value (0..1).
   */
  protected setOpacity(opacity: number): void {
    this.opacity = opacity;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['opacity', this.opacity.toString()]]);
    }
  }

  /**
   * Returns the list of toolbox panels for this marker type.
   */
  public get toolboxPanels(): ToolboxPanel[] {
    return [this.strokePanel, this.fillPanel, this.strokeWidthPanel, this.strokeStylePanel, this.opacityPanel];
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
    result.typeName = EllipseMarker.typeName;

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

  /**
   * Scales marker. Used after the image resize.
   * 
   * @param scaleX - horizontal scale
   * @param scaleY - vertical scale
   */
  public scale(scaleX: number, scaleY: number): void {
    super.scale(scaleX, scaleY);

    this.setSize();
  }
}
