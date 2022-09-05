import { ToolboxPanel } from '../ToolboxPanel';
import Icon from './arrow-type-panel-icon.svg';

/**
 * Represents available arrow types.
 *
 * - `both` - arrow tips on both sides.
 * - `start` - arrow tip on the starting point of line.
 * - `end` - arrow tip on the ending point of line.
 * - `none` - no arrow tips.
 */
export type ArrowType = 'both' | 'start' | 'end' | 'none';
/**
 * Handler for arrow type change event.
 */
export type ArrowTypeChangeHandler = (newType: ArrowType) => void;

/**
 * Arrow type selection panel.
 */
export class ArrowTypePanel extends ToolboxPanel {
  private currentType?: ArrowType;

  private typeBoxes: HTMLDivElement[] = [];

  /**
   * Event handler for the arrow type change event.
   */
  public onArrowTypeChanged?: ArrowTypeChangeHandler;

  /**
   * Creates an ArrowTypePanel.
   * @param title - panel title.
   * @param currentType - currently set arrow type.
   * @param icon - panel button icon (SVG image markup).
   */
  constructor(
    title: string,
    currentType?: ArrowType,
    icon?: string
  ) {
    super(title, icon ? icon : Icon);
    this.currentType = currentType;

    this.setCurrentType = this.setCurrentType.bind(this);
  }

  /**
   * Returns panel UI.
   */
  public getUi(): HTMLDivElement {
    const panelDiv = document.createElement('div');
    panelDiv.style.display = 'flex';
    panelDiv.style.overflow = 'hidden';
    panelDiv.style.flexGrow = '2';
    for (let ti = 0; ti < 4; ti++) {
      let arrowType: ArrowType = 'both';
      switch (ti) {
        case 0:
          arrowType = 'both';
          break;
        case 1:
          arrowType = 'start';
          break;
        case 2:
          arrowType = 'end';
          break;
        case 3:
          arrowType = 'none';
          break;
      }
      const typeBoxContainer = document.createElement('div');
      typeBoxContainer.style.display = 'flex';
      typeBoxContainer.style.flexGrow = '2';
      typeBoxContainer.style.alignItems = 'center';
      typeBoxContainer.style.justifyContent = 'space-between';
      typeBoxContainer.style.padding = '5px';
      typeBoxContainer.style.borderWidth = '2px';
      typeBoxContainer.style.borderStyle = 'solid';
      typeBoxContainer.style.borderColor =
        arrowType === this.currentType
          ? this.uiStyleSettings.toolboxAccentColor
          : 'transparent';

      typeBoxContainer.addEventListener('click', () => {
        this.setCurrentType(arrowType, typeBoxContainer);
      });
      panelDiv.appendChild(typeBoxContainer);

      if (arrowType === 'both' || arrowType === 'start') {
        const leftTip = document.createElement('div');
        leftTip.style.display = 'flex';
        leftTip.style.alignItems = 'center';
        leftTip.style.minHeight = '20px';
        leftTip.innerHTML = `<svg viewBox="0 0 10 10" width="10" height="10" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,5 10,0 10,10" fill="${
            this.uiStyleSettings !== undefined
              ? this.uiStyleSettings.toolboxColor
              : '#eeeeee'
          }" />
        </svg>`;
        leftTip.style.marginLeft = '5px';
        typeBoxContainer.appendChild(leftTip);
      }

      const lineBox = document.createElement('div');
      lineBox.style.display = 'flex';
      lineBox.style.alignItems = 'center';
      lineBox.style.minHeight = '20px';
      lineBox.style.flexGrow = '2';

      const hr = document.createElement('hr');
      hr.style.minWidth = '20px';
      hr.style.border = '0px';
      hr.style.borderTop = `3px solid ${
        this.uiStyleSettings !== undefined
          ? this.uiStyleSettings.toolboxColor
          : '#eeeeee'
      }`;
      hr.style.flexGrow = '2';
      lineBox.appendChild(hr);

      typeBoxContainer.appendChild(lineBox);

      if (arrowType === 'both' || arrowType === 'end') {
        const rightTip = document.createElement('div');
        rightTip.style.display = 'flex';
        rightTip.style.alignItems = 'center';
        rightTip.style.minHeight = '20px';
        rightTip.innerHTML = `<svg viewBox="0 0 10 10" width="10" height="10" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,0 10,5 0,10" fill="${
            this.uiStyleSettings !== undefined
              ? this.uiStyleSettings.toolboxColor
              : '#eeeeee'
          }" />
        </svg>`;
        rightTip.style.marginRight = '5px';
        typeBoxContainer.appendChild(rightTip);
      }

      this.typeBoxes.push(typeBoxContainer);
    }
    return panelDiv;
  }

  private setCurrentType(newType: ArrowType, target: HTMLDivElement) {
    this.currentType = newType;

    this.typeBoxes.forEach((box) => {
      box.style.borderColor =
        box === target
          ? this.uiStyleSettings !== undefined
            ? this.uiStyleSettings.toolboxAccentColor
            : '#3080c3'
          : 'transparent';
    });

    if (this.onArrowTypeChanged) {
      this.onArrowTypeChanged(this.currentType);
    }
  }
}
