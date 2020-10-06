import Icon from './rectangle-marker-icon.svg';
import { IPoint } from '../../MarkerArea';
import { SvgHelper } from '../../core/SvgHelper';
import { ToolboxPanel } from '../../ui/ToolboxPanel';
import { ColorPickerPanel } from '../../ui/toolbox-panels/ColorPickerPanel';
import { RectangularBoxMarkerBase } from '../RectangularBoxMarkerBase';

export class RectangleMarker extends RectangularBoxMarkerBase {
  public static title = 'Rectangle marker';
  public static icon = Icon;

  private visual: SVGRectElement;

  private manipulationStartX: number;
  private manipulationStartY: number;

  private fillPanel: ColorPickerPanel = new ColorPickerPanel([
    '#ff0000',
    '#00ff00',
    '#0000ff',
  ]);

  constructor(container: SVGGElement) {
    super(container);

    this._name = 'rectangle';
  }

  public get toolboxPanels(): ToolboxPanel[] {
    return [this.fillPanel];
  }

  public ownsTarget(el: EventTarget): boolean {
    if (el === this.visual) {
      return true;
    } else {
      return false;
    }
  }

  public mouseDown(point: IPoint, target?: EventTarget): void {
    super.mouseDown(point, target);
    if (this.state === 'new') {
      this.left = point.x;
      this.top = point.y;

      this.manipulationStartX = this.left;
      this.manipulationStartY = this.top;

      this.visual = SvgHelper.createRect(1, 1, [['fill', '#ff0000']]);
      this.visual.transform.baseVal.appendItem(SvgHelper.createTransform());

      this.moveVisual(point);

      this.addMarkerVisualToContainer(this.visual);
      this._state = 'creating';
    }
  }

  private moveVisual(point: IPoint) {
    const translate = this.visual.transform.baseVal.getItem(0);
    translate.setTranslate(point.x, point.y);
    this.visual.transform.baseVal.replaceItem(translate, 0);
  }

  public manipulate(point: IPoint): void {
    if (this.state === 'creating') {
      if (point.x - this.manipulationStartX >= 0) {
        this.width = point.x - this.left;
      } else {
        this.width += Math.round(this.left - point.x);
        this.left =  point.x;
      }
      if (point.y - this.manipulationStartY >= 0) {
        this.height = point.y - this.top;
      } else {
        this.height += Math.round(this.top - point.y);
        this.top = point.y;
      }

      this.moveVisual({x: this.left, y: this.top});

      SvgHelper.setAttributes(this.visual, [
        ['width', this.width.toString()],
        ['height', this.height.toString()],
      ]);
    }
  }

  public mouseUp(point: IPoint): void {
    this.manipulate(point);
    this._state = 'created';
    if (this.onMarkerCreated) {
      this.onMarkerCreated(this);
    }
  }
}
