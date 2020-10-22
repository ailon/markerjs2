import Icon from './frame-marker-icon.svg';
import { ToolboxPanel } from '../../ui/ToolboxPanel';
import { ColorPickerPanel } from '../../ui/toolbox-panels/ColorPickerPanel';
import { Settings } from '../../core/Settings';
import { RectangleMarker } from '../RectangleMarker';

export class FrameMarker extends RectangleMarker {
  public static title = 'Frame marker';
  public static icon = Icon;

  private strokePanel: ColorPickerPanel;

  constructor(container: SVGGElement, overlayContainer: HTMLDivElement, settings: Settings) {
    super(container, overlayContainer, settings);

    this._name = 'frame';

    this.strokeColor = settings.defaultStrokeColor;
    this.strokeWidth = settings.defaultStrokeWidth;

    this.strokePanel = new ColorPickerPanel(
      'Line color',
      settings.defaultColorSet,
      settings.defaultStrokeColor
    );
    this.strokePanel.onColorChanged = this.setStrokeColor;
  }

  public get toolboxPanels(): ToolboxPanel[] {
    return [this.strokePanel];
  }
}
