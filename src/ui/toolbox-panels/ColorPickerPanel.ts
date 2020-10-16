import { ToolboxPanel } from '../ToolboxPanel';

export type ColorChangeHandler = (newColor: string) => void;

export class ColorPickerPanel extends ToolboxPanel {
  private colors: string[] = [];
  private currentColor?: string;

  private colorBoxes: HTMLDivElement[] = [];

  public onColorChanged?: ColorChangeHandler;

  constructor(title: string, colors: string[], currentColor?: string) {
    super(title);
    this.colors = colors;
    this.currentColor = currentColor;

    this.setCurrentColor = this.setCurrentColor.bind(this);
  }

  public getUi(): HTMLDivElement {
    const panelDiv = document.createElement('div');
    this.colors.forEach((color) => {
      const colorBoxContainer = document.createElement('div');
      colorBoxContainer.style.display = 'inline-block';
      colorBoxContainer.style.width = '36px';
      colorBoxContainer.style.height = '36px';
      colorBoxContainer.style.padding = '2px';
      colorBoxContainer.style.marginRight = '2px';
      colorBoxContainer.style.marginBottom = '2px';
      colorBoxContainer.style.borderWidth = '1px';
      colorBoxContainer.style.borderStyle = 'solid';
      colorBoxContainer.style.borderColor =
        color === this.currentColor ? '#000000' : 'transparent';

      colorBoxContainer.addEventListener('click', () => {
        console.log('color!');
        this.setCurrentColor(color, colorBoxContainer);
      })
      panelDiv.appendChild(colorBoxContainer);

      const colorBox = document.createElement('div');
      colorBox.style.display = 'inline-block';
      colorBox.style.width = '36px';
      colorBox.style.height = '36px';
      colorBox.style.backgroundColor = color;

      colorBoxContainer.appendChild(colorBox);

      this.colorBoxes.push(colorBoxContainer);
    });
    return panelDiv;
  }

  private setCurrentColor(color: string, target: HTMLDivElement) {
    this.currentColor = color;

    this.colorBoxes.forEach(box => {
      box.style.borderColor = box === target ? '#000000' : 'transparent';
    });

    if (this.onColorChanged) {
      this.onColorChanged(color);
    }
  }
}
