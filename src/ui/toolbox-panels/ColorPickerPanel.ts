import { Style } from '../../core/Style';
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
  private colors: string[] = [];
  private currentColor?: string;

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

    this.setCurrentColor = this.setCurrentColor.bind(this);
  }

  /**
   * Returns panel UI.
   */
  public getUi(): HTMLDivElement {
    const panelDiv = document.createElement('div');
    const buttonPadding = Style.settings.toolbarHeight / 4;
    const buttonHeight = Style.settings.toolbarHeight - buttonPadding;

    this.colors.forEach((color) => {
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
        color === this.currentColor ? Style.settings.toolboxAccentColor : 'transparent';

      colorBoxContainer.addEventListener('click', () => {
        this.setCurrentColor(color, colorBoxContainer);
      })
      panelDiv.appendChild(colorBoxContainer);

      const colorBox = document.createElement('div');
      colorBox.style.display = 'inline-block';
      colorBox.style.width = `${buttonHeight - 2}px`;
      colorBox.style.height = `${buttonHeight - 2}px`;
      colorBox.style.backgroundColor = color;
      colorBox.style.borderRadius = `${buttonHeight/2}px`

      colorBoxContainer.appendChild(colorBox);

      this.colorBoxes.push(colorBoxContainer);
    });
    return panelDiv;
  }

  private setCurrentColor(color: string, target: HTMLDivElement) {
    this.currentColor = color;

    this.colorBoxes.forEach(box => {
      box.style.borderColor = box === target ? Style.settings.toolboxAccentColor : 'transparent';
    });

    if (this.onColorChanged) {
      this.onColorChanged(color);
    }
  }
}
