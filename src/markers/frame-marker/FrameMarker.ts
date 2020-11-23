import Icon from './frame-marker-icon.svg';
import { ToolboxPanel } from '../../ui/ToolboxPanel';
import { ColorPickerPanel } from '../../ui/toolbox-panels/ColorPickerPanel';
import { Settings } from '../../core/Settings';
import { RectangleMarker } from '../RectangleMarker';
import { LineWidthPanel } from '../../ui/toolbox-panels/LineWidthPanel';
import { LineStylePanel } from '../../ui/toolbox-panels/LineStylePanel';

export class FrameMarker extends RectangleMarker {
  public static title = 'Frame marker';
  public static icon = Icon;

  private strokePanel: ColorPickerPanel;
  private strokeWidthPanel: LineWidthPanel;
  private strokeStylePanel: LineStylePanel;

  constructor(container: SVGGElement, overlayContainer: HTMLDivElement, settings: Settings) {
    super(container, overlayContainer, settings);

    this._name = 'frame';

    this.strokeColor = settings.defaultColor;
    this.strokeWidth = settings.defaultStrokeWidth;
    this.strokeDasharray = settings.defaultStrokeDasharray;

    this.strokePanel = new ColorPickerPanel(
      'Line color',
      settings.defaultColorSet,
      settings.defaultColor
    );
    this.strokePanel.onColorChanged = this.setStrokeColor;

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

  public get toolboxPanels(): ToolboxPanel[] {
    return [this.strokePanel, this.strokeWidthPanel, this.strokeStylePanel];
  }
}
