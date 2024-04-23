import { IPoint } from '../../core/IPoint';
import { SvgHelper } from '../../core/SvgHelper';
import { Settings } from '../../core/Settings';
import { LinearMarkerBase } from '../LinearMarkerBase';
import Icon from './curve-marker-icon.svg';
import { ColorPickerPanel } from '../../ui/toolbox-panels/ColorPickerPanel';
import { ToolboxPanel } from '../../ui/ToolboxPanel';
import { LineWidthPanel } from '../../ui/toolbox-panels/LineWidthPanel';
import { LineStylePanel } from '../../ui/toolbox-panels/LineStylePanel';
import { CurveMarkerState } from './CurveMarkerState';
import { MarkerBaseState } from '../../core/MarkerBaseState';
import { ResizeGrip } from '../ResizeGrip';

export class CurveMarker extends LinearMarkerBase {
  /**
   * String type name of the marker type.
   *
   * Used when adding {@link MarkerArea.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'CurveMarker';

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Curve marker';
  /**
   * SVG icon markup displayed on toolbar buttons.
   */
  public static icon = Icon;

  /**
   * Invisible wider curve to make selection easier/possible.
   */
  protected selectorCurve: SVGPathElement;
  /**
   * Visible marker curve.
   */
  protected visibleCurve: SVGPathElement;

  /**
   * Line color.
   */
  protected strokeColor = 'transparent';
  /**
   * Line width.
   */
  protected strokeWidth = 0;
  /**
   * Line dash array.
   */
  protected strokeDasharray = '';

  /**
   * Color picker panel for line color.
   */
  protected strokePanel: ColorPickerPanel;
  /**
   * Line width toolbox panel.
   */
  protected strokeWidthPanel: LineWidthPanel;
  /**
   * Line dash array toolbox panel.
   */
  protected strokeStylePanel: LineStylePanel;

  private curveGrip: ResizeGrip;
  private curveX = 0;
  private curveY = 0;

  private manipulationStartCurveX = 0;
  private manipulationStartCurveY = 0;

  private curveControlLine1: SVGLineElement;
  private curveControlLine2: SVGLineElement;

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   * @param overlayContainer - overlay HTML container to hold additional overlay elements while editing.
   * @param settings - settings object containing default markers settings.
   */
  constructor(
    container: SVGGElement,
    overlayContainer: HTMLDivElement,
    settings: Settings
  ) {
    super(container, overlayContainer, settings);

    this.setStrokeColor = this.setStrokeColor.bind(this);
    this.setStrokeWidth = this.setStrokeWidth.bind(this);
    this.setStrokeDasharray = this.setStrokeDasharray.bind(this);
    this.positionGrips = this.positionGrips.bind(this);
    this.addControlGrips = this.addControlGrips.bind(this);
    this.adjustVisual = this.adjustVisual.bind(this);
    this.setupControlBox = this.setupControlBox.bind(this);
    this.resize = this.resize.bind(this);

    this.strokeColor = settings.defaultColor;
    this.strokeWidth = settings.defaultStrokeWidth;
    this.strokeDasharray = settings.defaultStrokeDasharray;

    this.strokePanel = new ColorPickerPanel(
      'Line color',
      settings.defaultColorSet,
      settings.defaultColor
    );
    this.strokePanel.onColorChanged = this.setStrokeColor;

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
  }

  /**
   * Returns true if passed SVG element belongs to the marker. False otherwise.
   *
   * @param el - target element.
   */
  public ownsTarget(el: EventTarget): boolean {
    if (
      super.ownsTarget(el) ||
      el === this.visual ||
      el === this.selectorCurve ||
      el === this.visibleCurve ||
      this.curveGrip.ownsTarget(el)
    ) {
      return true;
    } else {
      return false;
    }
  }

  private getPathD(): string {
    const result = `M ${this.x1} ${this.y1} Q ${this.curveX} ${this.curveY}, ${this.x2} ${this.y2}`;
    return result;
  }

  private createVisual() {
    this.visual = SvgHelper.createGroup();
    this.selectorCurve = SvgHelper.createPath(this.getPathD(), [
      ['stroke', 'transparent'],
      ['stroke-width', (this.strokeWidth + 10).toString()],
      ['fill', 'transparent'],
    ]);
    this.visibleCurve = SvgHelper.createPath(this.getPathD(), [
      ['stroke', this.strokeColor],
      ['stroke-width', this.strokeWidth.toString()],
      ['fill', 'transparent'],
    ]);
    this.visual.appendChild(this.selectorCurve);
    this.visual.appendChild(this.visibleCurve);

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

    this.manipulationStartCurveX = this.curveX;
    this.manipulationStartCurveY = this.curveY;
    if (this.state === 'new') {
      this.curveX = point.x;
      this.curveY = point.y;
    }

    if (this.state === 'new') {
      this.createVisual();
      this.adjustVisual();

      this._state = 'creating';
    } else if (this.curveGrip.ownsTarget(target)) {
      this.activeGrip = this.curveGrip;
      this._state = 'resize';
    }
  }

  /**
   * Adjusts visual after manipulation.
   */
  protected adjustVisual(): void {
    if (this.selectorCurve && this.visibleCurve) {
      this.selectorCurve.setAttribute('d', this.getPathD());

      this.visibleCurve.setAttribute('d', this.getPathD());

      SvgHelper.setAttributes(this.visibleCurve, [
        ['stroke', this.strokeColor],
      ]);
      SvgHelper.setAttributes(this.visibleCurve, [
        ['stroke-width', this.strokeWidth.toString()],
      ]);
      SvgHelper.setAttributes(this.visibleCurve, [
        ['stroke-dasharray', this.strokeDasharray.toString()],
      ]);
    }
  }

  /**
   * Sets manipulation grips up.
   */
  protected setupControlBox(): void {
    super.setupControlBox();
    this.curveControlLine1 = SvgHelper.createLine(
      this.x1,
      this.y1,
      this.curveX,
      this.curveY,
      [
        ['stroke', 'black'],
        ['stroke-width', '1'],
        ['stroke-opacity', '0.5'],
        ['stroke-dasharray', '3, 2'],
      ]
    );
    this.curveControlLine2 = SvgHelper.createLine(
      this.x2,
      this.y2,
      this.curveX,
      this.curveY,
      [
        ['stroke', 'black'],
        ['stroke-width', '1'],
        ['stroke-opacity', '0.5'],
        ['stroke-dasharray', '3, 2'],
      ]
    );

    this.controlBox.insertBefore(
      this.curveControlLine1,
      this.controlBox.firstChild
    );
    this.controlBox.insertBefore(
      this.curveControlLine2,
      this.controlBox.firstChild
    );
  }

  /**
   * Add manipulation grips to the control box.
   */
  protected addControlGrips(): void {
    this.curveGrip = this.createGrip();
    this.curveX = 0;
    this.curveY = 0;
    super.addControlGrips();
  }

  /**
   * Positions manipulation grips.
   */
  protected positionGrips(): void {
    super.positionGrips();
    const gripSize = this.curveGrip.GRIP_SIZE;
    this.positionGrip(
      this.curveGrip.visual,
      this.curveX - gripSize / 2,
      this.curveY - gripSize / 2
    );

    if (this.curveControlLine1 && this.curveControlLine2) {
      this.curveControlLine1.setAttribute('x1', this.x1.toString());
      this.curveControlLine1.setAttribute('y1', this.y1.toString());
      this.curveControlLine1.setAttribute('x2', this.curveX.toString());
      this.curveControlLine1.setAttribute('y2', this.curveY.toString());

      this.curveControlLine2.setAttribute('x1', this.x2.toString());
      this.curveControlLine2.setAttribute('y1', this.y2.toString());
      this.curveControlLine2.setAttribute('x2', this.curveX.toString());
      this.curveControlLine2.setAttribute('y2', this.curveY.toString());
    }
  }

  /**
   * Moves or resizes the marker.
   * @param point event coordinates
   */
  public manipulate(point: IPoint): void {
    if (this.state === 'move') {
      this.curveX =
        this.manipulationStartCurveX + point.x - this.manipulationStartX;
      this.curveY =
        this.manipulationStartCurveY + point.y - this.manipulationStartY;
    }
    super.manipulate(point);
  }

  /**
   * Resizes the marker.
   * @param point event coordinates.
   */
  protected resize(point: IPoint): void {
    if (this.activeGrip === this.curveGrip) {
      this.curveX = point.x;
      this.curveY = point.y;
    }
    super.resize(point);
    if (this.state === 'creating') {
      this.curveX = this.x1 + (this.x2 - this.x1) / 2;
      this.curveY = this.y1 + (this.y2 - this.y1) / 2;
    }
  }

  /**
   * Sets line color.
   * @param color - new color.
   */
  protected setStrokeColor(color: string): void {
    this.strokeColor = color;
    this.adjustVisual();
    this.colorChanged(color);
  }
  /**
   * Sets line width.
   * @param width - new width.
   */
  protected setStrokeWidth(width: number): void {
    this.strokeWidth = width;
    this.adjustVisual();
  }

  /**
   * Sets line dash array.
   * @param dashes - new dash array.
   */
  protected setStrokeDasharray(dashes: string): void {
    this.strokeDasharray = dashes;
    this.adjustVisual();
  }

  /**
   * Scales marker. Used after the image resize.
   *
   * @param scaleX - horizontal scale
   * @param scaleY - vertical scale
   */
  public scale(scaleX: number, scaleY: number): void {
    this.curveX = this.curveX * scaleX;
    this.curveY = this.curveY * scaleY;
    super.scale(scaleX, scaleY);
  }

  /**
   * Returns the list of toolbox panels for this marker type.
   */
  public get toolboxPanels(): ToolboxPanel[] {
    return [this.strokePanel, this.strokeWidthPanel, this.strokeStylePanel];
  }

  /**
   * Returns current marker state that can be restored in the future.
   */
  public getState(): CurveMarkerState {
    const result: CurveMarkerState = Object.assign(
      {
        strokeColor: this.strokeColor,
        strokeWidth: this.strokeWidth,
        strokeDasharray: this.strokeDasharray,
        curveX: this.curveX,
        curveY: this.curveY,
      },
      super.getState()
    );
    result.typeName = CurveMarker.typeName;

    return result;
  }

  /**
   * Restores previously saved marker state.
   *
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    super.restoreState(state);

    const lmState = state as CurveMarkerState;
    this.strokeColor = lmState.strokeColor;
    this.strokeWidth = lmState.strokeWidth;
    this.strokeDasharray = lmState.strokeDasharray;
    this.curveX = lmState.curveX;
    this.curveY = lmState.curveY;

    this.createVisual();
    this.adjustVisual();
  }
}
