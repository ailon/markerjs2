import { SvgHelper } from '../../../dist/markerjs2';
import { Style } from '../../core/Style';
import { ToolboxPanel } from '../ToolboxPanel';

export type WidthChangeHandler = (newWidth: number) => void;

export class LineWidthPanel extends ToolboxPanel {
  private widths: number[] = [];
  private currentWidth?: number;

  private widthBoxes: HTMLDivElement[] = [];

  public onWidthChanged?: WidthChangeHandler;

  constructor(title: string, widths: number[], currentWidth?: number) {
    super(title);
    this.widths = widths;
    this.currentWidth = currentWidth;

    this.setCurrentWidth = this.setCurrentWidth.bind(this);
  }

  public getUi(): HTMLDivElement {
    const panelDiv = document.createElement('div');
    this.widths.forEach((lineWidth) => {
      const widthBoxContainer = document.createElement('div');
      widthBoxContainer.style.display = 'flex';
      widthBoxContainer.style.alignItems = 'end';
      widthBoxContainer.style.justifyContent = 'space-between';
      widthBoxContainer.style.padding = '5px';
      widthBoxContainer.style.borderWidth = '2px';
      widthBoxContainer.style.borderStyle = 'solid';
      widthBoxContainer.style.borderColor =
        lineWidth === this.currentWidth ? Style.settings.toolboxAccentColor : 'transparent';

      widthBoxContainer.addEventListener('click', () => {
        this.setCurrentWidth(lineWidth, widthBoxContainer);
      })
      panelDiv.appendChild(widthBoxContainer);

      const label = document.createElement('div');
      label.innerText = lineWidth.toString();
      widthBoxContainer.appendChild(label);

      const widthBox = document.createElement('div');
      widthBox.style.minHeight = '20px';

      widthBox.innerHTML = `<svg viewBox="0 0 140 20" width="140" height="20" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="10" x2="140" y2="10" stroke="${Style.settings.toolboxColor}" stroke-width="${lineWidth}" />
      </svg>`;

      widthBoxContainer.appendChild(widthBox);

      this.widthBoxes.push(widthBoxContainer);
    });
    return panelDiv;
  }

  private setCurrentWidth(newWidth: number, target: HTMLDivElement) {
    this.currentWidth = newWidth;

    this.widthBoxes.forEach(box => {
      box.style.borderColor = box === target ? Style.settings.toolboxAccentColor : 'transparent';
    });

    if (this.onWidthChanged) {
      this.onWidthChanged(this.currentWidth);
    }
  }
}
