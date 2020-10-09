import Icon from './rectangle-marker-icon.svg';
import { IPoint } from '../../MarkerArea';
import { SvgHelper } from '../../core/SvgHelper';
import { ToolboxPanel } from '../../ui/ToolboxPanel';
import { ColorPickerPanel } from '../../ui/toolbox-panels/ColorPickerPanel';
import { RectangularBoxMarkerBase } from '../RectangularBoxMarkerBase';

export class RectangleMarker extends RectangularBoxMarkerBase {
  public static title = 'Rectangle marker';
  public static icon = Icon;

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
    if (super.ownsTarget(el) || el === this.visual) {
      return true;
    } else {
      return false;
    }
  }

  public mouseDown(point: IPoint, target?: EventTarget): void {
    super.mouseDown(point, target);
    if (this.state === 'new') {
      this.visual = SvgHelper.createRect(1, 1, [['fill', '#ff0000']]);
      const translate = SvgHelper.createTransform();
      this.visual.transform.baseVal.appendItem(translate);

      this.moveVisual(point);

      this.addMarkerVisualToContainer(this.visual);
      this._state = 'creating';
    }
  }

  public mouseUp(point: IPoint): void {
    super.mouseUp(point);
  }
}
