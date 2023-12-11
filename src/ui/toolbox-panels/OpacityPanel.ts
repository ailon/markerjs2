import { ToolboxPanel } from '../ToolboxPanel';
import Icon from './opacity-panel-icon.svg';

/**
 * Opacity chage event handler type.
 */
export type OpacityChangeHandler = (newOpacity: number) => void;

/**
 * Opacity panel.
 */
export class OpacityPanel extends ToolboxPanel {
  private opacities: number[] = [];
  private currentOpacity?: number;

  private opacityBoxes: HTMLDivElement[] = [];

  /**
   * Opacity change event handler.
   */
  public onOpacityChanged?: OpacityChangeHandler;

  /**
   * Creates an opacity panel.
   * @param title - panel title.
   * @param opacities - available opacities.
   * @param currentOpacity - current opacity.
   * @param icon - toolbox panel button (SVG image markup).
   */
  constructor(title: string, opacities: number[], currentOpacity?: number, icon?: string) {
    super(title, icon ? icon : Icon);
    this.opacities = opacities;
    this.currentOpacity = currentOpacity;

    this._id = 'opacity-panel';

    this.setCurrentOpacity = this.setCurrentOpacity.bind(this);
  }

  /**
   * Returns panel UI.
   */
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
        opacity === this.currentOpacity ? this.uiStyleSettings.toolboxAccentColor : 'transparent';

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
      box.style.borderColor = box === target ? this.uiStyleSettings.toolboxAccentColor : 'transparent';
    });

    if (this.onOpacityChanged) {
      this.onOpacityChanged(this.currentOpacity);
    }
  }
}
