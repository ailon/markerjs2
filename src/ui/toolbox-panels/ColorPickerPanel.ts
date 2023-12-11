import { ToolboxPanel } from '../ToolboxPanel';
import Icon from './color-picker-panel-icon.svg';

/**
 * Handler type for the color change event.
 */
export type ColorChangeHandler = (newColor: string) => void;

/**
 * Color picker panel.
 */
export class ColorPickerPanel extends ToolboxPanel {
  public colors: string[] = [];
  private currentColor?: string;
  private addTransparent = false;

  private colorBoxes: HTMLDivElement[] = [];

  /**
   * Color change event handler.
   */
  public onColorChanged?: ColorChangeHandler;

  /**
   * Creates a color picker panel.
   * @param title - panel title.
   * @param colors - available colors.
   * @param currentColor - currently selected color.
   * @param icon - panel button icon (SVG imager markup).
   */
  constructor(title: string, colors: string[], currentColor?: string, icon?: string) {
    super(title, icon ? icon : Icon);
    this.colors = colors;
    this.currentColor = currentColor;

    this._id = 'color-picker-panel';

    this.setCurrentColor = this.setCurrentColor.bind(this);
    this.getColorBox = this.getColorBox.bind(this);
  }

  /**
   * Returns panel UI.
   */
  public getUi(): HTMLDivElement {
    const panelDiv = document.createElement('div');
    panelDiv.style.overflow = 'hidden';
    panelDiv.style.whiteSpace = 'nowrap';
    this.colors.forEach((color) => {
      const colorBoxContainer = this.getColorBox(color);
      panelDiv.appendChild(colorBoxContainer);
      this.colorBoxes.push(colorBoxContainer);
    });
    return panelDiv;
  }

  private getColorBox(color): HTMLDivElement {
    const buttonPadding = this.uiStyleSettings.toolbarHeight / 4;
    const buttonHeight = this.uiStyleSettings.toolbarHeight - buttonPadding;

    const colorBoxContainer = document.createElement('div');
    colorBoxContainer.style.display = 'inline-block';
    colorBoxContainer.style.boxSizing = 'content-box';
    colorBoxContainer.style.width = `${buttonHeight - 2}px`;
    colorBoxContainer.style.height = `${buttonHeight - 2}px`;
    colorBoxContainer.style.padding = '1px';
    colorBoxContainer.style.marginRight = '2px';
    colorBoxContainer.style.marginBottom = '2px';
    colorBoxContainer.style.borderWidth = '2px';
    colorBoxContainer.style.borderStyle = 'solid';
    colorBoxContainer.style.borderRadius = `${(buttonHeight + 2)/2}px`
    colorBoxContainer.style.borderColor =
      color === this.currentColor ? this.uiStyleSettings.toolboxAccentColor : 'transparent';

    colorBoxContainer.addEventListener('click', () => {
      this.setCurrentColor(color, colorBoxContainer);
    })

    const colorBox = document.createElement('div');
    colorBox.style.display = 'inline-block';
    colorBox.style.width = `${buttonHeight - 2}px`;
    colorBox.style.height = `${buttonHeight - 2}px`;
    colorBox.style.backgroundColor = color;
    colorBox.style.borderRadius = `${buttonHeight/2}px`;
    if (color === 'transparent') {
      colorBox.style.fill = this.uiStyleSettings.toolboxAccentColor;
      colorBox.innerHTML = `<svg viewBox="0 0 24 24">
        <path d="M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z" />
      </svg>`;
    }

    colorBoxContainer.appendChild(colorBox);

    return colorBoxContainer;
  }

  private setCurrentColor(color: string, target: HTMLDivElement) {
    this.currentColor = color;

    this.colorBoxes.forEach(box => {
      box.style.borderColor = box === target ? this.uiStyleSettings.toolboxAccentColor : 'transparent';
    });

    if (this.onColorChanged) {
      this.onColorChanged(color);
    }
  }
}
