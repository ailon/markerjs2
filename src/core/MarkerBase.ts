import { IPoint } from '../MarkerArea';
import { ToolboxPanel } from '../ui/ToolboxPanel';
import { MarkerBaseState } from './MarkerBaseState';
import { Settings } from './Settings';

export type MarkerState = 'new' | 'creating' | 'select' | 'move' | 'resize' | 'rotate';

export class MarkerBase {
  public static typeName = 'MarkerBase';

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
    this.container.style.cursor = 'move';
  }
  public deselect(): void {
    this.container.style.cursor = 'default';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public pointerDown(point: IPoint, target?: EventTarget):void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public dblClick(point: IPoint, target?: EventTarget):void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public manipulate(point: IPoint):void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  public pointerUp(point: IPoint):void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public dispose(): void {}

  protected addMarkerVisualToContainer(element: SVGElement): void {
    if (this.container.childNodes.length > 0) {
      this.container.insertBefore(element, this.container.childNodes[0]);
    } else {
      this.container.appendChild(element);
    }
  }

  public getState(): MarkerBaseState {
    return { 
      typeName: MarkerBase.typeName, 
      state: this.state 
    };
  }

  public restoreState(state: MarkerBaseState): void {
    this._state = state.state;
  }
}