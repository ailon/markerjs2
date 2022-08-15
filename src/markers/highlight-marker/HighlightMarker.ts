import Icon from './highlight-marker-icon.svg';
import { ToolboxPanel } from '../../ui/ToolboxPanel';
import { ColorPickerPanel } from '../../ui/toolbox-panels/ColorPickerPanel';
import { Settings } from '../../core/Settings';
import { CoverMarker } from '../cover-marker/CoverMarker';
import { OpacityPanel } from '../../ui/toolbox-panels/OpacityPanel';
import { SvgHelper } from '../../core/SvgHelper';
import { RectangleMarkerState } from '../RectangleMarkerState';

export class HighlightMarker extends CoverMarker {
  /**
   * String type name of the marker type. 
   * 
   * Used when adding {@link MarkerArea.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'HighlightMarker';
  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Highlight marker';
  /**
   * SVG icon markup displayed on toolbar buttons.
   */
  public static icon = Icon;

  protected opacityPanel: OpacityPanel;

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   * @param overlayContainer - overlay HTML container to hold additional overlay elements while editing.
   * @param settings - settings object containing default markers settings.
   */
  constructor(container: SVGGElement, overlayContainer: HTMLDivElement, settings: Settings) {
    super(container, overlayContainer, settings);

    this.setOpacity = this.setOpacity.bind(this);

    this.fillColor = settings.defaultHighlightColor;
    this.strokeWidth = 0;
    this.opacity = settings.defaultHighlightOpacity;

    this.fillPanel = new ColorPickerPanel(
      'Color',
      settings.defaultColorSet,
      this.fillColor
    );
    this.fillPanel.onColorChanged = this.setFillColor;

    this.opacityPanel = new OpacityPanel(
      'Opacity',
      settings.defaultOpacitySteps,
      this.opacity
    );
    this.opacityPanel.onOpacityChanged = this.setOpacity;
  }

  /**
   * Sets marker's opacity (0..1).
   * @param opacity - new opacity value.
   */
  protected setOpacity(opacity: number): void {
    this.opacity = opacity;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['opacity', this.opacity.toString()]]);
    }
    this.stateChanged();
  }

  /**
   * Returns the list of toolbox panels for this marker type.
   */
  public get toolboxPanels(): ToolboxPanel[] {
    return [this.fillPanel, this.opacityPanel];
  }

  /**
   * Returns current marker state that can be restored in the future.
   */
  public getState(): RectangleMarkerState {
    const result = super.getState();
    result.typeName = HighlightMarker.typeName;
    return result;
  }
}
