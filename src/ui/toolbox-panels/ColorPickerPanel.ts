import { ToolboxPanel } from '../ToolboxPanel';

export class ColorPickerPanel extends ToolboxPanel {
  private colors: string[] = [];
  private currentColor?: string;

  constructor(colors: string[], currentColor?: string) {
    super();
    this.colors = colors;
    this.currentColor = currentColor;
  }

  public getUi(): HTMLDivElement {
    const panelDiv = document.createElement('div');
    this.colors.forEach(color => {
      const colorBox = document.createElement('div');
      colorBox.style.display = 'inline-block';
      colorBox.style.width = '20px';
      colorBox.style.height = '20px';
      colorBox.style.backgroundColor = color;
      panelDiv.appendChild(colorBox);
    })
    return panelDiv;
  }
}