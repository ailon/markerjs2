import Icon from './cover-marker-icon.svg';
import { ToolboxPanel } from '../../ui/ToolboxPanel';
import { ColorPickerPanel } from '../../ui/toolbox-panels/ColorPickerPanel';
import { Settings } from '../../core/Settings';
import { RectangleMarker } from '../RectangleMarker';

export class CoverMarker extends RectangleMarker {
  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Cover marker';
  /**
   * SVG icon markup displayed on toolbar buttons.
   */
  public static icon = Icon;

  /**
   * Color picker panel for the background color.
   */
  protected fillPanel: ColorPickerPanel;

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   * @param overlayContainer - overlay HTML container to hold additional overlay elements while editing.
   * @param settings - settings object containing default markers settings.
   */
  constructor(container: SVGGElement, overlayContainer: HTMLDivElement, settings: Settings) {
    super(container, overlayContainer, settings);

    this.fillColor = settings.defaultFillColor;
    this.strokeWidth = 0;

    this.fillPanel = new ColorPickerPanel(
      'Color',
      settings.defaultColorSet,
      settings.defaultFillColor
    );
    this.fillPanel.onColorChanged = this.setFillColor;
  }

  /**
   * Returns the list of toolbox panels for this marker type.
   */
  public get toolboxPanels(): ToolboxPanel[] {
    return [this.fillPanel];
  }
}
