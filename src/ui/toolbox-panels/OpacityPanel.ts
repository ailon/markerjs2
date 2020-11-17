import { Style } from '../../core/Style';
import { ToolboxPanel } from '../ToolboxPanel';
import Icon from './opacity-panel-icon.svg';

export type OpacityChangeHandler = (newOpacity: number) => void;

export class OpacityPanel extends ToolboxPanel {
  private opacities: number[] = [];
  private currentOpacity?: number;

  private opacityBoxes: HTMLDivElement[] = [];

  public onOpacityChanged?: OpacityChangeHandler;

  constructor(title: string, opacities: number[], currentOpacity?: number, icon?: string) {
    super(title, icon ? icon : Icon);
    this.opacities = opacities;
    this.currentOpacity = currentOpacity;

    this.setCurrentOpacity = this.setCurrentOpacity.bind(this);
  }

  public getUi(): HTMLDivElement {
    const panelDiv = document.createElement('div');
    panelDiv.style.display = 'flex';
    panelDiv.style.overflow = 'hidden';
    panelDiv.style.flexGrow = '2';
    panelDiv.style.justifyContent = 'space-between';
    this.opacities.forEach((opacity) => {
      const opacityBoxContainer = document.createElement('div');
      opacityBoxContainer.style.display = 'flex';
      //opacityBoxContainer.style.flexGrow = '2';
      opacityBoxContainer.style.alignItems = 'center';
      opacityBoxContainer.style.justifyContent = 'center';
      opacityBoxContainer.style.padding = '5px';
      opacityBoxContainer.style.borderWidth = '2px';
      opacityBoxContainer.style.borderStyle = 'solid';
      opacityBoxContainer.style.borderColor =
        opacity === this.currentOpacity ? Style.settings.toolboxAccentColor : 'transparent';

      opacityBoxContainer.addEventListener('click', () => {
        this.setCurrentOpacity(opacity, opacityBoxContainer);
      })
      panelDiv.appendChild(opacityBoxContainer);

      const label = document.createElement('div');
      label.innerText = `${(opacity * 100)}%`;
      opacityBoxContainer.appendChild(label);

      this.opacityBoxes.push(opacityBoxContainer);
    });
    return panelDiv;
  }

  private setCurrentOpacity(newWidth: number, target: HTMLDivElement) {
    this.currentOpacity = newWidth;

    this.opacityBoxes.forEach(box => {
      box.style.borderColor = box === target ? Style.settings.toolboxAccentColor : 'transparent';
    });

    if (this.onOpacityChanged) {
      this.onOpacityChanged(this.currentOpacity);
    }
  }
}
