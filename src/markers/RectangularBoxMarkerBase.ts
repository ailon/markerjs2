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

  protected manipulationStartLeft: number;
  protected manipulationStartTop: number;
  protected manipulationStartWidth: number;
  protected manipulationStartHeight: number;

  protected manipulationStartX: number;
  protected manipulationStartY: number;

  protected offsetX = 0;
  protected offsetY = 0;

  protected visual: SVGGraphicsElement;

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

  public ownsTarget(el: EventTarget): boolean {
    if (super.ownsTarget(el)) {
      return true;
    } else if (
      this.controlGrips.findGripByVisual(el as SVGGraphicsElement) !== undefined ||
      this.rotatorGrip.visual === el
    ) {
      return true;
    } else {
      return false;
    }
  }

  public mouseDown(point: IPoint, target?: EventTarget): void {
    super.mouseDown(point, target);

    this.manipulationStartLeft = this.left;
    this.manipulationStartTop = this.top;
    this.manipulationStartWidth = this.width;
    this.manipulationStartHeight = this.height;

    this.manipulationStartX = point.x;
    this.manipulationStartY = point.y;

    this.offsetX = point.x - this.left;
    this.offsetY = point.y - this.top;

    if (this.state !== 'new') {
      this.select();
      this.activeGrip = this.controlGrips.findGripByVisual(target as SVGGraphicsElement);
      if (this.activeGrip !== undefined) {
        this._state = 'resize';
      } else if (this.rotatorGrip.visual === target) {
        this.activeGrip = this.rotatorGrip;
        this._state = 'rotate';
      } else {
        this._state = 'move';
      }
    } else {
      this.left = point.x;
      this.top = point.y;
    }
  }

  public mouseUp(point: IPoint): void {
    this.manipulate(point);
    this._state = 'select';
    if (this.onMarkerCreated) {
      this.onMarkerCreated(this);
    }
  }

  protected moveVisual(point: IPoint): void {
    const translate = this.visual.transform.baseVal.getItem(0);
    translate.setTranslate(point.x, point.y);
    this.visual.transform.baseVal.replaceItem(translate, 0);
  }

  public manipulate(point: IPoint): void {
    if (this.state === 'creating') {
      if (point.x - this.manipulationStartLeft >= 0) {
        this.width = point.x - this.left;
      } else {
        this.width += Math.round(this.left - point.x);
        this.left =  point.x;
      }
      if (point.y - this.manipulationStartTop >= 0) {
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
    } else if (this.state === 'move') {
      this.left =
        this.manipulationStartLeft +
        (point.x - this.manipulationStartLeft) -
        this.offsetX;
      this.top =
        this.manipulationStartTop +
        (point.y - this.manipulationStartTop) -
        this.offsetY;
      this.moveVisual({x: this.left, y: this.top});
      this.adjustControlBox();
    } else if (this.state === 'resize') {
      this.resize(point);
    }
  }

  private resize(point: IPoint) {
    let newX = this.manipulationStartLeft;
    let newWidth = this.manipulationStartWidth;
    let newY = this.manipulationStartTop;
    let newHeight = this.manipulationStartHeight;

    switch(this.activeGrip) {
      case this.controlGrips.bottomLeft:
      case this.controlGrips.centerLeft:
      case this.controlGrips.topLeft:
        newX = this.manipulationStartLeft + point.x - this.manipulationStartX;
        newWidth = this.manipulationStartWidth + this.manipulationStartLeft - newX;
        break; 
      case this.controlGrips.bottomRight:
      case this.controlGrips.centerRight:
      case this.controlGrips.topRight:
        newWidth = this.manipulationStartWidth + point.x - this.manipulationStartX;
        break; 
    }

    switch(this.activeGrip) {
      case this.controlGrips.topCenter:
      case this.controlGrips.topLeft:
      case this.controlGrips.topRight:
        newY = this.manipulationStartTop + point.y - this.manipulationStartY;
        newHeight = this.manipulationStartHeight + this.manipulationStartTop - newY;
        break; 
      case this.controlGrips.bottomCenter:
      case this.controlGrips.bottomLeft:
      case this.controlGrips.bottomRight:
        newHeight = this.manipulationStartHeight + point.y - this.manipulationStartY;
        break; 
    }

    if (newWidth >= 0) {
      this.left = newX;
      this.width = newWidth;
    } else {
      this.left = newX + newWidth;
      this.width = -newWidth;
    }
    if (newHeight >= 0) {
      this.top = newY;
      this.height = newHeight;
    } else {
      this.top = newY + newHeight;
      this.height = -newHeight;
    }

    this.moveVisual({x: this.left, y: this.top});
    SvgHelper.setAttributes(this.visual, [
      ['width', this.width.toString()],
      ['height', this.height.toString()]
    ])

    this.adjustControlBox();
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
        ['pointer-events', 'none']
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
    );

    this.controlBox.appendChild(this.rotatorGripLine);

    this.controlGrips = new RectangularBoxMarkerGrips();
    this.addControlGrips();

    this.controlBox.style.display = 'none';
  }

  private adjustControlBox() {
    const translate = this.controlBox.transform.baseVal.getItem(0);
    translate.setTranslate(
      this.left - this.CB_DISTANCE / 2,
      this.top - this.CB_DISTANCE / 2
    );
    this.controlBox.transform.baseVal.replaceItem(translate, 0);
    this.controlRect.setAttribute(
      'width',
      (this.width + this.CB_DISTANCE).toString()
    );
    this.controlRect.setAttribute(
      'height',
      (this.height + this.CB_DISTANCE).toString()
    );
    this.rotatorGripLine.setAttribute(
      'x1',
      ((this.width + this.CB_DISTANCE) / 2).toString()
    );
    this.rotatorGripLine.setAttribute('y1', (-this.CB_DISTANCE / 2).toString());
    this.rotatorGripLine.setAttribute(
      'x2',
      ((this.width + this.CB_DISTANCE) / 2).toString()
    );
    this.rotatorGripLine.setAttribute('y2', (-this.CB_DISTANCE * 3).toString());
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
