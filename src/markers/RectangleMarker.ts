import { IPoint } from '../MarkerArea';
import { SvgHelper } from '../core/SvgHelper';
import { RectangularBoxMarkerBase } from './RectangularBoxMarkerBase';
import { Settings } from '../core/Settings';
import { RectangleMarkerState } from './RectangleMarkerState';
import { MarkerBaseState } from '../core/MarkerBaseState';

export abstract class RectangleMarker extends RectangularBoxMarkerBase {
  public static title = 'Rectangle marker';

  protected fillColor = 'transparent';
  protected strokeColor = 'transparent';
  protected strokeWidth = 0;
  protected strokeDasharray = '';
  protected opacity = 1;

  constructor(container: SVGGElement, overlayContainer: HTMLDivElement, settings: Settings) {
    super(container, overlayContainer, settings);

    this.setStrokeColor = this.setStrokeColor.bind(this);
    this.setFillColor = this.setFillColor.bind(this);
    this.setStrokeWidth = this.setStrokeWidth.bind(this);
    this.setStrokeDasharray = this.setStrokeDasharray.bind(this);
    this.createVisual = this.createVisual.bind(this);
  }

  public ownsTarget(el: EventTarget): boolean {
    if (super.ownsTarget(el) || el === this.visual) {
      return true;
    } else {
      return false;
    }
  }

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
      ['width', this.width.toString()],
      ['height', this.height.toString()],
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
