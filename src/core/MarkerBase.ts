import { IPoint } from '../MarkerArea';
import { ToolboxPanel } from '../ui/ToolboxPanel';
import { Settings } from './Settings';

export type MarkerState = 'new' | 'creating' | 'select' | 'move' | 'resize' | 'rotate';

export class MarkerBase {
  protected _container: SVGGElement;
  public get container(): SVGGElement {
    return this._container;
  }
  protected _overlayContainer: HTMLDivElement;
  public get overlayContainer(): HTMLDivElement {
    return this._overlayContainer;
  }
  protected _state: MarkerState = 'new';
  public get state(): MarkerState {
    return this._state;
  }
  protected _name = 'base';
  public get name(): string {
    return this._name;
  }

  protected globalSettings: Settings;

  public get toolboxPanels(): ToolboxPanel[] {
    return [];
  }

  public static title: string;
  /**
   * SVG icon markup
   */
  public static icon: string;

  public onMarkerCreated: (marker: MarkerBase) => void;

  constructor(container: SVGGElement, overlayContainer: HTMLDivElement, settings: Settings) {
    this._container = container;
    this._overlayContainer = overlayContainer;
    this.globalSettings = settings;
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
  public pointerDown(point: IPoint, target?: EventTarget):void {
    console.log(point.x, point.y);
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public dblClick(point: IPoint, target?: EventTarget):void {}
  /* eslint-enable @typescript-eslint/no-unused-vars */

  public manipulate(point: IPoint):void {
    console.log(point.x, point.y);
  }

  public pointerUp(point: IPoint):void {
    console.log(point.x, point.y);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public dispose(): void {}

  protected addMarkerVisualToContainer(element: SVGElement): void {
    if (this.container.childNodes.length > 0) {
      this.container.insertBefore(element, this.container.childNodes[0]);
    } else {
      this.container.appendChild(element);
    }
  }
}