import Icon from './ellipse-frame-marker-icon.svg';
import { Settings } from '../../core/Settings';
import { RectangleMarkerState } from '../RectangleMarkerState';
import { ToolboxPanel } from '../../ui/ToolboxPanel';
import { EllipseMarker } from '../ellipse-marker/EllipseMarker';

export class EllipseFrameMarker extends EllipseMarker {
  /**
   * String type name of the marker type. 
   * 
   * Used when adding {@link MarkerArea.availableMarkerTypes} via a string and to save and restore state.
   */
  public static typeName = 'EllipseFrameMarker';
  /**
   * Marker type title (display name) used for accessibility and other attributes.
   */
  public static title = 'Ellipse frame marker';
  /**
   * SVG icon markup displayed on toolbar buttons.
   */
  public static icon = Icon;

  /**
   * Creates a new marker.
   *
   * @param container - SVG container to hold marker's visual.
   * @param overlayContainer - overlay HTML container to hold additional overlay elements while editing.
   * @param settings - settings object containing default markers settings.
   */
  constructor(container: SVGGElement, overlayContainer: HTMLDivElement, settings: Settings) {
    super(container, overlayContainer, settings);

    // reset colors so 'transparent' is excluded
    this.strokePanel.colors= settings.defaultColorSet;

    this.fillColor = 'transparent';
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
    result.typeName = EllipseFrameMarker.typeName;
    return result;
  }
}
