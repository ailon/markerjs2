import { ToolboxPanel } from '../ToolboxPanel';
import Icon from './line-width-panel-icon.svg';

/**
 * Line width change event handler type.
 */
export type WidthChangeHandler = (newWidth: number) => void;

/**
 * Line width toolbox panel.
 */
export class LineWidthPanel extends ToolboxPanel {
  private widths: number[] = [];
  private currentWidth?: number;

  private widthBoxes: HTMLDivElement[] = [];

  /**
   * Line width change event handler.
   */
  public onWidthChanged?: WidthChangeHandler;

  /**
   * Creates a line width toolbox panel.
   * @param title - panel title.
   * @param widths - available widths.
   * @param currentWidth - currently set width.
   * @param icon - toolbox panel icon (SVG image markup).
   */
  constructor(title: string, widths: number[], currentWidth?: number, icon?: string) {
    super(title, icon ? icon : Icon);
    this.widths = widths;
    this.currentWidth = currentWidth;

    this._id = 'line-width-panel';

    this.setCurrentWidth = this.setCurrentWidth.bind(this);
  }

  /**
   * Returns panel UI.
   */
  public getUi(): HTMLDivElement {
    const panelDiv = document.createElement('div');
    panelDiv.style.display = 'flex';
    panelDiv.style.overflow = 'hidden';
    panelDiv.style.flexGrow = '2';
    this.widths.forEach((lineWidth) => {
      const widthBoxContainer = document.createElement('div');
      widthBoxContainer.style.display = 'flex';
      widthBoxContainer.style.flexGrow = '2';
      widthBoxContainer.style.alignItems = 'center';
      widthBoxContainer.style.justifyContent = 'space-between';
      widthBoxContainer.style.padding = '5px';
      widthBoxContainer.style.borderWidth = '2px';
      widthBoxContainer.style.borderStyle = 'solid';
      widthBoxContainer.style.borderColor =
        lineWidth === this.currentWidth ? this.uiStyleSettings.toolboxAccentColor : 'transparent';

      widthBoxContainer.addEventListener('click', () => {
        this.setCurrentWidth(lineWidth, widthBoxContainer);
      })
      panelDiv.appendChild(widthBoxContainer);

      const label = document.createElement('div');
      label.innerText = lineWidth.toString();
      label.style.marginRight = '5px';
      widthBoxContainer.appendChild(label);

      const widthBox = document.createElement('div');
      widthBox.style.minHeight = '20px';
      widthBox.style.flexGrow = '2';
      widthBox.style.display = 'flex';
      widthBox.style.alignItems = 'center';

      const hr = document.createElement('hr');
      hr.style.minWidth = '20px';
      hr.style.border = '0px';
      hr.style.borderTop = `${lineWidth}px solid ${this.uiStyleSettings.toolboxColor}`;
      hr.style.flexGrow = '2';
      widthBox.appendChild(hr);

      // widthBox.innerHTML = `<svg viewBox="0 0 140 20" width="140" height="20" xmlns="http://www.w3.org/2000/svg">
      //   <line x1="0" y1="10" x2="140" y2="10" stroke="${this.uiStyleSettings.toolboxColor}" stroke-width="${lineWidth}" />
      // </svg>`;

      widthBoxContainer.appendChild(widthBox);

      this.widthBoxes.push(widthBoxContainer);
    });
    return panelDiv;
  }

  private setCurrentWidth(newWidth: number, target: HTMLDivElement) {
    this.currentWidth = newWidth;

    this.widthBoxes.forEach(box => {
      box.style.borderColor = box === target ? this.uiStyleSettings.toolboxAccentColor : 'transparent';
    });

    if (this.onWidthChanged) {
      this.onWidthChanged(this.currentWidth);
    }
  }
}
