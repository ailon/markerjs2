import { IPoint } from '../../MarkerArea';
import { SvgHelper } from '../../core/SvgHelper';
import { RectangularBoxMarkerBase } from '../RectangularBoxMarkerBase';
import { Settings } from '../../core/Settings';
import Icon from './freehand-marker-icon.svg';
import { ColorPickerPanel } from '../../ui/toolbox-panels/ColorPickerPanel';
import { ToolboxPanel } from '../../ui/ToolboxPanel';


export class FreehandMarker extends RectangularBoxMarkerBase {
  public static title = 'Freehand marker';
  public static icon = Icon;

  protected color = 'transparent';
  protected lineWidth = 3;

  private colorPanel: ColorPickerPanel;

  private canvasElement: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;

  private drawingImage: SVGImageElement;

  private drawing = false;

  constructor(container: SVGGElement, overlayContainer: HTMLDivElement, settings: Settings) {
    super(container, overlayContainer, settings);

    this.color = settings.defaultColor;

    this.setColor = this.setColor.bind(this);
    this.addCanvas = this.addCanvas.bind(this);

    this.colorPanel = new ColorPickerPanel(
      'Color',
      settings.defaultColorSet,
      settings.defaultColor
    );
    this.colorPanel.onColorChanged = this.setColor;
  }

  public ownsTarget(el: EventTarget): boolean {
    if (super.ownsTarget(el) || el === this.visual || el === this.drawingImage) {
      return true;
    } else {
      return false;
    }
  }

  public pointerDown(point: IPoint, target?: EventTarget): void {
    if (this.state === 'new') {
      this.addCanvas();

      this.visual = SvgHelper.createGroup();
      this.drawingImage = SvgHelper.createImage();
      this.visual.appendChild(this.drawingImage);

      const translate = SvgHelper.createTransform();
      this.visual.transform.baseVal.appendItem(translate);
      this.addMarkerVisualToContainer(this.visual);

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

  protected resize(point: IPoint): void {
    super.resize(point);
    SvgHelper.setAttributes(this.visual, [
      ['width', this.width.toString()],
      ['height', this.height.toString()],
    ]);
    SvgHelper.setAttributes(this.drawingImage, [
      ['width', this.width.toString()],
      ['height', this.height.toString()],
    ]);
  }

  public pointerUp(point: IPoint): void {
    if (this._state === 'creating') {
      if (this.drawing) {
        this.canvasContext.closePath();
        this.drawing = false;
      }
    } else {
      super.pointerUp(point);
    }
  }

  private addCanvas() {
    this.overlayContainer.innerHTML = '';

    this.canvasElement = document.createElement('canvas');
    this.canvasElement.width = this.overlayContainer.clientWidth;
    this.canvasElement.height = this.overlayContainer.clientHeight;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.overlayContainer.appendChild(this.canvasElement);
  }

  public select(): void {
    if (this.state === 'creating') {
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
        -1,
      ];
      let containsData = false;
      for(let row = 0; row < this.canvasElement.height; row++) {
        for (let col = 0; col < this.canvasElement.width; col++) {
          const pixAlpha = imgData.data[row * this.canvasElement.width * 4 + col * 4 + 3];
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
        this.left = startX;
        this.top = startY;
        this.width = endX - startX;
        this.height = endY - startY;

        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = this.width;
        tmpCanvas.height = this.height;
        const tmpCtx = tmpCanvas.getContext('2d');
        tmpCtx.putImageData(this.canvasContext.getImageData(startX, startY, endX - startX, endY - startY), 0, 0);

        const drawingImgUrl = tmpCanvas.toDataURL('image/png');

        SvgHelper.setAttributes(this.drawingImage, [
          ['width', this.width.toString()],
          ['height', this.height.toString()],
        ]);
        SvgHelper.setAttributes(this.drawingImage, [['href', drawingImgUrl]]);
        this.moveVisual({x: this.left, y: this.top});

        this._state = 'select';
        if (this.onMarkerCreated) {
          this.onMarkerCreated(this);
        }
      }
      this.overlayContainer.innerHTML = '';
    }
    super.select();
  }

  protected setColor(color: string): void {
    this.color = color;
  }

  public get toolboxPanels(): ToolboxPanel[] {
    if (this.state === 'new' || this.state === 'creating') {
      return [this.colorPanel];
    } else {
      return [];
    }
  }
}
