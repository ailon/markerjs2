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
import { ResizeGrip } from '../ResizeGrip';

export class CalloutMarker extends TextMarker {
  public static title = 'Text marker';
  public static icon = Icon;

  private bgColor = 'transparent';
  protected bgColorPanel: ColorPickerPanel;

  private tipPosition: IPoint = { x: 0, y: 0 };
  private tipBase1Position: IPoint = { x: 0, y: 0 };
  private tipBase2Position: IPoint = { x: 0, y: 0 };
  private tip: SVGPolygonElement;
  private tipGrip: ResizeGrip;
  private tipMoving = false;

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
    this.setTipPoints = this.setTipPoints.bind(this);

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

    this.tipGrip = new ResizeGrip();
    this.tipGrip.visual.transform.baseVal.appendItem(
      SvgHelper.createTransform()
    );
    this.controlBox.appendChild(this.tipGrip.visual);
  }

  public ownsTarget(el: EventTarget): boolean {
    return (
      super.ownsTarget(el) || this.tipGrip.ownsTarget(el) || this.tip === el
    );
  }

  public pointerDown(point: IPoint, target?: EventTarget): void {
    if (this.state === 'new') {
      super.pointerDown(point, target);
    }

    if (this.state === 'creating') {
      SvgHelper.setAttributes(this.bgRectangle, [
        ['fill', this.bgColor],
        ['rx', '10px'],
      ]);

      this.tip = SvgHelper.createPolygon(this.getTipPoints(), [
        ['fill', this.bgColor],
      ]);
      this.visual.appendChild(this.tip);
    } else if (this.tipGrip.ownsTarget(target)) {
      this.manipulationStartLeft = this.left;
      this.manipulationStartTop = this.top;
      this.tipMoving = true;
    } else {
      super.pointerDown(point, target);
    }
  }

  public pointerUp(point: IPoint): void {
    if (this.tipMoving) {
      this.tipMoving = false;
    } else {
      this.setTipPoints();
      super.pointerUp(point);
    }
  }

  public manipulate(point: IPoint): void {
    if (this.tipMoving) {
      const rotatedPoint = this.unrotatePoint(point);
      this.tipPosition = {
        x: rotatedPoint.x - this.manipulationStartLeft,
        y: rotatedPoint.y - this.manipulationStartTop,
      };
      this.positionTip();
    } else {
      super.manipulate(point);
    }
  }

  protected setBgColor(color: string): void {
    SvgHelper.setAttributes(this.bgRectangle, [['fill', color]]);
    SvgHelper.setAttributes(this.tip, [['fill', color]]);
    this.bgColor = color;
  }

  private getTipPoints(): string {
    this.setTipPoints();
    return `${this.tipBase1Position.x},${this.tipBase1Position.y
      } ${this.tipBase2Position.x},${this.tipBase2Position.y
      } ${this.tipPosition.x},${this.tipPosition.y}`;
  }

  private setTipPoints() {
    let offset = Math.min(this.height / 2, 15);
    let baseWidth = this.height / 5;
    if (this.state === 'creating') {
      this.tipPosition = { x: offset + baseWidth / 2, y: this.height + 20 };
    }

    const cornerAngle = Math.atan((this.height / 2) / (this.width / 2));
    if (this.tipPosition.x < this.width / 2 && this.tipPosition.y < this.height / 2) {
      // top left
      const tipAngle = Math.atan((this.height / 2 - this.tipPosition.y) / (this.width / 2 - this.tipPosition.x));
      if (cornerAngle < tipAngle) {
        baseWidth = this.width / 5;
        offset = Math.min(this.width / 2, 15);
        this.tipBase1Position = { x: offset, y: 0 };
        this.tipBase2Position = { x: offset + baseWidth, y: 0 };
      } else {
        this.tipBase1Position = { x: 0, y: offset };
        this.tipBase2Position = { x: 0, y: offset + baseWidth };
      }
    } else if (this.tipPosition.x >= this.width / 2 && this.tipPosition.y < this.height / 2) {
      // top right
      const tipAngle = Math.atan((this.height / 2 - this.tipPosition.y) / (this.tipPosition.x - this.width / 2));
      if (cornerAngle < tipAngle) {
        baseWidth = this.width / 5;
        offset = Math.min(this.width / 2, 15);
        this.tipBase1Position = { x: this.width - offset - baseWidth, y: 0 };
        this.tipBase2Position = { x: this.width - offset, y: 0 };
      } else {
        this.tipBase1Position = { x: this.width, y: offset };
        this.tipBase2Position = { x: this.width, y: offset + baseWidth };
      }
    } else if (this.tipPosition.x >= this.width / 2 && this.tipPosition.y >= this.height / 2) {
      // bottom right
      const tipAngle = Math.atan((this.tipPosition.y - this.height / 2) / (this.tipPosition.x - this.width / 2));
      if (cornerAngle < tipAngle) {
        baseWidth = this.width / 5;
        offset = Math.min(this.width / 2, 15);
        this.tipBase1Position = { x: this.width - offset - baseWidth, y: this.height };
        this.tipBase2Position = { x: this.width - offset, y: this.height };
      } else {
        this.tipBase1Position = { x: this.width, y: this.height - offset - baseWidth };
        this.tipBase2Position = { x: this.width, y: this.height - offset };
      }
    } else {
      // bottom left
      const tipAngle = Math.atan((this.tipPosition.y - this.height / 2) / (this.width / 2 - this.tipPosition.x));
      if (cornerAngle < tipAngle) {
        baseWidth = this.width / 5;
        offset = Math.min(this.width / 2, 15);
        this.tipBase1Position = { x: offset, y: this.height };
        this.tipBase2Position = { x: offset + baseWidth, y: this.height };
      } else {
        this.tipBase1Position = { x: 0, y: this.height - offset };
        this.tipBase2Position = { x: 0, y: this.height - offset - baseWidth };
      }
    }
  }

  protected resize(point: IPoint): void {
    super.resize(point);
    this.positionTip();
  }

  private positionTip() {
    SvgHelper.setAttributes(this.tip, [['points', this.getTipPoints()]]);
    const translate = this.tipGrip.visual.transform.baseVal.getItem(0);
    translate.setTranslate(this.tipPosition.x, this.tipPosition.y);
    this.tipGrip.visual.transform.baseVal.replaceItem(translate, 0);
  }

  public get toolboxPanels(): ToolboxPanel[] {
    return [this.colorPanel, this.bgColorPanel, this.fontFamilyPanel];
  }

  public select(): void {
    this.positionTip();
    super.select();
  }
}
