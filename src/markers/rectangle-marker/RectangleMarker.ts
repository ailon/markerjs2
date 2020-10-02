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

      this.visual = SvgHelper.createRect(1, 1, [['fill', '#ff0000']]);
      this.visual.transform.baseVal.appendItem(SvgHelper.createTransform());

      const translate = this.visual.transform.baseVal.getItem(0);
      translate.setTranslate(point.x, point.y);
      this.visual.transform.baseVal.replaceItem(translate, 0);

      this.addMarkerVisualToContainer(this.visual);
      this._state = 'creating';
    }
  }

  public manipulate(point: IPoint): void {
    if (this.state === 'creating') {
      this.width = point.x - this.left;
      this.height = point.y - this.top;
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
