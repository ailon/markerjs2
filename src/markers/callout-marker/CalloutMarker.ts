import { IPoint } from '../../MarkerArea';
import { SvgHelper } from '../../core/SvgHelper';
import { Settings } from '../../core/Settings';
import Icon from './callout-marker-icon.svg';
import TextColorIcon from '../../ui/toolbox-panels/text-color-icon.svg';
import FillColorIcon from '../../ui/toolbox-panels/fill-color-icon.svg';
import { ColorPickerPanel } from '../../ui/toolbox-panels/ColorPickerPanel';
import { ToolboxPanel } from '../../ui/ToolboxPanel';
import { FontFamilyPanel } from '../../ui/toolbox-panels/FontFamilyPanel';
import { TextMarker } from '../text-marker/TextMarker';

export class CalloutMarker extends TextMarker {
  public static title = 'Text marker';
  public static icon = Icon;

  private bgColor = 'transparent';
  protected bgColorPanel: ColorPickerPanel;

  private tipPosition: IPoint = { x: 0, y: 0 };
  private tip: SVGPolygonElement;


  constructor(
    container: SVGGElement,
    overlayContainer: HTMLDivElement,
    settings: Settings
  ) {
    super(container, overlayContainer, settings);

    this.color = settings.defaultStrokeColor;
    this.bgColor = settings.defaultFillColor;
    this.fontFamily = settings.defaultFontFamily;

    this.defaultSize = { x: 100, y: 30 };

    this.setBgColor = this.setBgColor.bind(this);
    this.getTipPoints = this.getTipPoints.bind(this);
    this.positionTip = this.positionTip.bind(this);

    this.colorPanel = new ColorPickerPanel(
      'Text color',
      settings.defaultColorSet,
      this.color,
      TextColorIcon
    );
    this.colorPanel.onColorChanged = this.setColor;

    this.bgColorPanel = new ColorPickerPanel(
      'Fill color',
      settings.defaultColorSet,
      this.bgColor,
      FillColorIcon
    );
    this.bgColorPanel.onColorChanged = this.setBgColor;

    this.fontFamilyPanel = new FontFamilyPanel(
      'Font',
      settings.defaultFontFamilies,
      settings.defaultFontFamily
    );
    this.fontFamilyPanel.onFontChanged = this.setFont;
  }

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

  public pointerDown(point: IPoint, target?: EventTarget): void {
    super.pointerDown(point, target);
    if (this.state === 'creating') {
      SvgHelper.setAttributes(this.bgRectangle, [
        ['fill', this.bgColor],
        ['rx', '10px'],
      ]);

      this.tip = SvgHelper.createPolygon(this.getTipPoints(), [['fill', this.bgColor]]);
      this.visual.appendChild(this.tip);
    }
  }

  protected setBgColor(color: string): void {
    SvgHelper.setAttributes(this.bgRectangle, [['fill', color]]);
    this.bgColor = color;
  }

  private getTipPoints(): string {
    const offset = 15;
    const width = 20;
    const height = 20;
    return `${offset},${this.height} ${offset + width},${this.height} ${offset + width / 2},${this.height + height}`;
  }

  protected resize(point: IPoint): void {
    super.resize(point);
    this.positionTip();
  }

  private positionTip() {
    SvgHelper.setAttributes(this.tip, [['points', this.getTipPoints()]]);
  }

  public get toolboxPanels(): ToolboxPanel[] {
    return [this.colorPanel, this.bgColorPanel, this.fontFamilyPanel];
  }
}
