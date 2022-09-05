import { ToolboxPanel } from '../ToolboxPanel';
import Icon from './font-family-panel-icon.svg';

/**
 * Font change event handler type.
 */
export type FontChangeHandler = (newFont: string) => void;

/**
 * Font family selection toolbox panel.
 */
export class FontFamilyPanel extends ToolboxPanel {
  private fonts: string[] = [];
  private currentFont?: string;

  private fontBoxes: HTMLDivElement[] = [];

  /**
   * Handler for the font family change event.
   */
  public onFontChanged?: FontChangeHandler;

  /**
   * Creates a font family toolbox panel.
   * @param title - panel title.
   * @param fonts - available font families.
   * @param currentFont - currently selected font family.
   * @param icon - panel button icon (SVG image markup).
   */
  constructor(title: string, fonts: string[], currentFont?: string, icon?: string) {
    super(title, icon ? icon : Icon);
    this.fonts = fonts;
    this.currentFont = currentFont;

    this.setCurrentFont = this.setCurrentFont.bind(this);
  }

  /**
   * Returns panel UI.
   */
  public getUi(): HTMLDivElement {
    const panelDiv = document.createElement('div');
    // panelDiv.style.display = 'flex';
    panelDiv.style.overflow = 'hidden';
    panelDiv.style.flexGrow = '2';
    this.fonts.forEach((font) => {
      const fontBoxContainer = document.createElement('div');
      fontBoxContainer.style.display = 'inline-block';
      // fontBoxContainer.style.flexGrow = '2';
      fontBoxContainer.style.alignItems = 'center';
      fontBoxContainer.style.justifyContent = 'space-between';
      fontBoxContainer.style.padding = '5px';
      fontBoxContainer.style.borderWidth = '2px';
      fontBoxContainer.style.borderStyle = 'solid';
      fontBoxContainer.style.overflow = 'hidden';
      fontBoxContainer.style.maxWidth = `${100 / this.fonts.length - 5}%`;
      fontBoxContainer.style.borderColor =
        font === this.currentFont ? this.uiStyleSettings.toolboxAccentColor : 'transparent';

      fontBoxContainer.addEventListener('click', () => {
        this.setCurrentFont(font, fontBoxContainer);
      })
      panelDiv.appendChild(fontBoxContainer);

      const fontBox = document.createElement('div');
      fontBox.style.display = 'flex';
      fontBox.style.minHeight = '20px';
      fontBox.style.flexGrow = '2';
      fontBox.style.fontFamily = font;
      fontBox.style.overflow = 'hidden';

      const fontLabel = document.createElement('div');
      fontLabel.style.whiteSpace = 'nowrap';
      fontLabel.style.overflow = 'hidden';
      fontLabel.style.textOverflow = 'ellipsis';
      fontLabel.innerHTML = 'The quick brown fox jumps over the lazy dog';

      fontBox.appendChild(fontLabel);

      fontBoxContainer.appendChild(fontBox);

      this.fontBoxes.push(fontBoxContainer);
    });
    return panelDiv;
  }

  private setCurrentFont(newFont: string, target: HTMLDivElement) {
    this.currentFont = newFont;

    this.fontBoxes.forEach(box => {
      box.style.borderColor = box === target ? this.uiStyleSettings.toolboxAccentColor : 'transparent';
    });

    if (this.onFontChanged) {
      this.onFontChanged(this.currentFont);
    }
  }
}
