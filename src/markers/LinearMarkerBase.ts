import { MarkerBase } from '../core/MarkerBase';

import { IPoint } from '../core/IPoint';
import { SvgHelper } from '../core/SvgHelper';

import { ResizeGrip } from './ResizeGrip';
import { Settings } from '../core/Settings';
import { LinearMarkerBaseState } from './LinearMarkerBaseState';
import { MarkerBaseState } from '../core/MarkerBaseState';

export class LinearMarkerBase extends MarkerBase {
  protected x1 = 0;
  protected y1 = 0;
  protected x2 = 0;
  protected y2 = 0;

  protected defaultLength = 50;

  protected manipulationStartX = 0;
  protected manipulationStartY = 0;

  protected manipulationStartX1 = 0;
  protected manipulationStartY1 = 0;
  protected manipulationStartX2 = 0;
  protected manipulationStartY2 = 0;

  protected visual: SVGGraphicsElement;

  private controlBox: SVGGElement;

  private grip1: ResizeGrip;
  private grip2: ResizeGrip;
  private activeGrip: ResizeGrip;

  protected markerElement: SVGGElement;

  constructor(container: SVGGElement, overlayContainer: HTMLDivElement, settings: Settings) {
    super(container, overlayContainer, settings);

    this.setupControlBox();
  }

  public ownsTarget(el: EventTarget): boolean {
    if (super.ownsTarget(el)) {
      return true;
    } else if (
      this.grip1.ownsTarget(el) || this.grip2.ownsTarget(el)
    ) {
      return true;
    } else {
      return false;
    }
  }

  public pointerDown(point: IPoint, target?: EventTarget): void {
    super.pointerDown(point, target);

    this.manipulationStartX = point.x;
    this.manipulationStartY = point.y;

    if (this.state === 'new') {
      this.x1 = point.x;
      this.y1 = point.y;
      this.x2 = point.x;
      this.y2 = point.y;
    }

    this.manipulationStartX1 = this.x1;
    this.manipulationStartY1 = this.y1;
    this.manipulationStartX2 = this.x2;
    this.manipulationStartY2 = this.y2;

    if (this.state !== 'new') {
      this.select();
      if (this.grip1.ownsTarget(target)) {
        this.activeGrip = this.grip1;
      } else if (this.grip2.ownsTarget(target)) {
        this.activeGrip = this.grip2;
      } else {
        this.activeGrip = undefined;
      }

      if (this.activeGrip) {
        this._state = 'resize';
      } else {
        this._state = 'move';
      }
    }
  }

  public pointerUp(point: IPoint): void {
    const inState = this.state;
    super.pointerUp(point);
    if (this.state === 'creating' && Math.abs(this.x1 - this.x2) < 10 && Math.abs(this.y1 - this.y2) < 10) {
      this.x2 = this.x1 + this.defaultLength;
      this.adjustVisual();
      this.adjustControlBox()
    } else {
      this.manipulate(point);
    }
    this._state = 'select';
    if (inState === 'creating' && this.onMarkerCreated) {
      this.onMarkerCreated(this);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected adjustVisual(): void {}

  public manipulate(point: IPoint): void {
    if (this.state === 'creating') {
      this.resize(point);
    } else if (this.state === 'move') {
      this.x1 = this.manipulationStartX1 + point.x - this.manipulationStartX;
      this.y1 = this.manipulationStartY1 + point.y - this.manipulationStartY;
      this.x2 = this.manipulationStartX2 + point.x - this.manipulationStartX;
      this.y2 = this.manipulationStartY2 + point.y - this.manipulationStartY;
      this.adjustVisual();
      this.adjustControlBox();
    } else if (this.state === 'resize') {
      this.resize(point);
    }
  }

  protected resize(point: IPoint): void {
    switch(this.activeGrip) {
      case this.grip1:
        this.x1 = point.x;
        this.y1 = point.y;
        break; 
      case this.grip2:
      case undefined:
        this.x2 = point.x;
        this.y2 = point.y;
        break; 
    }
    this.adjustVisual();
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
    this.container.appendChild(this.controlBox);

    this.addControlGrips();

    this.controlBox.style.display = 'none';
  }

  private adjustControlBox() {
    this.positionGrips();
  }

  private addControlGrips() {
    this.grip1 = this.createGrip();
    this.grip2 = this.createGrip();

    this.positionGrips();
  }

  private createGrip(): ResizeGrip {
    const grip = new ResizeGrip();
    grip.visual.transform.baseVal.appendItem(SvgHelper.createTransform());
    this.controlBox.appendChild(grip.visual);

    return grip;
  }

  private positionGrips() {
    const gripSize = this.grip1.GRIP_SIZE;

    this.positionGrip(this.grip1.visual, this.x1 - gripSize / 2, this.y1 - gripSize / 2);
    this.positionGrip(this.grip2.visual, this.x2 - gripSize / 2, this.y2 - gripSize / 2);
  }

  private positionGrip(grip: SVGGraphicsElement, x: number, y: number) {
    const translate = grip.transform.baseVal.getItem(0);
    translate.setTranslate(x, y);
    grip.transform.baseVal.replaceItem(translate, 0);
  }

  public getState(): LinearMarkerBaseState {
    const result: LinearMarkerBaseState = Object.assign({
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2
    }, super.getState());

    return result;
  }

  public restoreState(state: MarkerBaseState): void {
    super.restoreState(state);
    const lmbState = state as LinearMarkerBaseState;
    this.x1 = lmbState.x1;
    this.y1 = lmbState.y1;
    this.x2 = lmbState.x2;
    this.y2 = lmbState.y2;
  }
}
