import { MarkerBase } from '../core/MarkerBase';

import { IPoint } from '../MarkerArea';
import { SvgHelper } from '../core/SvgHelper';

import { RectangularBoxMarkerGrips } from './RectangularBoxMarkerGrips';
import { ResizeGrip } from './ResizeGrip';

export class RectangularBoxMarkerBase extends MarkerBase {
  protected left = 0;
  protected top = 0;
  protected width = 100;
  protected height = 100;

  private controlBox: SVGGElement;
  private readonly CB_DISTANCE: number = 10;
  private controlRect: SVGRectElement;
  private rotatorGripLine: SVGLineElement;

  private controlGrips: RectangularBoxMarkerGrips;
  private rotatorGrip: ResizeGrip;
  private activeGrip: ResizeGrip;

  protected markerElement: SVGGElement;

  constructor(container: SVGGElement) {
    super(container);

    this.setupControlBox();
  }

  public mouseDown(point: IPoint, target?: EventTarget): void {
    super.mouseDown(point, target);
    if (this.state !== 'new') {
      this.select();
    }
  }

  public mouseUp(point: IPoint): void {
    this.manipulate(point);
    if (this.state === 'new') {
      this._state = 'created';
      if (this.onMarkerCreated) {
        this.onMarkerCreated(this);
      }
    }
  }

  public select(): void {
    super.select();
    this.adjustControlBox();
    this.controlBox.style.display = '';
  }

  public deselect(): void {
    super.deselect();
    this.controlBox.style.display = 'none';
  }

  private setupControlBox() {
    this.controlBox = SvgHelper.createGroup();
    const translate = SvgHelper.createTransform();
    translate.setTranslate(-this.CB_DISTANCE / 2, -this.CB_DISTANCE / 2);
    this.controlBox.transform.baseVal.appendItem(translate);

    this.container.appendChild(this.controlBox);

    this.controlRect = SvgHelper.createRect(
      this.width + this.CB_DISTANCE,
      this.height + this.CB_DISTANCE,
      [
        ['stroke', 'black'],
        ['stroke-width', '1'],
        ['stroke-opacity', '0.5'],
        ['stroke-dasharray', '3, 2'],
        ['fill', 'transparent'],
      ]
    );

    this.controlBox.appendChild(this.controlRect);

    this.rotatorGripLine = SvgHelper.createLine(
      (this.width + this.CB_DISTANCE * 2) / 2,
      this.top - this.CB_DISTANCE,
      (this.width + this.CB_DISTANCE * 2) / 2,
      this.top - this.CB_DISTANCE * 3,
      [
        ['stroke', 'black'],
        ['stroke-width', '1'],
        ['stroke-opacity', '0.5'],
        ['stroke-dasharray', '3, 2'],
      ]
    )

    this.controlBox.appendChild(this.rotatorGripLine);

    this.controlGrips = new RectangularBoxMarkerGrips();
    this.addControlGrips();


    this.controlBox.style.display = 'none';
  }

  private adjustControlBox() {
    const translate = this.controlBox.transform.baseVal.getItem(0);
    translate.setTranslate(this.left - this.CB_DISTANCE / 2, this.top - this.CB_DISTANCE / 2);
    this.controlBox.transform.baseVal.replaceItem(translate, 0);
    this.controlRect.setAttribute("width", (this.width + this.CB_DISTANCE).toString());
    this.controlRect.setAttribute("height", (this.height + this.CB_DISTANCE).toString());
    this.rotatorGripLine.setAttribute("x1", ((this.width + this.CB_DISTANCE) / 2).toString());
    this.rotatorGripLine.setAttribute("y1", (-this.CB_DISTANCE / 2).toString());
    this.rotatorGripLine.setAttribute("x2", ((this.width + this.CB_DISTANCE) / 2).toString());
    this.rotatorGripLine.setAttribute("y2", (-this.CB_DISTANCE * 3).toString());
    this.positionGrips();
  }

  private addControlGrips() {
    this.controlGrips.topLeft = this.createGrip();
    this.controlGrips.topCenter = this.createGrip();
    this.controlGrips.topRight = this.createGrip();
    this.controlGrips.centerLeft = this.createGrip();
    this.controlGrips.centerRight = this.createGrip();
    this.controlGrips.bottomLeft = this.createGrip();
    this.controlGrips.bottomCenter = this.createGrip();
    this.controlGrips.bottomRight = this.createGrip();

    this.rotatorGrip = this.createGrip();

    this.positionGrips();
  }

  private createGrip(): ResizeGrip {
    const grip = new ResizeGrip();
    grip.visual.transform.baseVal.appendItem(SvgHelper.createTransform());
    this.controlBox.appendChild(grip.visual);

    return grip;
  }

  private positionGrips() {
    const gripSize = this.controlGrips.topLeft.GRIP_SIZE;

    const left = -gripSize / 2;
    const top = left;
    const cx = (this.width + this.CB_DISTANCE) / 2 - gripSize / 2;
    const cy = (this.height + this.CB_DISTANCE) / 2 - gripSize / 2;
    const bottom = this.height + this.CB_DISTANCE - gripSize / 2;
    const right = this.width + this.CB_DISTANCE - gripSize / 2;

    this.positionGrip(this.controlGrips.topLeft.visual, left, top);
    this.positionGrip(this.controlGrips.topCenter.visual, cx, top);
    this.positionGrip(this.controlGrips.topRight.visual, right, top);
    this.positionGrip(this.controlGrips.centerLeft.visual, left, cy);
    this.positionGrip(this.controlGrips.centerRight.visual, right, cy);
    this.positionGrip(this.controlGrips.bottomLeft.visual, left, bottom);
    this.positionGrip(this.controlGrips.bottomCenter.visual, cx, bottom);
    this.positionGrip(this.controlGrips.bottomRight.visual, right, bottom);

    this.positionGrip(this.rotatorGrip.visual, cx, top - this.CB_DISTANCE * 3);
  }

  private positionGrip(grip: SVGGraphicsElement, x: number, y: number) {
    const translate = grip.transform.baseVal.getItem(0);
    translate.setTranslate(x, y);
    grip.transform.baseVal.replaceItem(translate, 0);
  }
}
