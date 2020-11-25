import Icon from './highlight-marker-icon.svg';
import { ToolboxPanel } from '../../ui/ToolboxPanel';
import { ColorPickerPanel } from '../../ui/toolbox-panels/ColorPickerPanel';
import { Settings } from '../../core/Settings';
import { CoverMarker } from '../cover-marker/CoverMarker';
import { OpacityPanel } from '../../ui/toolbox-panels/OpacityPanel';
import { SvgHelper } from '../../core/SvgHelper';
import { RectangleMarkerState } from '../RectangleMarkerState';

export class HighlightMarker extends CoverMarker {
  public static title = 'Highlight marker';
  public static icon = Icon;

  protected opacityPanel: OpacityPanel;

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

  protected setOpacity(opacity: number): void {
    this.opacity = opacity;
    if (this.visual) {
      SvgHelper.setAttributes(this.visual, [['opacity', this.opacity.toString()]]);
    }
  }

  public get toolboxPanels(): ToolboxPanel[] {
    return [this.fillPanel, this.opacityPanel];
  }

  public getState(): RectangleMarkerState {
    const result = super.getState();
    result.typeName = HighlightMarker.typeName;
    return result;
  }
}
