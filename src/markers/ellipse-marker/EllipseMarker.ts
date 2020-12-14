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
  public static typeName = 'EllipseMarker';
  public static title = 'Ellipse marker';
  public static icon = Icon;

  protected fillColor = 'transparent';
  protected strokeColor = 'transparent';
  protected strokeWidth = 0;
  protected strokeDasharray = '';
  protected opacity = 1;

  private strokePanel: ColorPickerPanel;
  private fillPanel: ColorPickerPanel;
  private strokeWidthPanel: LineWidthPanel;
  private strokeStylePanel: LineStylePanel;
  protected opacityPanel: OpacityPanel;

  constructor(container: SVGGElement, overlayContainer: HTMLDivElement, settings: Settings) {
    super(container, overlayContainer, settings);

    this.strokeColor = settings.defaultColor;
    this.strokeWidth = settings.defaultStrokeWidth;
    this.strokeDasharray = settings.defaultStrokeDasharray;

    this.setStrokeColor = this.setStrokeColor.bind(this);
    this.setFillColor = this.setFillColor.bind(this);
    this.setStrokeWidth = this.setStrokeWidth.bind(this);
    this.setStrokeDasharray = this.setStrokeDasharray.bind(this);
    this.setOpacity = this.setOpacity.bind(this);
    this.createVisual = this.createVisual.bind(this);

    this.strokePanel = new ColorPickerPanel(
      'Line color',
      settings.defaultColorSet,
      settings.defaultColor
    );
    this.strokePanel.onColorChanged = this.setStrokeColor;

    this.fillPanel = new ColorPickerPanel(
      'Fill color',
      settings.defaultColorSet,
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

  public ownsTarget(el: EventTarget): boolean {
    if (super.ownsTarget(el) || el === this.visual) {
      return true;
    } else {
      return false;
    }
  }

  protected createVisual(): void {
    this.visual = SvgHelper.createEllipse(this.width / 2, this.height / 2, [
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

  public pointerDown(point: IPoint, target?: EventTarget): void {
    super.pointerDown(point, target);
    if (this.state === 'new') {
      this.createVisual();

      this.moveVisual(point);

      this._state = 'creating';
    }
  }

  public manipulate(point: IPoint): void {
    super.manipulate(point);
  }

  protected resize(point: IPoint): void {
    super.resize(point);
    this.setSize();
  }

  protected setSize(): void {
    super.setSize();
    SvgHelper.setAttributes(this.visual, [
      ['cx', (this.width / 2).toString()],
      ['cy', (this.height / 2).toString()],
      ['rx', (this.width / 2).toString()],
      ['ry', (this.height / 2).toString()],
    ]);
  }

  public pointerUp(point: IPoint): void {
    super.pointerUp(point);
    this.setSize();
  }

  protected setStrokeColor(color: string): void {
    this.strokeColor = color;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke', this.strokeColor]]);
    }
  }
  protected setFillColor(color: string): void {
    this.fillColor = color;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['fill', this.fillColor]]);
    }
  }
  protected setStrokeWidth(width: number): void {
    this.strokeWidth = width;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke-width', this.strokeWidth.toString()]]);
    }
  }
  protected setStrokeDasharray(dashes: string): void {
    this.strokeDasharray = dashes;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke-dasharray', this.strokeDasharray]]);
    }
  }

  protected setOpacity(opacity: number): void {
    this.opacity = opacity;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['opacity', this.opacity.toString()]]);
    }
  }

  public get toolboxPanels(): ToolboxPanel[] {
    return [this.strokePanel, this.fillPanel, this.strokeWidthPanel, this.strokeStylePanel, this.opacityPanel];
  }

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
