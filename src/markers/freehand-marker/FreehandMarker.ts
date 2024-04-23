import { IPoint } from '../../core/IPoint';
import { SvgHelper } from '../../core/SvgHelper';
import { RectangularBoxMarkerBase } from '../RectangularBoxMarkerBase';
import { Settings } from '../../core/Settings';
import Icon from './freehand-marker-icon.svg';
import { ColorPickerPanel } from '../../ui/toolbox-panels/ColorPickerPanel';
import { ToolboxPanel } from '../../ui/ToolboxPanel';
import { FreehandMarkerState } from './FreehandMarkerState';
import { MarkerBaseState } from '../../core/MarkerBaseState';
import { LineWidthPanel } from '../../ui/toolbox-panels/LineWidthPanel';

export class FreehandMarker extends RectangularBoxMarkerBase {
  /**
   * String type name of the marker type.
   *
   * Used when adding {@link MarkerArea.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'FreehandMarker';

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Freehand marker';
  /**
   * SVG icon markup displayed on toolbar buttons.
   */
  public static icon = Icon;

  /**
   * Marker color.
   */
  protected color = 'transparent';
  /**
   * Marker's stroke width.
   */
  protected lineWidth = 3;

  private colorPanel: ColorPickerPanel;
  private lineWidthPanel: LineWidthPanel;

  private canvasElement: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;

  private drawingImage: SVGImageElement;
  private drawingImgUrl: string;

  private drawing = false;

  private pixelRatio = 1;

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   * @param overlayContainer - overlay HTML container to hold additional overlay elements while editing.
   * @param settings - settings object containing default markers settings.
   */
  constructor(
    container: SVGGElement,
    overlayContainer: HTMLDivElement,
    settings: Settings
  ) {
    super(container, overlayContainer, settings);

    this.color = settings.defaultColor;
    this.lineWidth = settings.defaultStrokeWidth;
    this.pixelRatio = settings.freehandPixelRatio;

    this.setColor = this.setColor.bind(this);
    this.addCanvas = this.addCanvas.bind(this);
    this.finishCreation = this.finishCreation.bind(this);
    this.setLineWidth = this.setLineWidth.bind(this);

    this.colorPanel = new ColorPickerPanel(
      'Color',
      settings.defaultColorSet,
      settings.defaultColor
    );
    this.colorPanel.onColorChanged = this.setColor;

    this.lineWidthPanel = new LineWidthPanel(
      'Line width',
      settings.defaultStrokeWidths,
      settings.defaultStrokeWidth
    );
    this.lineWidthPanel.onWidthChanged = this.setLineWidth;
  }

  /**
   * Returns true if passed SVG element belongs to the marker. False otherwise.
   *
   * @param el - target element.
   */
  public ownsTarget(el: EventTarget): boolean {
    if (
      super.ownsTarget(el) ||
      el === this.visual ||
      el === this.drawingImage
    ) {
      return true;
    } else {
      return false;
    }
  }

  private createVisual() {
    this.visual = SvgHelper.createGroup();
    this.drawingImage = SvgHelper.createImage();
    this.visual.appendChild(this.drawingImage);

    const translate = SvgHelper.createTransform();
    this.visual.transform.baseVal.appendItem(translate);
    this.addMarkerVisualToContainer(this.visual);
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) down event.
   *
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  public pointerDown(point: IPoint, target?: EventTarget): void {
    if (this.state === 'new') {
      this.addCanvas();

      this.createVisual();

      this._state = 'creating';
    }

    if (this.state === 'creating') {
      this.canvasContext.strokeStyle = this.color;
      this.canvasContext.lineWidth = this.lineWidth;
      this.canvasContext.beginPath();
      this.canvasContext.moveTo(point.x, point.y);
      this.drawing = true;
    } else {
      super.pointerDown(point, target);
    }
  }

  /**
   * Handles marker manipulation (move, resize, rotate, etc.).
   *
   * @param point - event coordinates.
   */
  public manipulate(point: IPoint): void {
    if (this.state === 'creating') {
      if (this.drawing) {
        this.canvasContext.lineTo(point.x, point.y);
        this.canvasContext.stroke();
      }
    } else {
      super.manipulate(point);
    }
  }

  /**
   * Resize marker based on current pointer coordinates and context.
   * @param point
   */
  protected resize(point: IPoint): void {
    super.resize(point);
    SvgHelper.setAttributes(this.visual, [
      ['width', this.width.toString()],
      ['height', this.height.toString()]
    ]);
    SvgHelper.setAttributes(this.drawingImage, [
      ['width', this.width.toString()],
      ['height', this.height.toString()]
    ]);
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) up event.
   *
   * @param point - event coordinates.
   */
  public pointerUp(point: IPoint): void {
    if (this._state === 'creating') {
      if (this.drawing) {
        this.canvasContext.closePath();
        this.drawing = false;
        if (this.globalSettings.newFreehandMarkerOnPointerUp) {
          this.finishCreation();
        }
      }
    } else {
      super.pointerUp(point);
    }
  }

  private addCanvas() {
    this.overlayContainer.innerHTML = '';

    this.canvasElement = document.createElement('canvas');
    this.canvasElement.width =
      this.overlayContainer.clientWidth * this.pixelRatio;
    this.canvasElement.height =
      this.overlayContainer.clientHeight * this.pixelRatio;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.canvasContext.scale(this.pixelRatio, this.pixelRatio);
    this.overlayContainer.appendChild(this.canvasElement);
  }

  /**
   * Selects this marker and displays appropriate selected marker UI.
   */
  public select(): void {
    if (this.state === 'creating') {
      this.finishCreation();
    }
    super.select();
  }

  /**
   * Deselects this marker and hides selected marker UI.
   */
  public deselect(): void {
    if (this.state === 'creating') {
      this.finishCreation();
    }
    super.deselect();
  }

  private finishCreation() {
    const imgData = this.canvasContext.getImageData(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );

    let [startX, startY, endX, endY] = [
      this.canvasElement.width + 1,
      this.canvasElement.height + 1,
      -1,
      -1
    ];
    let containsData = false;
    for (let row = 0; row < this.canvasElement.height; row++) {
      for (let col = 0; col < this.canvasElement.width; col++) {
        const pixAlpha =
          imgData.data[row * this.canvasElement.width * 4 + col * 4 + 3];
        if (pixAlpha > 0) {
          containsData = true;
          if (row < startY) {
            startY = row;
          }
          if (col < startX) {
            startX = col;
          }
          if (row > endY) {
            endY = row;
          }
          if (col > endX) {
            endX = col;
          }
        }
      }
    }

    if (containsData) {
      this.left = startX / this.pixelRatio;
      this.top = startY / this.pixelRatio;
      this.width = (endX - startX) / this.pixelRatio;
      this.height = (endY - startY) / this.pixelRatio;

      const tmpCanvas = document.createElement('canvas');
      tmpCanvas.width = endX - startX;
      tmpCanvas.height = endY - startY;
      const tmpCtx = tmpCanvas.getContext('2d');
      tmpCtx.putImageData(
        this.canvasContext.getImageData(
          startX,
          startY,
          endX - startX,
          endY - startY
        ),
        0,
        0
      );

      this.drawingImgUrl = tmpCanvas.toDataURL('image/png');
      this.setDrawingImage();

      this._state = 'select';
      if (this.onMarkerCreated) {
        this.onMarkerCreated(this);
      }
    }
    this.overlayContainer.innerHTML = '';
  }

  private setDrawingImage() {
    SvgHelper.setAttributes(this.drawingImage, [
      ['width', this.width.toString()],
      ['height', this.height.toString()]
    ]);
    SvgHelper.setAttributes(this.drawingImage, [['href', this.drawingImgUrl]]);
    this.moveVisual({ x: this.left, y: this.top });
  }

  /**
   * Sets marker drawing color.
   * @param color - new color.
   */
  protected setColor(color: string): void {
    this.color = color;
    this.colorChanged(color);
  }

  /**
   * Sets line width.
   * @param width - new line width
   */
  protected setLineWidth(width: number): void {
    this.lineWidth = width;
  }

  /**
   * Returns the list of toolbox panels for this marker type.
   */
  public get toolboxPanels(): ToolboxPanel[] {
    if (this.state === 'new' || this.state === 'creating') {
      return [this.colorPanel, this.lineWidthPanel];
    } else {
      return [];
    }
  }

  /**
   * Returns current marker state that can be restored in the future.
   */
  public getState(): FreehandMarkerState {
    const result: FreehandMarkerState = Object.assign(
      {
        drawingImgUrl: this.drawingImgUrl
      },
      super.getState()
    );
    result.typeName = FreehandMarker.typeName;

    return result;
  }

  /**
   * Restores previously saved marker state.
   *
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    this.createVisual();
    super.restoreState(state);
    this.drawingImgUrl = (state as FreehandMarkerState).drawingImgUrl;
    this.setDrawingImage();
  }

  /**
   * Scales marker. Used after the image resize.
   *
   * @param scaleX - horizontal scale
   * @param scaleY - vertical scale
   */
  public scale(scaleX: number, scaleY: number): void {
    super.scale(scaleX, scaleY);

    this.setDrawingImage();
  }
}
