import { MarkerBase } from './../core/MarkerBase';
import { Style, StyleClass, StyleRule } from './../core/Style';

import CursorIcon from './toolbar-core-icons/cursor.svg';
import DeleteIcon from './toolbar-core-icons/delete.svg';
import CheckIcon from './toolbar-core-icons/check.svg';
import CloseIcon from './toolbar-core-icons/close.svg';

export type ToolbarButtonType = 'action' | 'marker';

export type ToolbarButtonClickHandler = (
  buttonType: ToolbarButtonType,
  value?: typeof MarkerBase | string
) => void;

export class Toolbar {
  private markerItems: typeof MarkerBase[];

  private buttons: HTMLDivElement[] = [];

  private markerjsContainer: HTMLDivElement;
  private uiContainer: HTMLDivElement;
  private toolbarStyleClass: StyleClass;
  private toolbarBlockStyleClass: StyleClass;
  private toolbarButtonStyleClass: StyleClass;
  private toolbarActiveButtonStyleClass: StyleClass;

  private buttonClickListeners: ToolbarButtonClickHandler[] = [];

  constructor(markerjsContainer: HTMLDivElement, markerItems: typeof MarkerBase[]) {
    this.markerjsContainer = markerjsContainer;
    this.markerItems = markerItems;
    this.addStyles();
  }

  public show(): void {
    this.uiContainer = document.createElement('div');
    this.uiContainer.className = this.toolbarStyleClass.name;

    const actionButtonBlock = document.createElement('div');
    actionButtonBlock.className = this.toolbarBlockStyleClass.name;
    this.uiContainer.appendChild(actionButtonBlock);

    this.addActionButton(actionButtonBlock, CursorIcon, 'select');
    this.addActionButton(actionButtonBlock, DeleteIcon, 'delete');

    const markerButtonBlock = document.createElement('div');
    markerButtonBlock.className = this.toolbarBlockStyleClass.name;
    this.uiContainer.appendChild(markerButtonBlock);

    if (this.markerItems) {
      this.markerItems.forEach((mi) => {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = this.toolbarButtonStyleClass.name;
        buttonContainer.innerHTML = mi.icon;
        buttonContainer.addEventListener('click', () => {
          this.markerToolbarButtonClicked(buttonContainer, mi);
        });
        markerButtonBlock.appendChild(buttonContainer);
        this.buttons.push(buttonContainer);
      });
    }

    const resultButtonBlock = document.createElement('div');
    resultButtonBlock.className = this.toolbarBlockStyleClass.name;
    this.uiContainer.appendChild(resultButtonBlock);

    this.addActionButton(resultButtonBlock, CheckIcon, 'check');
    this.addActionButton(resultButtonBlock, CloseIcon, 'close');

    this.markerjsContainer.appendChild(this.uiContainer);
    this.setSelectMode();
  }

  public addButtonClickListener(listener: ToolbarButtonClickHandler): void {
    this.buttonClickListeners.push(listener);
  }

  public removeButtonClickListener(listener: ToolbarButtonClickHandler): void {
    if (this.buttonClickListeners.indexOf(listener) > -1) {
      this.buttonClickListeners.splice(
        this.buttonClickListeners.indexOf(listener),
        1
      );
    }
  }

  public setSelectMode(): void {
    this.resetButtonStyles();
    this.setActiveButton(this.buttons[0]);
  }

  private resetButtonStyles() {
    this.buttons.forEach(button => {
      button.className = button.className
        .replace(this.toolbarActiveButtonStyleClass.name, '')
        .trim();
    });
  }

  private addActionButton(container: HTMLDivElement, icon: string, value: string) {
    const actionButton = document.createElement('div');
    actionButton.className = this.toolbarButtonStyleClass.name;
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
      display: flex;
      flex-direction: row;
      justify-content: space-between;      
      height: ${Style.settings.toolbarHeight}px;
      background-color: ${Style.settings.toolbarBackgroundColor};
      box-shadow: 0px 3px rgba(33, 33, 33, 0.1);
    `
      )
    );

    this.toolbarBlockStyleClass = Style.addClass(
      new StyleClass(
        'toolbar-block',
        `
        display: inline-block;
    `
      )
    );

    const buttonPadding = Style.settings.toolbarHeight / 4;
    this.toolbarButtonStyleClass = Style.addClass(new StyleClass('toolbar_button', `
      display: inline-block;
      width: ${Style.settings.toolbarHeight - buttonPadding * 2}px;
      height: ${Style.settings.toolbarHeight - buttonPadding * 2}px;
      padding: ${buttonPadding}px;
    `))

    this.toolbarActiveButtonStyleClass = Style.addClass(new StyleClass('toolbar_active_button', `
      background-color: ${Style.settings.toolbarBackgroundHoverColor}
    `));

    Style.addRule(
      new StyleRule(
        `.${this.toolbarButtonStyleClass.name} svg`,
        `
      fill: ${Style.settings.toolbarColor};
      height: ${Style.settings.toolbarHeight / 2}px;
    `
      )
    );

    Style.addRule(
      new StyleRule(
        `.${this.toolbarButtonStyleClass.name}:hover`,
        `
        background-color: ${Style.settings.toolbarBackgroundHoverColor}
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
  }

  private actionToolbarButtonClicked(button: HTMLDivElement, action: string) {
    this.setActiveButton(button);
    if (this.buttonClickListeners && this.buttonClickListeners.length > 0) {
      this.buttonClickListeners.forEach((listener) =>
        listener('action', action)
      );
    }
  }

  private setActiveButton(button: HTMLDivElement) {
    this.resetButtonStyles();
    button.className += ' ' + this.toolbarActiveButtonStyleClass.name;
  }
}
