import { SvgHelper } from '../core/SvgHelper';

/**
 * Represents a single resize-manipulation grip used in marker's manipulation controls.
 */
export class ResizeGrip {
  /**
   * Grip's visual element.
   */
  public visual: SVGGraphicsElement;

  /**
   * Grip's size (raduis).
   */
  public readonly GRIP_SIZE = 10;

  /**
   * Creates a new grip.
   */
  constructor() {
    this.visual = SvgHelper.createGroup();
    this.visual.appendChild(
      SvgHelper.createCircle(this.GRIP_SIZE * 1.5, [['fill', 'transparent']])
    );
    this.visual.appendChild(
      SvgHelper.createCircle(this.GRIP_SIZE, [
        ['fill', '#cccccc'],
        ['fill-opacity', '0.7'],
        ['stroke', '#333333'],
        ['stroke-width', '2'],
        ['stroke-opacity', '0.7']
      ])
    );
  }

  /**
   * Returns true if passed SVG element belongs to the grip. False otherwise.
   *
   * @param el - target element.
   */
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
