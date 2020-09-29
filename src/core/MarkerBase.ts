import { IPoint } from '../MarkerArea';
import { ToolboxPanel } from '../ui/ToolboxPanel';

export type MarkerState = 'new' | 'creating' | 'created';

export class MarkerBase {
  protected _container: SVGGElement;
  public get container(): SVGGElement {
    return this._container;
  }
  protected _state: MarkerState = 'new';
  public get state(): MarkerState {
    return this._state;
  }
  protected _name = 'base';
  public get name(): string {
    return this._name;
  }

  public get toolboxPanels(): ToolboxPanel[] {
    return [];
  }

  public static title: string;
  /**
   * SVG icon markup
   */
  public static icon: string;

  public onMarkerCreated: (marker: MarkerBase) => void;

  constructor(container: SVGGElement) {
    this._container = container;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public ownsTarget(el: EventTarget): boolean {
    return false;
  }

  public select(): void {
    console.log('todo: marker.select();')
  }
  public deselect(): void {
    console.log('todo: marker.deselect();')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public mouseDown(point: IPoint, target?: EventTarget):void {
    console.log(point.x, point.y);
  }

  public manipulate(point: IPoint):void {
    console.log(point.x, point.y);
  }

  public mouseUp(point: IPoint):void {
    console.log(point.x, point.y);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public dispose(): void {}
}