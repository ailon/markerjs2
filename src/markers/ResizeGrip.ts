import { SvgHelper } from '../core/SvgHelper';

export class ResizeGrip {
  public visual: SVGGraphicsElement;

  public readonly GRIP_SIZE = 10;

  constructor() {
    this.visual = SvgHelper.createCircle(this.GRIP_SIZE, [
      ['fill', '#cccccc'],
      ['stroke', '#333333'],
      ['stroke-width', '2'],
    ]);
  }

  public ownsTarget(el: EventTarget): boolean {
    if (el === this.visual) {
      return true;
    } else {
      return false;
    }
  }
}
