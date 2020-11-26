import { IPoint } from '../../MarkerArea';
import { SvgHelper } from '../../core/SvgHelper';
import { Settings } from '../../core/Settings';
import { LinearMarkerBase } from '../LinearMarkerBase';
import Icon from './line-marker-icon.svg';
import { ColorPickerPanel } from '../../ui/toolbox-panels/ColorPickerPanel';
import { ToolboxPanel } from '../../ui/ToolboxPanel';
import { LineWidthPanel } from '../../ui/toolbox-panels/LineWidthPanel';
import { LineStylePanel } from '../../ui/toolbox-panels/LineStylePanel';
import { LineMarkerState } from './LineMarkerState';
import { MarkerBaseState } from '../../core/MarkerBaseState';

export class LineMarker extends LinearMarkerBase {
  public static typeName = 'LineMarker';
  
  public static title = 'Line marker';
  public static icon = Icon;

  protected selectorLine: SVGLineElement;
  protected visibleLine: SVGLineElement;

  protected strokeColor = 'transparent';
  protected strokeWidth = 0;
  protected strokeDasharray = '';

  protected strokePanel: ColorPickerPanel;
  protected strokeWidthPanel: LineWidthPanel;
  protected strokeStylePanel: LineStylePanel;

  constructor(container: SVGGElement, overlayContainer: HTMLDivElement, settings: Settings) {
    super(container, overlayContainer, settings);

    this.setStrokeColor = this.setStrokeColor.bind(this);
    this.setStrokeWidth = this.setStrokeWidth.bind(this);
    this.setStrokeDasharray = this.setStrokeDasharray.bind(this);

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

  public ownsTarget(el: EventTarget): boolean {
    if (
      super.ownsTarget(el) ||
      el === this.visual ||
      el === this.selectorLine ||
      el === this.visibleLine
    ) {
      return true;
    } else {
      return false;
    }
  }

  private createVisual() {
    this.visual = SvgHelper.createGroup();
    this.selectorLine = SvgHelper.createLine(
      this.x1,
      this.y1,
      this.x2,
      this.y2,
      [
        ['stroke', 'transparent'],
        ['stroke-width', (this.strokeWidth + 10).toString()],
      ]
    );
    this.visibleLine = SvgHelper.createLine(
      this.x1,
      this.y1,
      this.x2,
      this.y2,
      [
        ['stroke', this.strokeColor],
        ['stroke-width', this.strokeWidth.toString()],
      ]
    );
    this.visual.appendChild(this.selectorLine);
    this.visual.appendChild(this.visibleLine);

    this.addMarkerVisualToContainer(this.visual);
  }

  public pointerDown(point: IPoint, target?: EventTarget): void {
    super.pointerDown(point, target);
    if (this.state === 'new') {
      this.createVisual();
      this.adjustVisual();

      this._state = 'creating';
    }
  }

  protected adjustVisual(): void {
    this.selectorLine.setAttribute('x1', this.x1.toString());
    this.selectorLine.setAttribute('y1', this.y1.toString());
    this.selectorLine.setAttribute('x2', this.x2.toString());
    this.selectorLine.setAttribute('y2', this.y2.toString());

    this.visibleLine.setAttribute('x1', this.x1.toString());
    this.visibleLine.setAttribute('y1', this.y1.toString());
    this.visibleLine.setAttribute('x2', this.x2.toString());
    this.visibleLine.setAttribute('y2', this.y2.toString());

    SvgHelper.setAttributes(this.visibleLine, [['stroke', this.strokeColor]]);
    SvgHelper.setAttributes(this.visibleLine, [['stroke-width', this.strokeWidth.toString()]]);
    SvgHelper.setAttributes(this.visibleLine, [['stroke-dasharray', this.strokeDasharray.toString()]]);
  }

  protected setStrokeColor(color: string): void {
    this.strokeColor = color;
    this.adjustVisual();
  }
  protected setStrokeWidth(width: number): void {
    this.strokeWidth = width
    this.adjustVisual();
  }

  protected setStrokeDasharray(dashes: string): void {
    this.strokeDasharray = dashes;
    this.adjustVisual();
  }

  public get toolboxPanels(): ToolboxPanel[] {
    return [this.strokePanel, this.strokeWidthPanel, this.strokeStylePanel];
  }

  public getState(): LineMarkerState {
    const result: LineMarkerState = Object.assign({
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      strokeDasharray: this.strokeDasharray
    }, super.getState());
    result.typeName = LineMarker.typeName;

    return result;
  }

  public restoreState(state: MarkerBaseState): void {
    super.restoreState(state);

    const lmState = state as LineMarkerState;
    this.strokeColor = lmState.strokeColor;
    this.strokeWidth = lmState.strokeWidth;
    this.strokeDasharray = lmState.strokeDasharray;

    this.createVisual();
    this.adjustVisual();
  }
}
