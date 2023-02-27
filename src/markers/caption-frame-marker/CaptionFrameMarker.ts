import Icon from './caption-frame-marker-icon.svg';
import { IPoint } from '../../core/IPoint';
import { SvgHelper } from '../../core/SvgHelper';
import { RectangularBoxMarkerBase } from '../RectangularBoxMarkerBase';
import { Settings } from '../../core/Settings';
import { RectangleMarkerState } from '../RectangleMarkerState';
import { MarkerBaseState } from '../../core/MarkerBaseState';
import { ColorPickerPanel } from '../../ui/toolbox-panels/ColorPickerPanel';
import { LineWidthPanel } from '../../ui/toolbox-panels/LineWidthPanel';
import { LineStylePanel } from '../../ui/toolbox-panels/LineStylePanel';
import { ToolboxPanel } from '../../ui/ToolboxPanel';
import FillColorIcon from '../../ui/toolbox-panels/fill-color-icon.svg';

export class CaptionFrameMarker extends RectangularBoxMarkerBase {
  /**
   * String type name of the marker type. 
   * 
   * Used when adding {@link MarkerArea.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'CaptionFrameMarker';
  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Caption frame marker';
  /**
   * SVG icon markup displayed on toolbar buttons.
   */
  public static icon = Icon;

  /**
   * Ellipse fill color.
   */
  protected fillColor = 'transparent';
  /**
   * Ellipse border color.
   */
  protected strokeColor = 'transparent';
  /**
   * Ellipse border line width.
   */
  protected strokeWidth = 0;
  /**
   * Ellipse border dash array.
   */
  protected strokeDasharray = '';


  protected textColor = 'transparent';

  protected strokePanel: ColorPickerPanel;
  protected fillPanel: ColorPickerPanel;
  protected strokeWidthPanel: LineWidthPanel;
  protected strokeStylePanel: LineStylePanel;

  protected isMoved = false;
  private pointerDownPoint: IPoint;
  private pointerDownTimestamp: number;

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   * @param overlayContainer - overlay HTML container to hold additional overlay elements while editing.
   * @param settings - settings object containing default markers settings.
   */
  constructor(container: SVGGElement, overlayContainer: HTMLDivElement, settings: Settings) {
    super(container, overlayContainer, settings);

    this.strokeColor = settings.defaultColor;
    this.strokeWidth = settings.defaultStrokeWidth;
    this.strokeDasharray = settings.defaultStrokeDasharray;
    this.fillColor = settings.defaultFillColor;
    this.textColor = settings.defaultStrokeColor;

    this.setStrokeColor = this.setStrokeColor.bind(this);
    this.setFillColor = this.setFillColor.bind(this);
    this.setStrokeWidth = this.setStrokeWidth.bind(this);
    this.setStrokeDasharray = this.setStrokeDasharray.bind(this);
    this.createVisual = this.createVisual.bind(this);
    this.sizeLabel = this.sizeLabel.bind(this);
    this.setLabelText = this.setLabelText.bind(this);
    this.showTextEditor = this.showTextEditor.bind(this);
    this.positionTextEditor = this.positionTextEditor.bind(this);
    this.finishTextEditing = this.finishTextEditing.bind(this);

    this.strokePanel = new ColorPickerPanel(
      'Line color',
      [...settings.defaultColorSet, 'transparent'],
      this.strokeColor
    );
    this.strokePanel.onColorChanged = this.setStrokeColor;

    this.fillPanel = new ColorPickerPanel(
      'Fill color',
      [...settings.defaultColorSet, 'transparent'],
      this.fillColor,
      FillColorIcon
    );
    this.fillPanel.onColorChanged = this.setFillColor;

    this.strokeWidthPanel = new LineWidthPanel(
      'Line width',
      settings.defaultStrokeWidths,
      settings.defaultStrokeWidth
    );
    this.strokeWidthPanel.onWidthChanged = this.setStrokeWidth;

    this.strokeStylePanel = new LineStylePanel(
      'Line style',
      settings.defaultStrokeDasharrays,
      settings.defaultStrokeDasharray
    );
    this.strokeStylePanel.onStyleChanged = this.setStrokeDasharray;
  }

  /**
   * Returns true if passed SVG element belongs to the marker. False otherwise.
   * 
   * @param el - target element.
   */
  public ownsTarget(el: EventTarget): boolean {
    if (super.ownsTarget(el) || el === this.visual || el === this.frame || el === this.labelBg) {
      return true;
    } else {
      return false;
    }
  }

  protected frame: SVGRectElement;
  protected labelBg: SVGRectElement;
  protected labelElement!: SVGTextElement;
  protected labelText = 'Label';



  /**
   * Creates marker visual.
   */
  protected createVisual(): void {
    this.visual = SvgHelper.createGroup();
    this.addMarkerVisualToContainer(this.visual);

    this.labelBg = SvgHelper.createRect(100, 30, [
      ['fill', this.fillColor],
    ]);
    this.visual.appendChild(this.labelBg);

    this.labelElement = SvgHelper.createText([['fill', this.textColor]]);
    this.labelElement.style.fontSize = '1rem';
    this.labelElement.style.textAnchor = 'start';
    this.labelElement.style.dominantBaseline = 'text-before-edge';
    this.labelElement.textContent = this.labelText;
    this.visual.appendChild(this.labelElement);

    this.frame = SvgHelper.createRect(this.width, this.height, [
      ['fill', 'transparent'],
      ['stroke', this.strokeColor],
      ['stroke-width', this.strokeWidth.toString()],
      ['stroke-dasharray', this.strokeDasharray],
    ]);

    this.visual.appendChild(this.frame);
  }

  public setLabelText(text: string): void {
    this.labelText = text;
    this.labelElement.textContent = this.labelText;
    this.sizeLabel();
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) down event.
   * 
   * @param point - event coordinates.
   * @param target - direct event target element.
   */
  public pointerDown(point: IPoint, target?: EventTarget): void {
    super.pointerDown(point, target);

    this.isMoved = false;
    this.pointerDownPoint = point;
    this.pointerDownTimestamp = Date.now();

    if (this.state === 'new') {
      this.createVisual();

      this.moveVisual(point);

      this._state = 'creating';
    }
  }

  /**
   * Handles marker manipulation (move, resize, rotate, etc.).
   * 
   * @param point - event coordinates.
   */
  public manipulate(point: IPoint): void {
    super.manipulate(point);
    if (this.pointerDownPoint !== undefined) {
      this.isMoved =
        Math.abs(point.x - this.pointerDownPoint.x) > 5 ||
        Math.abs(point.y - this.pointerDownPoint.y) > 5;
    }
  }

  /**
   * Resize marker based on current pointer coordinates and context.
   * @param point 
   */
  protected resize(point: IPoint): void {
    super.resize(point);
    this.setSize();
  }
  
  private readonly PADDING = 5;
  private labelBoxWidth = 0;
  private labelBoxHeight = 0;
  protected sizeLabel(): void {
    const textBBox = this.labelElement.getBBox();
    this.labelBoxWidth = textBBox.width + this.PADDING * 2;
    this.labelBoxHeight = textBBox.height + this.PADDING * 2;
    SvgHelper.setAttributes(this.labelBg, [
      ['width', this.labelBoxWidth.toString()],
      ['height', this.labelBoxHeight.toString()],
      ['clip-path', `path('M0,0 H${this.width} V${this.height} H${-this.width} Z')`]
    ]);
    SvgHelper.setAttributes(this.labelElement, [
      ['x', this.PADDING.toString()],
      ['y', this.PADDING.toString()],
      ['clip-path', `path('M0,0 H${this.width-this.PADDING} V${this.height} H${-this.width-this.PADDING} Z')`]
    ]);
  }

  private textEditDiv: HTMLDivElement
  private textEditBox: HTMLInputElement;

  private showTextEditor() {
    this._state = 'edit';
    this.overlayContainer.innerHTML = '';

    this.textEditDiv = document.createElement('div');
    this.textEditDiv.style.flexGrow = '2';
    this.textEditDiv.style.alignItems = 'center';
    this.textEditDiv.style.justifyContent = 'center';
    this.textEditDiv.style.pointerEvents = 'auto';
    this.textEditDiv.style.overflow = 'hidden';    

    this.textEditBox = document.createElement('input');
    this.textEditBox.style.position = 'absolute';
    this.textEditBox.style.width = `${this.width}px`;
    this.textEditBox.style.height = `${this.labelBoxHeight}px`;
    this.textEditBox.style.fontSize = `1rem`;
    this.textEditBox.setAttribute('value', this.labelText);

    this.textEditDiv.appendChild(this.textEditBox);
    this.overlayContainer.appendChild(this.textEditDiv);

    this.textEditBox.addEventListener('pointerup', (ev) => {
      ev.stopPropagation();
    });
    this.textEditBox.addEventListener('keypress', (ev) => {
      if (ev.key === 'Enter') {
        this.finishTextEditing(this.textEditBox.value);
      }
    });
    this.textEditDiv.addEventListener('pointerup', () => {
      this.finishTextEditing(this.textEditBox.value);
    });    

    this.positionTextEditor();
    this.textEditBox.focus();
  }

  private positionTextEditor() {
    if (this.state === 'edit') {
      if (this.textEditBox === undefined) {
        this.showTextEditor();
      } else {
        this.textEditBox.style.left = `${this.left}px`;
        this.textEditBox.style.top = `${this.top}px`;
        this.textEditBox.style.transform = `rotate(${this.rotationAngle}deg)`;
        this.textEditBox.style.transformOrigin = `${this.width / 2}px ${this.height / 2}px`;
      }
    }
  }

  private finishTextEditing(text: string) {
    this.setLabelText(text.trim());
    this.overlayContainer.innerHTML = '';
    this.stateChanged();
  }

  /**
   * Sets marker's visual size after manipulation.
   */
  protected setSize(): void {
    super.setSize();
    SvgHelper.setAttributes(this.frame, [
      ['width', this.width.toString()],
      ['height', this.height.toString()],
    ]);
    this.sizeLabel();
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) up event.
   * 
   * @param point - event coordinates.
   */
  public pointerUp(point: IPoint): void {
    super.pointerUp(point);
    this.setSize();

    if ((!this.isMoved && Date.now() - this.pointerDownTimestamp > 500)) {
      // this.showTextEditor();
      this.setLabelText('Longer label');
    }
    this.pointerDownPoint = undefined;

  }

  /**
   * Opens text editor on double-click.
   * @param point
   * @param target
   */
  public dblClick(point: IPoint, target?: EventTarget): void {
    super.dblClick(point, target);

    this.showTextEditor();
    // this.setLabelText('dbl Longer label');
  }


  /**
   * Sets marker's line color.
   * @param color - new line color.
   */
  protected setStrokeColor(color: string): void {
    this.strokeColor = color;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke', this.strokeColor]]);
    }
    this.colorChanged(color);
    this.stateChanged();
  }
  /**
   * Sets marker's fill (background) color.
   * @param color - new fill color.
   */
  protected setFillColor(color: string): void {
    this.fillColor = color;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['fill', this.fillColor]]);
    }
    this.fillColorChanged(color);
    this.stateChanged();
  }
  /**
   * Sets marker's line width.
   * @param width - new line width
   */
  protected setStrokeWidth(width: number): void {
    this.strokeWidth = width;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke-width', this.strokeWidth.toString()]]);
    }
    this.stateChanged();
  }
  /**
   * Sets marker's border dash array.
   * @param dashes - new dash array.
   */
  protected setStrokeDasharray(dashes: string): void {
    this.strokeDasharray = dashes;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['stroke-dasharray', this.strokeDasharray]]);
    }
    this.stateChanged();
  }

  /**
   * Returns the list of toolbox panels for this marker type.
   */
  public get toolboxPanels(): ToolboxPanel[] {
    return [this.strokePanel, this.fillPanel, this.strokeWidthPanel, this.strokeStylePanel];
  }

  /**
   * Returns current marker state that can be restored in the future.
   */
  public getState(): RectangleMarkerState {
    const result: RectangleMarkerState = Object.assign({
      fillColor: this.fillColor,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      strokeDasharray: this.strokeDasharray,
      opacity: 1
    }, super.getState());
    result.typeName = this.typeName;

    return result;
  }

  /**
   * Restores previously saved marker state.
   * 
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    const rectState = state as RectangleMarkerState;
    this.fillColor = rectState.fillColor;
    this.strokeColor = rectState.strokeColor;
    this.strokeWidth = rectState.strokeWidth;
    this.strokeDasharray = rectState.strokeDasharray;

    this.createVisual();
    super.restoreState(state);
    this.setSize();
  }

  /**
   * Scales marker. Used after the image resize.
   * 
   * @param scaleX - horizontal scale
   * @param scaleY - vertical scale
   */
  public scale(scaleX: number, scaleY: number): void {
    super.scale(scaleX, scaleY);

    this.setSize();
  }
}
