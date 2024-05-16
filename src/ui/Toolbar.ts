import { MarkerBase } from './../core/MarkerBase';
import { StyleManager, StyleClass, StyleRule } from './../core/Style';

import CursorIcon from './toolbar-core-icons/cursor.svg';
import DeleteIcon from './toolbar-core-icons/delete.svg';
import ClearIcon from './toolbar-core-icons/clear.svg';
import CheckIcon from './toolbar-core-icons/check.svg';
import CloseIcon from './toolbar-core-icons/close.svg';
import OverflowIcon from './toolbar-core-icons/overflow.svg';
import UndoIcon from './toolbar-core-icons/undo.svg';
import RedoIcon from './toolbar-core-icons/redo.svg';
import NotesIcon from './toolbar-core-icons/notes.svg';
import ZoomIcon from './toolbar-core-icons/zoom.svg';
import ZoomOutIcon from './toolbar-core-icons/zoom-out.svg';
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
  private markerItems: (typeof MarkerBase)[];

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

  private markerButtonBlock: HTMLDivElement;
  private markerButtonOverflowBlock: HTMLDivElement;

  private buttonClickListeners: ToolbarButtonClickHandler[] = [];

  private uiStyleSettings: IStyleSettings;

  private currentMarker?: MarkerBase;

  private styles: StyleManager;

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
    markerItems: (typeof MarkerBase)[],
    uiStyleSettings: IStyleSettings,
    styles: StyleManager
  ) {
    this.markerjsContainer = markerjsContainer;
    this.displayMode = displayMode;
    this.markerItems = markerItems;
    this.uiStyleSettings = uiStyleSettings;
    this.styles = styles;
    this.addStyles();

    this.adjustLayout = this.adjustLayout.bind(this);
    this.overflowButtonClicked = this.overflowButtonClicked.bind(this);
    this.setCurrentMarker = this.setCurrentMarker.bind(this);
  }

  /**
   * Creates and displays the toolbar UI.
   */
  public show(visiblity: string): void {
    this.uiContainer = document.createElement('div');
    this.uiContainer.style.visibility = visiblity;
    this.uiContainer.className = `${this.toolbarStyleClass.name} ${
      this.styles.fadeInAnimationClassName
    } ${
      this.uiStyleSettings.toolbarStyleColorsClassName
        ? this.uiStyleSettings.toolbarStyleColorsClassName
        : this.toolbarStyleColorsClass.name
    }`;

    const actionButtonBlock = document.createElement('div');
    actionButtonBlock.className = this.toolbarBlockStyleClass.name;
    actionButtonBlock.style.whiteSpace = 'nowrap';
    this.uiContainer.appendChild(actionButtonBlock);

    this.addActionButton(
      actionButtonBlock,
      CursorIcon,
      'select',
      'Select mode'
    );
    this.addActionButton(
      actionButtonBlock,
      DeleteIcon,
      'delete',
      'Delete marker'
    );
    if (this.uiStyleSettings.clearButtonVisible) {
      this.addActionButton(
        actionButtonBlock,
        ClearIcon,
        'clear',
        'Delete all markers'
      );
    }
    if (this.uiStyleSettings.undoButtonVisible) {
      this.addActionButton(actionButtonBlock, UndoIcon, 'undo', 'Undo');
    }
    if (this.uiStyleSettings.redoButtonVisible) {
      this.addActionButton(actionButtonBlock, RedoIcon, 'redo', 'Redo');
    }
    if (this.uiStyleSettings.zoomButtonVisible) {
      this.addActionButton(actionButtonBlock, ZoomIcon, 'zoom', 'Zoom in');
    }
    if (
      this.uiStyleSettings.zoomButtonVisible &&
      this.uiStyleSettings.zoomOutButtonVisible
    ) {
      this.addActionButton(
        actionButtonBlock,
        ZoomOutIcon,
        'zoom-out',
        'Zoom out'
      );
    }
    if (this.uiStyleSettings.notesButtonVisible) {
      this.addActionButton(actionButtonBlock, NotesIcon, 'notes', 'Notes');
    }

    this.markerButtonBlock = document.createElement('div');
    this.markerButtonBlock.className = this.toolbarBlockStyleClass.name;
    this.markerButtonBlock.style.flexGrow = '2';
    this.markerButtonBlock.style.textAlign = 'center';
    this.uiContainer.appendChild(this.markerButtonBlock);

    this.markerButtonOverflowBlock = document.createElement('div');
    this.markerButtonOverflowBlock.className = `${
      this.toolbarOverflowBlockStyleClass.name
    } ${
      this.uiStyleSettings.toolbarOverflowBlockStyleColorsClassName
        ? this.uiStyleSettings.toolbarOverflowBlockStyleColorsClassName
        : this.toolbarOverflowBlockStyleColorsClass.name
    }`;
    this.markerButtonOverflowBlock.style.display = 'none';
    this.uiContainer.appendChild(this.markerButtonOverflowBlock);

    if (this.markerItems) {
      this.markerItems.forEach((mi) => {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = `${this.toolbarButtonStyleClass.name}`;
        buttonContainer.setAttribute('data-type-name', mi.typeName);
        buttonContainer.setAttribute('aria-label', mi.title);
        buttonContainer.setAttribute('title', mi.title);
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
        this.uiStyleSettings.toolbarButtonStyleColorsClassName
          ? this.uiStyleSettings.toolbarButtonStyleColorsClassName
          : this.toolbarButtonStyleColorsClass.name
      }`;
      this.overflowButton.innerHTML = OverflowIcon;
      this.overflowButton.addEventListener('click', this.overflowButtonClicked);
      this.markerButtonBlock.appendChild(this.overflowButton);
    }

    const resultButtonBlock = document.createElement('div');
    resultButtonBlock.className = this.toolbarBlockStyleClass.name;
    resultButtonBlock.style.whiteSpace = 'nowrap';
    resultButtonBlock.style.display =
      this.uiStyleSettings.resultButtonBlockVisible !== false ? '' : 'none';
    this.uiContainer.appendChild(resultButtonBlock);

    this.addActionButton(
      resultButtonBlock,
      CheckIcon,
      'render',
      'Save and close'
    );
    this.addActionButton(resultButtonBlock, CloseIcon, 'close', 'Close');

    this.markerjsContainer.appendChild(this.uiContainer);
    this.setCurrentMarker();
    this.adjustLayout();
    // setTimeout(this.adjustLayout, 10);
  }

  /**
   * Add a listener to the toolbar button click event.
   * @param listener
   */
  public setSelectMode(): void {
    this.resetButtonStyles();
    this.setActiveButton(this.buttons[0]);
  }
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

  /**
   * Adjusts toolbar layout.
   */
  public adjustLayout(): void {
    if (this.markerButtons && this.markerButtons.length > 0) {
      const numberToFit =
        Math.floor(
          this.markerButtonBlock.clientWidth /
            this.uiStyleSettings.toolbarHeight
        ) - 1;
      this.markerButtonBlock.innerHTML = '';
      this.markerButtonOverflowBlock.innerHTML = '';
      for (
        let buttonIndex = 0;
        buttonIndex < this.markerButtons.length;
        buttonIndex++
      ) {
        if (
          buttonIndex < numberToFit ||
          (buttonIndex === numberToFit &&
            this.markerButtons.length - 1 === numberToFit)
        ) {
          this.markerButtonBlock.appendChild(this.markerButtons[buttonIndex]);
        } else {
          if (buttonIndex === numberToFit) {
            this.markerButtonBlock.appendChild(this.overflowButton);
          }
          this.markerButtonOverflowBlock.appendChild(
            this.markerButtons[buttonIndex]
          );
        }
      }
    }
  }

  private overflowButtonClicked() {
    if (this.markerButtonOverflowBlock.style.display !== 'none') {
      this.markerButtonOverflowBlock.className =
        this.markerButtonOverflowBlock.className.replace(
          this.styles.fadeInAnimationClassName,
          ''
        );
      this.markerButtonOverflowBlock.style.display = 'none';
    } else {
      this.markerButtonOverflowBlock.className += ` ${this.styles.fadeInAnimationClassName}`;
      this.markerButtonOverflowBlock.style.top = `${
        this.uiContainer.offsetTop + this.overflowButton.offsetHeight
      }px`;
      this.markerButtonOverflowBlock.style.right = `${
        this.uiContainer.offsetWidth -
        this.overflowButton.offsetLeft -
        this.overflowButton.offsetWidth +
        this.uiContainer.offsetLeft * 2
      }px`;
      this.markerButtonOverflowBlock.style.display = 'inline-block';
    }
  }

  private resetButtonStyles() {
    this.buttons.forEach((button) => {
      button.className = button.className
        .replace(
          this.uiStyleSettings.toolbarButtonStyleColorsClassName
            ? this.uiStyleSettings.toolbarButtonStyleColorsClassName
            : this.toolbarButtonStyleColorsClass.name,
          ''
        )
        .trim();
      button.className = button.className
        .replace(
          this.uiStyleSettings.toolbarActiveButtonStyleColorsClassName
            ? this.uiStyleSettings.toolbarActiveButtonStyleColorsClassName
            : this.toolbarActiveButtonStyleColorsClass.name,
          ''
        )
        .trim();
      button.className += ` ${
        this.uiStyleSettings.toolbarButtonStyleColorsClassName
          ? this.uiStyleSettings.toolbarButtonStyleColorsClassName
          : this.toolbarButtonStyleColorsClass.name
      }`;
    });
  }

  private addActionButton(
    container: HTMLDivElement,
    icon: string,
    value: string,
    title: string
  ) {
    const actionButton = document.createElement('div');
    actionButton.className = `${this.toolbarButtonStyleClass.name}`;
    //  ${
    //   this.uiStyleSettings.toolbarButtonStyleColorsClassName ?
    //   this.uiStyleSettings.toolbarButtonStyleColorsClassName : this.toolbarButtonStyleColorsClass.name}`;
    actionButton.innerHTML = icon;
    actionButton.setAttribute('role', 'button');
    actionButton.setAttribute('data-action', value);
    actionButton.title = title;
    actionButton.setAttribute('aria-label', title);
    actionButton.addEventListener('click', () => {
      this.actionToolbarButtonClicked(actionButton, value);
    });
    switch (value) {
      case 'select':
        actionButton.style.fill = this.uiStyleSettings.selectButtonColor;
        actionButton.style.display = 'none';
        break;
      case 'delete':
        actionButton.style.display = 'none';
        break;
      case 'clear':
        actionButton.style.fill = this.uiStyleSettings.deleteButtonColor;
        break;
      case 'undo':
        actionButton.style.fill = this.uiStyleSettings.selectButtonColor;
        break;
      case 'redo':
        actionButton.style.fill = this.uiStyleSettings.selectButtonColor;
        break;
      case 'render':
        actionButton.style.fill = this.uiStyleSettings.okButtonColor;
        actionButton.style.display = 'none';
        break;
      case 'close':
        actionButton.style.fill = this.uiStyleSettings.closeButtonColor;
        actionButton.style.display = 'none';
        break;
    }

    container.appendChild(actionButton);
    this.buttons.push(actionButton);
  }

  private addStyles() {
    this.toolbarStyleClass = this.styles.addClass(
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
      ${
        this.displayMode === 'inline'
          ? `border-top-left-radius: ${Math.round(
              this.uiStyleSettings.toolbarHeight / 10
            )}px;`
          : ''
      }
      ${
        this.displayMode === 'inline'
          ? `border-top-right-radius: ${Math.round(
              this.uiStyleSettings.toolbarHeight / 10
            )}px;`
          : ''
      }
      overflow: hidden;
    `
      )
    );

    this.toolbarStyleColorsClass = this.styles.addClass(
      new StyleClass(
        'toolbar_colors',
        `
      background-color: ${this.uiStyleSettings.toolbarBackgroundColor};
      box-shadow: 0px 3px rgba(33, 33, 33, 0.1);
    `
      )
    );

    this.toolbarBlockStyleClass = this.styles.addClass(
      new StyleClass(
        'toolbar-block',
        `
        display: inline-block;
        box-sizing: content-box;
    `
      )
    );

    this.toolbarOverflowBlockStyleClass = this.styles.addClass(
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
    this.toolbarOverflowBlockStyleColorsClass = this.styles.addClass(
      new StyleClass(
        'toolbar-overflow-block_colors',
        `
        background-color: ${this.uiStyleSettings.toolbarBackgroundColor};
      `
      )
    );

    const buttonPadding = this.uiStyleSettings.toolbarHeight / 4;
    this.toolbarButtonStyleClass = this.styles.addClass(
      new StyleClass(
        'toolbar_button',
        `
      display: inline-block;
      width: ${this.uiStyleSettings.toolbarHeight - buttonPadding * 2}px;
      height: ${this.uiStyleSettings.toolbarHeight - buttonPadding * 2}px;
      padding: ${buttonPadding}px;
      box-sizing: content-box;
    `
      )
    );
    this.toolbarButtonStyleColorsClass = this.styles.addClass(
      new StyleClass(
        'toolbar_button_colors',
        `
      fill: ${this.uiStyleSettings.toolbarColor};
    `
      )
    );

    this.toolbarActiveButtonStyleColorsClass = this.styles.addClass(
      new StyleClass(
        'toolbar_active_button',
        `
      fill: ${this.uiStyleSettings.toolbarColor};
      background-color: ${this.uiStyleSettings.toolbarBackgroundHoverColor}
    `
      )
    );

    this.styles.addRule(
      new StyleRule(
        `.${this.toolbarButtonStyleClass.name} svg`,
        `
      height: ${this.uiStyleSettings.toolbarHeight / 2}px;
    `
      )
    );

    this.styles.addRule(
      new StyleRule(
        `.${this.toolbarButtonStyleColorsClass.name}:hover`,
        `
        background-color: ${this.uiStyleSettings.toolbarBackgroundHoverColor}
    `
      )
    );
  }

  private markerToolbarButtonClicked(
    button: HTMLDivElement,
    markerType: typeof MarkerBase
  ) {
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
      .replace(
        this.uiStyleSettings.toolbarButtonStyleColorsClassName
          ? this.uiStyleSettings.toolbarButtonStyleColorsClassName
          : this.toolbarButtonStyleColorsClass.name,
        ''
      )
      .trim();
    button.className += ` ${
      this.uiStyleSettings.toolbarActiveButtonStyleColorsClassName
        ? this.uiStyleSettings.toolbarActiveButtonStyleColorsClassName
        : this.toolbarActiveButtonStyleColorsClass.name
    }`;
  }

  /**
   * Selects toolbar button for a specified marker type.
   * @param typeName Marker type name
   *
   * @since 2.17.0
   */
  public setActiveMarkerButton(typeName: string): void {
    const activeBtn = this.markerButtons.find(
      (btn) => btn.getAttribute('data-type-name') === typeName
    );
    if (activeBtn) {
      this.setActiveButton(activeBtn);
    }
  }

  /**
   * Sets current marker and enables/disables action buttons accordingly.
   * @param marker
   */
  public setCurrentMarker(marker?: MarkerBase): void {
    this.currentMarker = marker;
    const activeMarkerButtons = this.buttons.filter((btn) =>
      /delete|notes/.test(btn.getAttribute('data-action'))
    );
    activeMarkerButtons.forEach((btn) => {
      if (this.currentMarker === undefined) {
        btn.style.fillOpacity = '0.4';
        btn.style.pointerEvents = 'none';
      } else {
        btn.style.fillOpacity = '1';
        btn.style.pointerEvents = 'all';
      }
    });
  }
}
