import { SvgHelper } from '../core/SvgHelper';

export class ResizeGrip {
  public visual: SVGGraphicsElement;

  public readonly GRIP_SIZE = 10;

  constructor() {
    this.visual = SvgHelper.createGroup();
    this.visual.appendChild(
      SvgHelper.createCircle(this.GRIP_SIZE * 1.5, [['fill', 'transparent']])
    );
    this.visual.appendChild(
      SvgHelper.createCircle(this.GRIP_SIZE, [
        ['fill', '#cccccc'],
        ['stroke', '#333333'],
        ['stroke-width', '2'],
      ])
    );
  }

  public ownsTarget(el: EventTarget): boolean {
    if (
      el === this.visual ||
      el === this.visual.childNodes[0] ||
      el === this.visual.childNodes[1]
    ) {
      return true;
    } else {
      return false;
    }
  }
}
