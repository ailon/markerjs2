import Icon from './frame-marker-icon.svg';
import { ToolboxPanel } from '../../ui/ToolboxPanel';
import { ColorPickerPanel } from '../../ui/toolbox-panels/ColorPickerPanel';
import { Settings } from '../../core/Settings';
import { RectangleMarker } from '../RectangleMarker';
import { LineWidthPanel } from '../../ui/toolbox-panels/LineWidthPanel';
import { LineStylePanel } from '../../ui/toolbox-panels/LineStylePanel';
import { RectangleMarkerState } from '../RectangleMarkerState';

export class FrameMarker extends RectangleMarker {
  /**
   * String type name of the marker type.
   *
   * Used when adding {@link MarkerArea.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'FrameMarker';

  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Frame marker';
  /**
   * SVG icon markup displayed on toolbar buttons.
   */
  public static icon = Icon;

  private strokePanel: ColorPickerPanel;
  private strokeWidthPanel: LineWidthPanel;
  private strokeStylePanel: LineStylePanel;

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

  /**
   * Returns the list of toolbox panels for this marker type.
   */
  public get toolboxPanels(): ToolboxPanel[] {
    return [this.strokePanel, this.strokeWidthPanel, this.strokeStylePanel];
  }

  /**
   * Returns current marker state that can be restored in the future.
   */
  public getState(): RectangleMarkerState {
    const result = super.getState();
    result.typeName = FrameMarker.typeName;
    return result;
  }
}
