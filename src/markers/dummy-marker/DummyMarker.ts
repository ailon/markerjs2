import { MarkerBase } from '../../core/MarkerBase';

import Icon from './dummy-marker-icon.svg';
import { IPoint } from '../../MarkerArea';
import { SvgHelper } from '../../core/SvgHelper';
import { ToolboxPanel } from '../../ui/ToolboxPanel';
import { ColorPickerPanel } from '../../ui/toolbox-panels/ColorPickerPanel';

export class DummyMarker extends MarkerBase {
  public static title = 'Dummy marker';
  public static icon = Icon;

  private left = 0;
  private top = 0;

  private visual: SVGRectElement;

  private fillPanel: ColorPickerPanel = new ColorPickerPanel([
    '#ff0000',
    '#00ff00',
    '#0000ff',
  ]);

  constructor(container: SVGGElement) {
    super(container);

    this._name = 'dummy';
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
    console.log(this.state);
    if (this.state === 'new') {
      this.left = point.x;
      this.top = point.y;

      this.visual = SvgHelper.createRect(1, 1, [['fill', '#ff0000']]);
      this.visual.transform.baseVal.appendItem(SvgHelper.createTransform());

      const translate = this.visual.transform.baseVal.getItem(0);
      translate.setTranslate(point.x, point.y);
      this.visual.transform.baseVal.replaceItem(translate, 0);

      this.container.appendChild(this.visual);
      this._state = 'creating';
    } else if (target === this.visual) {
      console.log('hit');
      // start move
      SvgHelper.setAttributes(this.visual, [
        [
          'fill',
          `rgb(${Math.round(Math.random() * 255)}, ${Math.round(
            Math.random() * 255
          )}, ${Math.round(Math.random() * 255)})`,
        ],
      ]);
    }
  }

  public manipulate(point: IPoint): void {
    if (this.state === 'creating') {
      SvgHelper.setAttributes(this.visual, [
        ['width', (point.x - this.left).toString()],
        ['height', (point.y - this.top).toString()],
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
