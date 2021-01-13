import { MarkerBase } from './../core/MarkerBase';
import { Style, StyleClass, StyleRule } from './../core/Style';

import CursorIcon from './toolbar-core-icons/cursor.svg';
import DeleteIcon from './toolbar-core-icons/delete.svg';
import CheckIcon from './toolbar-core-icons/check.svg';
import CloseIcon from './toolbar-core-icons/close.svg';
import OverflowIcon from './toolbar-core-icons/overflow.svg';
import { IStyleSettings } from '../core/IStyleSettings';
import { DisplayMode } from '../core/Settings';

/**
 * Toolbar button type:
 * - `action` for non-marker buttons like select, delete, etc.
 * - `marker` for marker type buttons.
 */
export type ToolbarButtonType = 'action' | 'marker';

/**
 * Click handler type for toolbar button click events.
 */
export type ToolbarButtonClickHandler = (
  buttonType: ToolbarButtonType,
  value?: typeof MarkerBase | string
) => void;

/**
 * Toolbar represents the main toolbar of the marker.js 2 interface.
 */
export class Toolbar {
  private markerItems: typeof MarkerBase[];

  private buttons: HTMLDivElement[] = [];
  private markerButtons: HTMLDivElement[] = [];
  private overflowButton: HTMLDivElement;

  private markerjsContainer: HTMLDivElement;
  private displayMode: DisplayMode;
  private uiContainer: HTMLDivElement;

  private toolbarStyleClass: StyleClass;
  private toolbarStyleColorsClass: StyleClass;
  private toolbarBlockStyleClass: StyleClass;
  private toolbarOverflowBlockStyleClass: StyleClass;
  private toolbarOverflowBlockStyleColorsClass: StyleClass;
  private toolbarButtonStyleClass: StyleClass;
  private toolbarButtonStyleColorsClass: StyleClass;
  private toolbarActiveButtonStyleColorsClass: StyleClass;

  private markerButtonBlock: HTMLDivElement
  private markerButtonOverflowBlock: HTMLDivElement

  private buttonClickListeners: ToolbarButtonClickHandler[] = [];

  private uiStyleSettings: IStyleSettings;

  private currentMarker?: MarkerBase;

  /**
   * Creates the main marker.js toolbar.
   * @param markerjsContainer - container for the toolbar in the marker.js UI.
   * @param displayMode - marker.js display mode (`inline` or `popup`).
   * @param markerItems - available marker types.
   * @param uiStyleSettings - settings for styling the tooblar ui.
   */
  constructor(
    markerjsContainer: HTMLDivElement, 
    displayMode: DisplayMode, 
    markerItems: typeof MarkerBase[], 
    uiStyleSettings: IStyleSettings
  ) {
    this.markerjsContainer = markerjsContainer;
    this.displayMode = displayMode;
    this.markerItems = markerItems;
    this.uiStyleSettings = uiStyleSettings;
    this.addStyles();

    this.adjustLayout = this.adjustLayout.bind(this);
    this.overflowButtonClicked = this.overflowButtonClicked.bind(this);
    this.setCurrentMarker = this.setCurrentMarker.bind(this);
  }

  /**
   * Creates and displays the toolbar UI.
   */
  public show(): void {
    this.uiContainer = document.createElement('div');
    this.uiContainer.className = `${this.toolbarStyleClass.name} ${Style.fadeInAnimationClassName} ${
      this.uiStyleSettings.toolbarStyleColorsClassName ? 
      this.uiStyleSettings.toolbarStyleColorsClassName : this.toolbarStyleColorsClass.name}`;

    const actionButtonBlock = document.createElement('div');
    actionButtonBlock.className = this.toolbarBlockStyleClass.name;
    actionButtonBlock.style.whiteSpace = 'nowrap';
    this.uiContainer.appendChild(actionButtonBlock);

    this.addActionButton(actionButtonBlock, CursorIcon, 'select');
    this.addActionButton(actionButtonBlock, DeleteIcon, 'delete');

    this.markerButtonBlock = document.createElement('div');
    this.markerButtonBlock.className = this.toolbarBlockStyleClass.name;
    this.markerButtonBlock.style.flexGrow = '2';
    this.markerButtonBlock.style.textAlign = 'center';
    this.uiContainer.appendChild(this.markerButtonBlock);

    this.markerButtonOverflowBlock = document.createElement('div');
    this.markerButtonOverflowBlock.className = `${this.toolbarOverflowBlockStyleClass.name} ${
      this.uiStyleSettings.toolbarOverflowBlockStyleColorsClassName ? 
      this.uiStyleSettings.toolbarOverflowBlockStyleColorsClassName : this.toolbarOverflowBlockStyleColorsClass.name}`;
    this.markerButtonOverflowBlock.style.display = 'none';
    this.uiContainer.appendChild(this.markerButtonOverflowBlock);

    if (this.markerItems) {
      this.markerItems.forEach((mi) => {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = `${this.toolbarButtonStyleClass.name}`;
        //  ${
        //   this.uiStyleSettings.toolbarButtonStyleColorsClassName ? 
        //   this.uiStyleSettings.toolbarButtonStyleColorsClassName : this.toolbarButtonStyleColorsClass.name}`;
        buttonContainer.innerHTML = mi.icon;
        buttonContainer.addEventListener('click', () => {
          this.markerToolbarButtonClicked(buttonContainer, mi);
        });
        //this.markerButtonBlock.appendChild(buttonContainer);
        this.buttons.push(buttonContainer);
        this.markerButtons.push(buttonContainer);
      });
      this.overflowButton = document.createElement('div');
      this.overflowButton.className = `${this.toolbarButtonStyleClass.name} ${
        this.uiStyleSettings.toolbarButtonStyleColorsClassName ? 
        this.uiStyleSettings.toolbarButtonStyleColorsClassName : this.toolbarButtonStyleColorsClass.name}`;
      this.overflowButton.innerHTML = OverflowIcon;
      this.overflowButton.addEventListener('click', this.overflowButtonClicked)
      this.markerButtonBlock.appendChild(this.overflowButton);
  }

    const resultButtonBlock = document.createElement('div');
    resultButtonBlock.className = this.toolbarBlockStyleClass.name;
    resultButtonBlock.style.whiteSpace = 'nowrap';
    this.uiContainer.appendChild(resultButtonBlock);

    this.addActionButton(resultButtonBlock, CheckIcon, 'render');
    this.addActionButton(resultButtonBlock, CloseIcon, 'close');

    this.markerjsContainer.appendChild(this.uiContainer);
    this.setSelectMode();

    this.setCurrentMarker();

    this.adjustLayout();
    // setTimeout(this.adjustLayout, 10);
  }

  /**
   * Add a listener to the toolbar button click event.
   * @param listener 
   */
  public addButtonClickListener(listener: ToolbarButtonClickHandler): void {
    this.buttonClickListeners.push(listener);
  }

  /**
   * Remove a listener for the toolbar button click event.
   * @param listener 
   */
  public removeButtonClickListener(listener: ToolbarButtonClickHandler): void {
    if (this.buttonClickListeners.indexOf(listener) > -1) {
      this.buttonClickListeners.splice(
        this.buttonClickListeners.indexOf(listener),
        1
      );
    }
  }

  /**
   * Switch toolbar to the `select` mode.
   */
  public setSelectMode(): void {
    this.resetButtonStyles();
    this.setActiveButton(this.buttons[0]);
  }

  /**
   * Adjusts toolbar layout.
   */
  public adjustLayout(): void {
    if (this.markerButtons && this.markerButtons.length > 0) {
      const numberToFit = Math.floor(this.markerButtonBlock.clientWidth / this.uiStyleSettings.toolbarHeight) - 1;
      this.markerButtonBlock.innerHTML = '';
      this.markerButtonOverflowBlock.innerHTML = '';
      for (let buttonIndex = 0; buttonIndex < this.markerButtons.length; buttonIndex++) {
        if (buttonIndex < numberToFit || (buttonIndex === numberToFit && (this.markerButtons.length - 1) === numberToFit)) {
          this.markerButtonBlock.appendChild(this.markerButtons[buttonIndex]);
        } else {
          if (buttonIndex === numberToFit) {
            this.markerButtonBlock.appendChild(this.overflowButton);
          }
          this.markerButtonOverflowBlock.appendChild(this.markerButtons[buttonIndex]);
        }
      }
    }
  }

  private overflowButtonClicked() {
    if (this.markerButtonOverflowBlock.style.display !== 'none') {
      this.markerButtonOverflowBlock.className = this.markerButtonOverflowBlock.className.replace(
        Style.fadeInAnimationClassName, '');
      this.markerButtonOverflowBlock.style.display = 'none';
    } else {
      this.markerButtonOverflowBlock.className += ` ${Style.fadeInAnimationClassName}`;
      this.markerButtonOverflowBlock.style.top = `${this.uiContainer.offsetTop + this.overflowButton.offsetHeight}px`;
      this.markerButtonOverflowBlock.style.right = `${this.uiContainer.offsetWidth - this.overflowButton.offsetLeft - this.overflowButton.offsetWidth + this.uiContainer.offsetLeft * 2}px`;
      this.markerButtonOverflowBlock.style.display = 'inline-block';
    }
  }

  private resetButtonStyles() {
    this.buttons.forEach(button => {
      button.className = button.className
        .replace(this.uiStyleSettings.toolbarButtonStyleColorsClassName ? 
          this.uiStyleSettings.toolbarButtonStyleColorsClassName : this.toolbarButtonStyleColorsClass.name, '')
        .trim();
      button.className = button.className
        .replace(this.uiStyleSettings.toolbarActiveButtonStyleColorsClassName ? 
          this.uiStyleSettings.toolbarActiveButtonStyleColorsClassName : this.toolbarActiveButtonStyleColorsClass.name, '')
        .trim();
      button.className += ` ${this.uiStyleSettings.toolbarButtonStyleColorsClassName ? 
        this.uiStyleSettings.toolbarButtonStyleColorsClassName : this.toolbarButtonStyleColorsClass.name}`;
    });
  }

  private addActionButton(container: HTMLDivElement, icon: string, value: string) {
    const actionButton = document.createElement('div');
    actionButton.className = `${this.toolbarButtonStyleClass.name}`;
    //  ${
    //   this.uiStyleSettings.toolbarButtonStyleColorsClassName ? 
    //   this.uiStyleSettings.toolbarButtonStyleColorsClassName : this.toolbarButtonStyleColorsClass.name}`;
    actionButton.innerHTML = icon;
    actionButton.addEventListener('click', () => {
      this.actionToolbarButtonClicked(actionButton, value);
    });
    container.appendChild(actionButton);
    this.buttons.push(actionButton);
  }

  private addStyles() {
    this.toolbarStyleClass = Style.addClass(
      new StyleClass(
        'toolbar',
        `
      width: 100%;
      flex-shrink: 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;      
      height: ${this.uiStyleSettings.toolbarHeight}px;
      box-sizing: content-box;
      ${this.displayMode === 'inline' ? `border-top-left-radius: ${Math.round(this.uiStyleSettings.toolbarHeight/10)}px;` : ''}
      ${this.displayMode === 'inline' ? `border-top-right-radius: ${Math.round(this.uiStyleSettings.toolbarHeight/10)}px;` : ''}
      overflow: hidden;
    `
      )
    );

    this.toolbarStyleColorsClass = Style.addClass(
      new StyleClass(
        'toolbar_colors',
        `
      background-color: ${this.uiStyleSettings.toolbarBackgroundColor};
      box-shadow: 0px 3px rgba(33, 33, 33, 0.1);
    `
      )
    );

    this.toolbarBlockStyleClass = Style.addClass(
      new StyleClass(
        'toolbar-block',
        `
        display: inline-block;
        box-sizing: content-box;
    `
      )
    );

    this.toolbarOverflowBlockStyleClass = Style.addClass(
      new StyleClass(
        'toolbar-overflow-block',
        `
        position: absolute;
        top: ${this.uiStyleSettings.toolbarHeight}px;
        max-width: ${this.uiStyleSettings.toolbarHeight * 2}px;
        z-index: 10;
        box-sizing: content-box;
      `
      )
    );
    this.toolbarOverflowBlockStyleColorsClass = Style.addClass(
      new StyleClass(
        'toolbar-overflow-block_colors',
        `
        background-color: ${this.uiStyleSettings.toolbarBackgroundColor};
      `
      )
    );

    const buttonPadding = this.uiStyleSettings.toolbarHeight / 4;
    this.toolbarButtonStyleClass = Style.addClass(new StyleClass('toolbar_button', `
      display: inline-block;
      width: ${this.uiStyleSettings.toolbarHeight - buttonPadding * 2}px;
      height: ${this.uiStyleSettings.toolbarHeight - buttonPadding * 2}px;
      padding: ${buttonPadding}px;
      box-sizing: content-box;
    `));
    this.toolbarButtonStyleColorsClass = Style.addClass(new StyleClass('toolbar_button_colors', `
      fill: ${this.uiStyleSettings.toolbarColor};
    `));

    this.toolbarActiveButtonStyleColorsClass = Style.addClass(new StyleClass('toolbar_active_button', `
      fill: ${this.uiStyleSettings.toolbarColor};
      background-color: ${this.uiStyleSettings.toolbarBackgroundHoverColor}
    `));

    Style.addRule(
      new StyleRule(
        `.${this.toolbarButtonStyleClass.name} svg`,
        `
      height: ${this.uiStyleSettings.toolbarHeight / 2}px;
    `
      )
    );

    Style.addRule(
      new StyleRule(
        `.${this.toolbarButtonStyleColorsClass.name}:hover`,
        `
        background-color: ${this.uiStyleSettings.toolbarBackgroundHoverColor}
    `
      )
    );
  }

  private markerToolbarButtonClicked(button: HTMLDivElement, markerType: typeof MarkerBase) {
    this.setActiveButton(button);
    if (this.buttonClickListeners && this.buttonClickListeners.length > 0) {
      this.buttonClickListeners.forEach((listener) =>
        listener('marker', markerType)
      );
    }
    this.markerButtonOverflowBlock.style.display = 'none';
  }

  private actionToolbarButtonClicked(button: HTMLDivElement, action: string) {
    if (this.buttonClickListeners && this.buttonClickListeners.length > 0) {
      this.buttonClickListeners.forEach((listener) =>
        listener('action', action)
      );
    }
    this.markerButtonOverflowBlock.style.display = 'none';
    this.setActiveButton(this.buttons[0]);
  }

  private setActiveButton(button: HTMLDivElement) {
    this.resetButtonStyles();
    button.className = button.className
      .replace(this.uiStyleSettings.toolbarButtonStyleColorsClassName ? 
        this.uiStyleSettings.toolbarButtonStyleColorsClassName : this.toolbarButtonStyleColorsClass.name, '')
      .trim();
    button.className += ` ${this.uiStyleSettings.toolbarActiveButtonStyleColorsClassName ? 
      this.uiStyleSettings.toolbarActiveButtonStyleColorsClassName : this.toolbarActiveButtonStyleColorsClass.name}`;
  }

  /**
   * Sets current marker and enables/disables the delete button accordingly.
   * @param marker 
   */
  public setCurrentMarker(marker?: MarkerBase): void {
    this.currentMarker = marker;
    if (this.currentMarker === undefined) {
      this.buttons[1].style.fillOpacity = '0.4';
      this.buttons[1].style.pointerEvents = 'none';
    } else {
      this.buttons[1].style.fillOpacity = '1';
      this.buttons[1].style.pointerEvents = 'all';
    }
  }
}
