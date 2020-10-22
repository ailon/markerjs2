import { IPoint } from '../../MarkerArea';
import { SvgHelper } from '../../core/SvgHelper';
import { RectangularBoxMarkerBase } from '../RectangularBoxMarkerBase';
import { Settings } from '../../core/Settings';
import Icon from './text-marker-icon.svg';
import { ColorPickerPanel } from '../../ui/toolbox-panels/ColorPickerPanel';
import { ToolboxPanel } from '../../ui/ToolboxPanel';


export class TextMarker extends RectangularBoxMarkerBase {
  public static title = 'Text marker';
  public static icon = Icon;

  protected color = 'transparent';

  private colorPanel: ColorPickerPanel;

  private readonly DEFAULT_TEXT = "Double-click to edit text";
  private text: string = this.DEFAULT_TEXT;
  private textElement: SVGTextElement;

  constructor(container: SVGGElement, overlayContainer: HTMLDivElement, settings: Settings) {
    super(container, overlayContainer, settings);

    this.color = settings.defaultStrokeColor;

    this.setColor = this.setColor.bind(this);
    this.renderText = this.renderText.bind(this);
    this.sizeText = this.sizeText.bind(this);
    this.textEditDivClicked = this.textEditDivClicked.bind(this);
    this.showTextEditor = this.showTextEditor.bind(this);

    this.colorPanel = new ColorPickerPanel(
      'Color',
      settings.defaultColorSet,
      settings.defaultStrokeColor
    );
    this.colorPanel.onColorChanged = this.setColor;
  }

  public ownsTarget(el: EventTarget): boolean {
    if (super.ownsTarget(el) || el === this.visual || el === this.textElement) {
      return true;
    } else {
      let found = false;
      this.textElement.childNodes.forEach(span => {
        if (span === el) {
          found = true;
        }
      })
      return found;
    }
  }

  public mouseDown(point: IPoint, target?: EventTarget): void {
    super.mouseDown(point, target);
    if (this.state === 'new') {
      this.visual = SvgHelper.createGroup();
      this.textElement = SvgHelper.createText([
        ['fill', this.color]
      ]);
      this.textElement.transform.baseVal.appendItem(SvgHelper.createTransform()); // translate transorm
      this.textElement.transform.baseVal.appendItem(SvgHelper.createTransform()); // scale transorm

      this.visual.appendChild(this.textElement);

      const translate = SvgHelper.createTransform();
      this.visual.transform.baseVal.appendItem(translate);

      this.moveVisual(point);

      this.addMarkerVisualToContainer(this.visual);
      this.renderText();
      this._state = 'creating';
    }
  }

  private renderText() {
    const LINE_SIZE = "1.2em";

    while (this.textElement.lastChild) {
        this.textElement.removeChild(this.textElement.lastChild);
    }

    const lines = this.text.split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/);
    for (let line of lines) {
        if (line.trim() === "") {
            line = " "; // workaround for swallowed empty lines
        }
        this.textElement.appendChild(SvgHelper.createTSpan(line, [["x", "0"], ["dy", LINE_SIZE]]));
    }

    setTimeout(this.sizeText, 10);
  }

  private sizeText() {
    const textSize = this.textElement.getBBox();
    let x = 0;
    let y = 0;
    let scale = 1.0;
    if (textSize.width > 0 && textSize.height > 0) {
        const xScale = this.width * 1.0 / textSize.width;
        const yScale = this.height * 1.0 / textSize.height;
        scale = Math.min(xScale, yScale);

        x = (this.width - textSize.width * scale) / 2;
        y = (this.height - textSize.height * scale) / 2;
    }

    this.textElement.transform.baseVal.getItem(0).setTranslate(x, y);
    this.textElement.transform.baseVal.getItem(1).setScale(scale, scale);
  }


  public manipulate(point: IPoint): void {
    super.manipulate(point);
  }

  protected resize(point: IPoint): void {
    super.resize(point);
    SvgHelper.setAttributes(this.visual, [
      ['width', this.width.toString()],
      ['height', this.height.toString()],
    ]);
    this.sizeText();
  }

  public mouseUp(point: IPoint): void {
    if (this._state === 'creating') {
      this.showTextEditor();
    }
    super.mouseUp(point);
  }

  private showTextEditor() {
    this.overlayContainer.innerHTML = '';

    const textEditDiv = document.createElement('div');
    textEditDiv.style.display = 'flex';
    textEditDiv.style.flexGrow = '2';
    textEditDiv.style.backgroundColor = 'rgb(0,0,0,0.7)';
    textEditDiv.style.alignItems = 'center';
    textEditDiv.style.justifyContent = 'center';
    textEditDiv.style.pointerEvents = 'auto';

    const textEditor = document.createElement('div');
    textEditor.innerText = this.text;
    textEditor.contentEditable = 'true';
    textEditor.style.color = '#eeeeee';
    textEditor.addEventListener('click', (ev) => {
      ev.stopPropagation();
    })

    textEditDiv.addEventListener('click', () => {
      this.textEditDivClicked(textEditor.innerText);
    })

    textEditDiv.appendChild(textEditor);
    this.overlayContainer.appendChild(textEditDiv);
  }

  private textEditDivClicked(text: string) {
    this.text = text;
    this.overlayContainer.innerHTML = '';
    this.renderText();
  }

  public dblClick(point: IPoint, target?: EventTarget):void {
    super.dblClick(point, target);

    this.showTextEditor();
  }


  protected setColor(color: string): void {
    SvgHelper.setAttributes(this.textElement, [['fill', color]]);
  }

  public get toolboxPanels(): ToolboxPanel[] {
    return [this.colorPanel];
  }
}
