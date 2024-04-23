import Icon from './caption-frame-marker-icon.svg';
import { IPoint } from '../../core/IPoint';
import { SvgHelper } from '../../core/SvgHelper';
import { RectangularBoxMarkerBase } from '../RectangularBoxMarkerBase';
import { Settings } from '../../core/Settings';
import { MarkerBaseState } from '../../core/MarkerBaseState';
import { ColorPickerPanel } from '../../ui/toolbox-panels/ColorPickerPanel';
import { LineWidthPanel } from '../../ui/toolbox-panels/LineWidthPanel';
import { LineStylePanel } from '../../ui/toolbox-panels/LineStylePanel';
import { ToolboxPanel } from '../../ui/ToolboxPanel';
import FillColorIcon from '../../ui/toolbox-panels/fill-color-icon.svg';
import TextColorIcon from '../../ui/toolbox-panels/text-color-icon.svg';
import { FontFamilyPanel } from '../../ui/toolbox-panels/FontFamilyPanel';
import { CaptionFrameMarkerState } from './CaptionFrameMarkerState';

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
   * Caption background (fill) color.
   */
  protected fillColor = 'transparent';
  /**
   * Frame border color.
   */
  protected strokeColor = 'transparent';
  /**
   * Frame border line width.
   */
  protected strokeWidth = 0;
  /**
   * Frame border dash array.
   */
  protected strokeDasharray = '';
  /**
   * Caption font family.
   */
  protected fontFamily: string;
  /**
   * Caption text color.
   */
  protected textColor = 'transparent';
  /**
   * Caption font size.
   */
  protected fontSize = '1rem';

  /**
   * Frame stroke color toolbox panel.
   */
  protected strokePanel: ColorPickerPanel;
  /**
   * Caption background (fill) color toolbox panel.
   */
  protected fillPanel: ColorPickerPanel;
  /**
   * Frame stroke width toolbox panel.
   */
  protected strokeWidthPanel: LineWidthPanel;
  /**
   * Frame stroke style toolbox panel.
   */
  protected strokeStylePanel: LineStylePanel;
  /**
   * Text font family toolbox panel.
   */
  protected fontFamilyPanel: FontFamilyPanel;
  /**
   * Text color picker toolbox panel.
   */
  protected textColorPanel: ColorPickerPanel;
  /**
   * True if the marker has moved in the manipulation.
   */
  protected isMoved = false;
  private pointerDownPoint: IPoint;
  private pointerDownTimestamp: number;

  /**
   * Frame rectangle.
   */
  protected frame: SVGRectElement;
  /**
   * Caption background element.
   */
  protected captionBg: SVGRectElement;
  /**
   * Caption text element.
   */
  protected captionElement!: SVGTextElement;
  /**
   * Caption text.
   */
  protected captionText = 'Caption';

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

    this.strokeColor = settings.defaultColor;
    this.strokeWidth = settings.defaultStrokeWidth;
    this.strokeDasharray = settings.defaultStrokeDasharray;
    this.fillColor = settings.defaultFillColor;
    this.textColor = settings.defaultStrokeColor;
    this.fontFamily = settings.defaultFontFamily;
    this.fontSize = settings.defaultCaptionFontSize;
    this.captionText = settings.defaultCaptionText;

    this.setStrokeColor = this.setStrokeColor.bind(this);
    this.setFillColor = this.setFillColor.bind(this);
    this.setStrokeWidth = this.setStrokeWidth.bind(this);
    this.setStrokeDasharray = this.setStrokeDasharray.bind(this);
    this.createVisual = this.createVisual.bind(this);
    this.sizeCaption = this.sizeCaption.bind(this);
    this.setCaptionText = this.setCaptionText.bind(this);
    this.showTextEditor = this.showTextEditor.bind(this);
    this.positionTextEditor = this.positionTextEditor.bind(this);
    this.finishTextEditing = this.finishTextEditing.bind(this);
    this.setFont = this.setFont.bind(this);
    this.setTextColor = this.setTextColor.bind(this);

    this.strokePanel = new ColorPickerPanel(
      'Line color',
      [...settings.defaultColorSet, 'transparent'],
      this.strokeColor,
      undefined,
      'stroke-color-panel'
    );
    this.strokePanel.onColorChanged = this.setStrokeColor;

    this.fillPanel = new ColorPickerPanel(
      'Fill color',
      [...settings.defaultColorSet, 'transparent'],
      this.fillColor,
      FillColorIcon,
      'fill-color-panel'
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

    this.fontFamilyPanel = new FontFamilyPanel(
      'Font',
      settings.defaultFontFamilies,
      settings.defaultFontFamily
    );
    this.fontFamilyPanel.onFontChanged = this.setFont;

    this.textColorPanel = new ColorPickerPanel(
      'Text color',
      settings.defaultColorSet,
      this.textColor,
      TextColorIcon,
      'text-color-panel'
    );
    this.textColorPanel.onColorChanged = this.setTextColor;
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
      el === this.frame ||
      el === this.captionBg ||
      el === this.captionElement
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Creates marker visual.
   */
  protected createVisual(): void {
    this.visual = SvgHelper.createGroup();
    this.addMarkerVisualToContainer(this.visual);

    this.captionBg = SvgHelper.createRect(1, 1, [['fill', this.fillColor]]);
    this.visual.appendChild(this.captionBg);

    this.captionElement = SvgHelper.createText([
      ['fill', this.textColor],
      ['font-family', this.fontFamily],
    ]);
    this.captionElement.style.fontSize = this.fontSize;
    this.captionElement.style.textAnchor = 'start';
    this.captionElement.style.dominantBaseline = 'text-before-edge';
    this.captionElement.textContent = this.captionText;
    this.visual.appendChild(this.captionElement);

    this.frame = SvgHelper.createRect(this.width, this.height, [
      ['fill', 'transparent'],
      ['stroke', this.strokeColor],
      ['stroke-width', this.strokeWidth.toString()],
      ['stroke-dasharray', this.strokeDasharray],
    ]);

    this.visual.appendChild(this.frame);
    this.sizeCaption();
  }

  /**
   * Sets caption text.
   * @param text - new caption text.
   */
  public setCaptionText(text: string): void {
    this.captionText = text;
    this.captionElement.textContent = this.captionText;
    this.sizeCaption();
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
  private captionBoxWidth = 0;
  private captionBoxHeight = 0;
  /**
   * Adjusts caption size and location.
   */
  protected sizeCaption(): void {
    const textBBox = this.captionElement.getBBox();
    if (this.captionText.trim() !== '') {
      this.captionBoxWidth = textBBox.width + this.PADDING * 2;
      this.captionBoxHeight = textBBox.height + this.PADDING * 2;
    } else {
      this.captionBoxWidth = 0;
      this.captionBoxHeight = 0;
    }

    SvgHelper.setAttributes(this.captionBg, [
      ['width', this.captionBoxWidth.toString()],
      ['height', this.captionBoxHeight.toString()],
      [
        'clip-path',
        `path('M0,0 H${this.width} V${this.height} H${-this.width} Z')`,
      ],
    ]);
    SvgHelper.setAttributes(this.captionElement, [
      ['x', this.PADDING.toString()],
      ['y', this.PADDING.toString()],
      [
        'clip-path',
        `path('M0,0 H${this.width - this.PADDING} V${this.height} H${
          -this.width - this.PADDING
        } Z')`,
      ],
    ]);
  }

  private textEditDiv: HTMLDivElement;
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
    if (this.captionBoxHeight > 0) {
      this.textEditBox.style.height = `${this.captionBoxHeight}px`;
    }
    this.textEditBox.style.fontSize = this.fontSize;
    this.textEditBox.style.fontFamily = this.fontFamily;
    this.textEditBox.style.backgroundColor = this.fillColor;
    this.textEditBox.style.color = this.textColor;
    this.textEditBox.style.borderWidth = '0';
    this.textEditBox.setAttribute('value', this.captionText);
    this.textEditBox.select();

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
    this.textEditBox.addEventListener('keyup', (ev) => {
      ev.cancelBubble = true;
    });
    this.textEditBox.addEventListener('blur', () => {
      this.finishTextEditing(this.textEditBox.value);
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
        this.textEditBox.style.transformOrigin = `${this.width / 2}px ${
          this.height / 2
        }px`;
      }
    }
  }

  private finishTextEditing(text: string) {
    this.setCaptionText(text.trim());
    this.overlayContainer.innerHTML = '';
    this.stateChanged();
  }

  /**
   * Sets font family.
   * @param font - new font family.
   */
  protected setFont(font: string): void {
    if (this.captionElement) {
      SvgHelper.setAttributes(this.captionElement, [['font-family', font]]);
    }
    this.fontFamily = font;
    if (this.textEditBox) {
      this.textEditBox.style.fontFamily = this.fontFamily;
    }
    this.sizeCaption();
    this.stateChanged();
  }

  /**
   * Sets text color.
   * @param color - new text color.
   */
  protected setTextColor(color: string): void {
    if (this.captionElement) {
      SvgHelper.setAttributes(this.captionElement, [['fill', color]]);
    }
    this.textColor = color;
    if (this.textEditBox) {
      this.textEditBox.style.color = this.textColor;
    }
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
    this.sizeCaption();
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) up event.
   *
   * @param point - event coordinates.
   */
  public pointerUp(point: IPoint): void {
    super.pointerUp(point);
    this.setSize();

    if (!this.isMoved && Date.now() - this.pointerDownTimestamp > 500) {
      this.showTextEditor();
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
  }

  /**
   * Sets marker's line color.
   * @param color - new line color.
   */
  protected setStrokeColor(color: string): void {
    this.strokeColor = color;
    if (this.frame) {
      SvgHelper.setAttributes(this.frame, [['stroke', this.strokeColor]]);
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
    if (this.captionBg) {
      SvgHelper.setAttributes(this.captionBg, [['fill', this.fillColor]]);
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
    if (this.frame) {
      SvgHelper.setAttributes(this.frame, [
        ['stroke-width', this.strokeWidth.toString()],
      ]);
    }
    this.stateChanged();
  }
  /**
   * Sets marker's border dash array.
   * @param dashes - new dash array.
   */
  protected setStrokeDasharray(dashes: string): void {
    this.strokeDasharray = dashes;
    if (this.frame) {
      SvgHelper.setAttributes(this.frame, [
        ['stroke-dasharray', this.strokeDasharray],
      ]);
    }
    this.stateChanged();
  }

  /**
   * Returns the list of toolbox panels for this marker type.
   */
  public get toolboxPanels(): ToolboxPanel[] {
    return [
      this.strokePanel,
      this.fillPanel,
      this.strokeWidthPanel,
      this.strokeStylePanel,
      this.fontFamilyPanel,
      this.textColorPanel,
    ];
  }

  /**
   * Returns current marker state that can be restored in the future.
   */
  public getState(): CaptionFrameMarkerState {
    const result: CaptionFrameMarkerState = Object.assign(
      {
        fillColor: this.fillColor,
        strokeColor: this.strokeColor,
        strokeWidth: this.strokeWidth,
        strokeDasharray: this.strokeDasharray,
        opacity: 1,
        textColor: this.textColor,
        fontFamily: this.fontFamily,
        fontSize: this.fontSize,
        captionText: this.captionText,
      },
      super.getState()
    );
    result.typeName = this.typeName;

    return result;
  }

  /**
   * Restores previously saved marker state.
   *
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    const frState = state as CaptionFrameMarkerState;
    this.fillColor = frState.fillColor;
    this.strokeColor = frState.strokeColor;
    this.strokeWidth = frState.strokeWidth;
    this.strokeDasharray = frState.strokeDasharray;
    this.textColor = frState.textColor;
    this.fontFamily = frState.fontFamily;
    this.captionText = frState.captionText;
    this.fontSize = frState.fontSize;

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
