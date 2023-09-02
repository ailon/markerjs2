import { IPoint } from '../../core/IPoint';
import { SvgHelper } from '../../core/SvgHelper';
import { RectangularBoxMarkerBase } from '../RectangularBoxMarkerBase';
import { Settings } from '../../core/Settings';
import Icon from './text-marker-icon.svg';
import { ColorPickerPanel } from '../../ui/toolbox-panels/ColorPickerPanel';
import { ToolboxPanel } from '../../ui/ToolboxPanel';
import { FontFamilyPanel } from '../../ui/toolbox-panels/FontFamilyPanel';
import { TextMarkerState } from './TextMarkerState';
import { MarkerBaseState } from '../../core/MarkerBaseState';

export class TextMarker extends RectangularBoxMarkerBase {
  /**
   * String type name of the marker type.
   *
   * Used when adding {@link MarkerArea.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'TextMarker';

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Text marker';
  /**
   * SVG icon markup displayed on toolbar buttons.
   */
  public static icon = Icon;

  /**
   * Text color.
   */
  protected color = 'transparent';
  /**
   * Text's font family.
   */
  protected fontFamily: string;
  /**
   * Padding inside of the marker's bounding box in percents.
   */
  protected padding = 5;

  /**
   * Text color picker toolbox panel.
   */
  protected colorPanel: ColorPickerPanel;
  /**
   * Text font family toolbox panel.
   */
  protected fontFamilyPanel: FontFamilyPanel;

  private readonly DEFAULT_TEXT = 'your text here';
  private text: string = this.DEFAULT_TEXT;
  /**
   * Visual text element.
   */
  protected textElement: SVGTextElement;
  /**
   * Text background rectangle.
   */
  protected bgRectangle: SVGRectElement;
  /**
   * Div element for the text editor container.
   */
  protected textEditDiv: HTMLDivElement;
  /**
   * Editable text element.
   */
  protected textEditor: HTMLDivElement;

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
  constructor(
    container: SVGGElement,
    overlayContainer: HTMLDivElement,
    settings: Settings
  ) {
    super(container, overlayContainer, settings);

    this.color = settings.defaultColor;
    this.fontFamily = settings.defaultFontFamily;

    this.defaultSize = { x: 100, y: 30 };

    this.setColor = this.setColor.bind(this);
    this.setFont = this.setFont.bind(this);
    this.renderText = this.renderText.bind(this);
    this.sizeText = this.sizeText.bind(this);
    this.textEditDivClicked = this.textEditDivClicked.bind(this);
    this.showTextEditor = this.showTextEditor.bind(this);
    this.setSize = this.setSize.bind(this);
    this.positionTextEditor = this.positionTextEditor.bind(this);
    this.wrapText = this.wrapText.bind(this);

    this.colorPanel = new ColorPickerPanel(
      'Color',
      settings.defaultColorSet,
      settings.defaultColor
    );
    this.colorPanel.onColorChanged = this.setColor;

    this.fontFamilyPanel = new FontFamilyPanel(
      'Font',
      settings.defaultFontFamilies,
      settings.defaultFontFamily
    );
    this.fontFamilyPanel.onFontChanged = this.setFont;
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
      el === this.textElement ||
      el === this.bgRectangle
    ) {
      return true;
    } else {
      let found = false;
      this.textElement.childNodes.forEach((span) => {
        if (span === el) {
          found = true;
        }
      });
      return found;
    }
  }

  /**
   * Creates text marker visual.
   */
  protected createVisual(): void {
    this.visual = SvgHelper.createGroup();

    this.bgRectangle = SvgHelper.createRect(1, 1, [['fill', 'transparent']]);
    this.visual.appendChild(this.bgRectangle);

    this.textElement = SvgHelper.createText([
      ['fill', this.color],
      ['font-family', this.fontFamily],
      ['font-size', '16px'],
      ['x', '0'],
      ['y', '0'],
    ]);
    this.textElement.transform.baseVal.appendItem(SvgHelper.createTransform()); // translate transorm
    this.textElement.transform.baseVal.appendItem(SvgHelper.createTransform()); // scale transorm

    this.visual.appendChild(this.textElement);

    this.addMarkerVisualToContainer(this.visual);
    this.renderText();
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

  private wrapText(): string {
    function getTextAspectRatio(textLines: string[]): number {
      const charsLinesAspectRatio = 0.35;

      let longestLineChars = textLines[0].length;
      textLines.forEach(line => {
        if (line.length > longestLineChars) {
          longestLineChars = line.length;
        }
      });

      return longestLineChars * charsLinesAspectRatio / textLines.length;
    }

    if (this.text !== '') {
      const lines = this.text.split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/);
      const boxAspectRatio = this.width * 1.0 / this.height;
      let processedLines = new Array<string>(...lines);
      
      let textAspectRatio = getTextAspectRatio(processedLines);

      let maxLineLength = Number.MAX_VALUE;
      while (textAspectRatio > boxAspectRatio) {
        let longestLine = processedLines[0];
        processedLines.forEach(line => {
          if (line.length > longestLine.length) {
            longestLine = line;
          }
        });
        maxLineLength = longestLine.lastIndexOf(' ', maxLineLength - 1);

        if (maxLineLength > 0) {
          processedLines = [];
          lines.forEach(line => {
            let reminderLine = line;
            while (reminderLine.length > maxLineLength) {
              const maxEnd = reminderLine.lastIndexOf(' ', maxLineLength);
              if (maxEnd > 0) {
                processedLines.push(reminderLine.substring(0, maxEnd));
                reminderLine = reminderLine.substring(maxEnd).trim();
              } else {
                processedLines.push(reminderLine);
                reminderLine = '';
              }
            }
            processedLines.push(reminderLine);
          });
          textAspectRatio = getTextAspectRatio(processedLines);
        } else {
          // can't wrap no more
          textAspectRatio = -1;
        }
      }

      return processedLines.join(`\r\n`);
    } else {
      return this.text;
    }
  }

  private renderText() {
    const LINE_SIZE = '1.2em';

    if (this.textElement) {
      while (this.textElement.lastChild) {
        this.textElement.removeChild(this.textElement.lastChild);
      }

      const processedText = this.globalSettings.wrapText ? this.wrapText() : this.text;
      const lines = processedText.split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/);
      lines.forEach((line) => {
        this.textElement.appendChild(
          SvgHelper.createTSpan(
            // workaround for swallowed empty lines
            line.trim() === '' ? ' ' : line.trim(), [
            ['x', '0'],
            ['dy', LINE_SIZE],
          ])
        );
      });

      setTimeout(this.sizeText, 10);
    }
  }

  private getTextScale(): number {
    const textSize = this.textElement.getBBox();
    let scale = 1.0;
    if (textSize.width > 0 && textSize.height > 0) {
      const xScale =
        (this.width * 1.0 - (this.width * this.padding * 2) / 100) /
        textSize.width;
      const yScale =
        (this.height * 1.0 - (this.height * this.padding * 2) / 100) /
        textSize.height;
      scale = Math.min(xScale, yScale);
    }
    return scale;
  }

  private getTextPosition(scale: number): IPoint {
    const textSize = this.textElement.getBBox();
    let x = 0;
    let y = 0;
    if (textSize.width > 0 && textSize.height > 0) {
      x = (this.width - textSize.width * scale) / 2;
      y = this.height / 2 - (textSize.height * scale) / 2;
    }
    return { x: x, y: y };
  }

  private sizeText() {
    const textBBox = this.textElement.getBBox();
    const scale = this.getTextScale();
    const position = this.getTextPosition(scale);
    position.y -= textBBox.y * scale; // workaround adjustment for text not being placed at y=0

    if (navigator.userAgent.indexOf('Edge/') > -1) {
      // workaround for legacy Edge as transforms don't work otherwise but this way it doesn't work in Safari
      this.textElement.style.transform = `translate(${position.x}px, ${position.y}px) scale(${scale}, ${scale})`;
    } else {
      this.textElement.transform.baseVal
        .getItem(0)
        .setTranslate(position.x, position.y);
      this.textElement.transform.baseVal.getItem(1).setScale(scale, scale);
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
    this.isMoved = true;
    this.setSize();
    if (this.globalSettings.wrapText) {
      this.renderText();
    } else {
      this.sizeText();
    }
  }

  /**
   * Sets size of marker elements after manipulation.
   */
  protected setSize(): void {
    super.setSize();
    if (this.visual && this.bgRectangle) {
      SvgHelper.setAttributes(this.visual, [
        ['width', this.width.toString()],
        ['height', this.height.toString()],
      ]);
      SvgHelper.setAttributes(this.bgRectangle, [
        ['width', this.width.toString()],
        ['height', this.height.toString()],
      ]);
    }
  }

  /**
   * Handles pointer (mouse, touch, stylus, etc.) up event.
   *
   * @param point - event coordinates.
   */
  public pointerUp(point: IPoint): void {
    const inState = this.state;
    if (inState === 'creating') {
      this._suppressMarkerCreateEvent = true;
    }
    super.pointerUp(point);
    this.setSize();
    if (
      inState === 'creating' ||
      (!this.isMoved && Date.now() - this.pointerDownTimestamp > 500)
    ) {
      this.showTextEditor();
    }
    this.pointerDownPoint = undefined;
  }

  private showTextEditor() {
    this._state = 'edit';
    this.overlayContainer.innerHTML = '';

    this.textEditDiv = document.createElement('div');
    // textEditDiv.style.display = 'flex';
    this.textEditDiv.style.flexGrow = '2';
    //textEditDiv.style.backgroundColor = 'rgb(0,0,0,0.7)';
    this.textEditDiv.style.alignItems = 'center';
    this.textEditDiv.style.justifyContent = 'center';
    this.textEditDiv.style.pointerEvents = 'auto';
    this.textEditDiv.style.overflow = 'hidden';

    this.textEditor = document.createElement('div');
    this.textEditor.style.position = 'absolute';
    this.textEditor.style.fontFamily = this.fontFamily;
    this.textEditor.style.lineHeight = '1em';
    this.textEditor.innerText = this.text;
    this.textEditor.contentEditable = 'true';
    this.textEditor.style.color = this.color;
    this.textEditor.style.whiteSpace = 'pre';
    //this.textEditor.style.outline = 'none';
    this.positionTextEditor();
    this.textEditor.addEventListener('pointerup', (ev) => {
      ev.stopPropagation();
    });
    if (!this.globalSettings.wrapText) {
      this.textEditor.addEventListener('input', () => {
        let fontSize = Number.parseFloat(this.textEditor.style.fontSize);
        while (
          this.textEditor.clientWidth >=
            Number.parseInt(this.textEditor.style.maxWidth) &&
          fontSize > 0.9
        ) {
          fontSize -= 0.1;
          this.textEditor.style.fontSize = `${Math.max(fontSize, 0.9)}em`;
        }
      });
    }
    this.textEditor.addEventListener('keyup', (ev) => {
      ev.cancelBubble = true;
    });
    this.textEditor.addEventListener('paste', (ev) => {
      if (ev.clipboardData) {
        // paste plain text
        const content = ev.clipboardData.getData('text');
        const selection = window.getSelection();
        if (!selection.rangeCount) return false;
        selection.deleteFromDocument();
        selection.getRangeAt(0).insertNode(document.createTextNode(content));
        ev.preventDefault();
      }
    });

    this.textEditDiv.addEventListener('pointerup', () => {
      this.textEditDivClicked(this.textEditor.innerText);
    });
    this.textEditDiv.appendChild(this.textEditor);
    this.overlayContainer.appendChild(this.textEditDiv);

    this.hideVisual();

    this.textEditor.focus();
    document.execCommand('selectAll');
  }

  private positionTextEditor() {
    if (this.state === 'edit') {
      if (this.textEditor === undefined) {
        this.showTextEditor();
      } else {
        if (this.globalSettings.wrapText) {
          this.textEditor.style.left = `${this.left + this.padding}px`;
          this.textEditor.style.top = `${this.top + this.padding}px`;
          this.textEditor.style.width = `${this.width - this.padding * 2}px`;
          this.textEditor.style.height = `${this.height - this.padding * 2}px`;
          this.textEditor.style.maxHeight = this.textEditor.style.height;
          this.textEditor.style.whiteSpace = 'wrap';
        } else {
          this.textElement.style.display = '';
          const textScale = this.getTextScale();
          // const textPosition = this.getTextPosition(textScale);
          const rPosition = this.rotatePoint({
            x: this.left + this.width / 2,
            y: this.top + this.height / 2,
          });
          const textSize = this.textElement.getBBox();
          const rWH = {
            x: textSize.width * textScale,
            y: textSize.height * textScale,
          };
          rPosition.x -= rWH.x / 2;
          rPosition.y -= rWH.y / 2;

          this.textEditor.style.top = `${rPosition.y}px`;
          this.textEditor.style.left = `${rPosition.x}px`;
          this.textEditor.style.maxWidth = `${
            this.overlayContainer.offsetWidth - rPosition.x
          }px`;
          this.textEditor.style.fontSize = `${Math.max(16 * textScale, 12)}px`;
          this.textElement.style.display = 'none';
        }
      }
    }
  }

  private textEditDivClicked(text: string) {
    this.text = text.trim();
    this.overlayContainer.innerHTML = '';
    this.renderText();
    this.showVisual();
    if (this._suppressMarkerCreateEvent) {
      this._suppressMarkerCreateEvent = false;
      if (this.onMarkerCreated) {
        this.onMarkerCreated(this);
      }
    }
    this.stateChanged();
  }

  public select(): void {
    super.select();    
    if (this.state === 'edit') {
      this.textEditDivClicked(this.textEditor.innerText);
    }
  }

  /**
   * Deselects this marker, renders text (if necessary), and hides selected marker UI.
   */
  public deselect(): void {
    if (this.state === 'edit') {
      this.textEditDivClicked(this.textEditor.innerText);
    }
    super.deselect();
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
   * Sets text color.
   * @param color - new text color.
   */
  protected setColor(color: string): void {
    if (this.textElement) {
      SvgHelper.setAttributes(this.textElement, [['fill', color]]);
    }
    this.color = color;
    if (this.textEditor) {
      this.textEditor.style.color = this.color;
    }
    this.colorChanged(color);
  }

  /**
   * Sets font family.
   * @param font - new font family.
   */
  protected setFont(font: string): void {
    if (this.textElement) {
      SvgHelper.setAttributes(this.textElement, [['font-family', font]]);
    }
    this.fontFamily = font;
    if (this.textEditor) {
      this.textEditor.style.fontFamily = this.fontFamily;
    }
    this.renderText();
    this.stateChanged();
  }

  /**
   * Hides marker visual.
   */
  protected hideVisual(): void {
    this.textElement.style.display = 'none';
    this.hideControlBox();
  }
  /**
   * Shows marker visual.
   */
  protected showVisual(): void {
    if (this.state === 'edit') {
      this._state = 'select';
    }
    this.textElement.style.display = '';
    this.showControlBox();
  }

  /**
   * Returns the list of toolbox panels for this marker type.
   */
  public get toolboxPanels(): ToolboxPanel[] {
    return [this.colorPanel, this.fontFamilyPanel];
  }

  /**
   * Returns current marker state that can be restored in the future.
   */
  public getState(): TextMarkerState {
    const result: TextMarkerState = Object.assign(
      {
        color: this.color,
        fontFamily: this.fontFamily,
        padding: this.padding,
        text: this.text,
      },
      super.getState()
    );
    result.typeName = TextMarker.typeName;

    return result;
  }

  /**
   * Restores previously saved marker state.
   *
   * @param state - previously saved state.
   */
  public restoreState(state: MarkerBaseState): void {
    const textState = state as TextMarkerState;
    this.color = textState.color;
    this.fontFamily = textState.fontFamily;
    this.padding = textState.padding;
    this.text = textState.text;

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
    this.sizeText();
    this.positionTextEditor();
  }
}
