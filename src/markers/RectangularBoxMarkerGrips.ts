import { ResizeGrip } from './ResizeGrip';

export class RectangularBoxMarkerGrips {
  public topLeft: ResizeGrip;
  public topCenter: ResizeGrip;
  public topRight: ResizeGrip;
  public centerLeft: ResizeGrip;
  public centerRight: ResizeGrip;
  public bottomLeft: ResizeGrip;
  public bottomCenter: ResizeGrip;
  public bottomRight: ResizeGrip;

  constructor() {
    this.findGripByVisual = this.findGripByVisual.bind(this);
  }

  public findGripByVisual(
    gripVisual: EventTarget
  ): ResizeGrip | undefined {
      if (this.topLeft.ownsTarget(gripVisual)) {
        return this.topLeft;
      } else if (this.topCenter.ownsTarget(gripVisual)) {
        return this.topCenter;
      } else if (this.topRight.ownsTarget(gripVisual)) {
        return this.topRight;
      } else if (this.centerLeft.ownsTarget(gripVisual)) {
        return this.centerLeft;
      } else if (this.centerRight.ownsTarget(gripVisual)) {
        return this.centerRight;
      } else if (this.bottomLeft.ownsTarget(gripVisual)) {
        return this.bottomLeft;
      } else if (this.bottomCenter.ownsTarget(gripVisual)) {
        return this.bottomCenter;
      } else if (this.bottomRight.ownsTarget(gripVisual)) {
        return this.bottomRight;
      } else {
        return undefined;
      }
  }
}
