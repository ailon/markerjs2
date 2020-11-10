import Icon from './cover-marker-icon.svg';
import { ToolboxPanel } from '../../ui/ToolboxPanel';
import { ColorPickerPanel } from '../../ui/toolbox-panels/ColorPickerPanel';
import { Settings } from '../../core/Settings';
import { RectangleMarker } from '../RectangleMarker';

export class CoverMarker extends RectangleMarker {
  public static title = 'Cover marker';
  public static icon = Icon;

  private fillPanel: ColorPickerPanel;

  constructor(container: SVGGElement, overlayContainer: HTMLDivElement, settings: Settings) {
    super(container, overlayContainer, settings);

    this._name = 'cover';

    this.fillColor = settings.defaultFillColor;
    this.strokeWidth = 0;

    this.fillPanel = new ColorPickerPanel(
      'Color',
      settings.defaultColorSet,
      settings.defaultFillColor
    );
    this.fillPanel.onColorChanged = this.setFillColor;
  }

  public get toolboxPanels(): ToolboxPanel[] {
    return [this.fillPanel];
  }
}
