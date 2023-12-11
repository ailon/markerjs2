import { ToolboxPanel } from '../ToolboxPanel';
import Icon from './line-style-panel-icon.svg';

/**
 * Line style change event handler type.
 */
export type StyleChangeHandler = (newStyle: string) => void;

/**
 * Line style (solid, dashed, etc.) toolbox panel.
 */
export class LineStylePanel extends ToolboxPanel {
  private styles: string[] = [];
  private currentStyle?: string;

  private styleBoxes: HTMLDivElement[] = [];

  /**
   * Handler for the style change event.
   */
  public onStyleChanged?: StyleChangeHandler;

  /**
   * Creates a line style toolbox panel.
   * @param title - panel title
   * @param styles - available line styles (dash array).
   * @param currentStyle - currently selected style.
   * @param icon - panel button icon (SVG image markup).
   */
  constructor(title: string, styles: string[], currentStyle?: string, icon?: string) {
    super(title, icon ? icon : Icon);
    this.styles = styles;
    this.currentStyle = currentStyle;

    this._id = 'line-style-panel';

    this.setCurrentStyle = this.setCurrentStyle.bind(this);
  }

  /**
   * Returns panel UI.
   */
  public getUi(): HTMLDivElement {
    const panelDiv = document.createElement('div');
    panelDiv.style.display = 'flex';
    panelDiv.style.overflow = 'hidden';
    panelDiv.style.flexGrow = '2';
    this.styles.forEach((lineStyle) => {
      const styleBoxContainer = document.createElement('div');
      styleBoxContainer.style.display = 'flex'; //'inline-block';
      styleBoxContainer.style.alignItems = 'center';
      styleBoxContainer.style.justifyContent = 'space-between';
      styleBoxContainer.style.padding = '5px';
      styleBoxContainer.style.borderWidth = '2px';
      styleBoxContainer.style.borderStyle = 'solid';
      styleBoxContainer.style.overflow = 'hidden';
      styleBoxContainer.style.maxWidth = `${100 / this.styles.length - 5}%`;
      styleBoxContainer.style.borderColor =
        lineStyle === this.currentStyle ? this.uiStyleSettings.toolboxAccentColor : 'transparent';

      styleBoxContainer.addEventListener('click', () => {
        this.setCurrentStyle(lineStyle, styleBoxContainer);
      })
      panelDiv.appendChild(styleBoxContainer);

      const styleBox = document.createElement('div');
      styleBox.style.minHeight = '20px';
      styleBox.style.flexGrow = '2';
      styleBox.style.overflow = 'hidden';

      const styleSample = `<svg width="100" height="20">
      <line x1="0" y1="10" x2="100" y2="10" stroke="${
        this.uiStyleSettings.toolboxColor}" stroke-width="3" ${
          lineStyle !== '' ? 'stroke-dasharray="' + lineStyle + '"' : ''} />
  </svg>`;

      styleBox.innerHTML = styleSample;

      styleBoxContainer.appendChild(styleBox);

      this.styleBoxes.push(styleBoxContainer);
    });
    return panelDiv;
  }

  private setCurrentStyle(newStyle: string, target: HTMLDivElement) {
    this.currentStyle = newStyle;

    this.styleBoxes.forEach(box => {
      box.style.borderColor = box === target ? this.uiStyleSettings.toolboxAccentColor : 'transparent';
    });

    if (this.onStyleChanged) {
      this.onStyleChanged(this.currentStyle);
    }
  }
}
