import { ResizeGrip } from './ResizeGrip';

/**
 * RectangularBoxMarkerGrips is a set of resize/rotation grips for a rectangular marker.
 */
export class RectangularBoxMarkerGrips {
  /**
   * Top-left grip.
   */
  public topLeft: ResizeGrip;
  /**
   * Top-center grip.
   */
  public topCenter: ResizeGrip;
  /**
   * Top-right grip.
   */
  public topRight: ResizeGrip;
  /**
   * Center-left grip.
   */
  public centerLeft: ResizeGrip;
  /**
   * Center-right grip.
   */
  public centerRight: ResizeGrip;
  /**
   * Bottom-left grip.
   */
  public bottomLeft: ResizeGrip;
  /**
   * Bottom-center grip.
   */
  public bottomCenter: ResizeGrip;
  /**
   * Bottom-right grip.
   */
  public bottomRight: ResizeGrip;

  /**
   * Creates a new marker grip set.
   */
  constructor() {
    this.findGripByVisual = this.findGripByVisual.bind(this);
  }

  /**
   * Returns a marker grip owning the specified visual.
   * @param gripVisual - visual for owner to be determined.
   */
  public findGripByVisual(gripVisual: EventTarget): ResizeGrip | undefined {
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
