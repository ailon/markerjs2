import { MarkerBase } from './../core/MarkerBase';
import { Style, StyleClass, StyleRule } from './../core/Style';

export type ToolbarButtonType = 'action' | 'marker';

export type ToolbarButtonClickHandler = (
  buttonType: ToolbarButtonType,
  value?: typeof MarkerBase | string
) => void;

export class Toolbar {
  private markerItems: typeof MarkerBase[];

  private uiContainer: HTMLDivElement;
  private toolbarStyleClass: StyleClass;

  private buttonClickListeners: ToolbarButtonClickHandler[] = [];

  constructor(markerItems: typeof MarkerBase[]) {
    this.markerItems = markerItems;
    this.addStyles();
  }

  public show(): void {
    this.uiContainer = document.createElement('div');
    this.uiContainer.className = this.toolbarStyleClass.name;

    if (this.markerItems) {
      this.markerItems.forEach((mi) => {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.maxHeight = '20px';
        buttonContainer.innerHTML = mi.icon;
        buttonContainer.addEventListener('click', () => {
          this.markerToolbarButtonClicked(mi);
        });
        this.uiContainer.appendChild(buttonContainer);
      });
    }

    document.body.appendChild(this.uiContainer);
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

  private addStyles() {
    this.toolbarStyleClass = Style.addClass(
      new StyleClass(
        'toolbar',
        `
      position: fixed;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 20px;
      zIndex: 10000;
      background-color: #eeeeff;
      box-shadow: 0px 3px rgba(33, 33, 33, 0.1);
    `
      )
    );

    Style.addRule(
      new StyleRule(
        `.${this.toolbarStyleClass.name} svg`,
        `
      height: 20px;
    `
      )
    );
  }

  private markerToolbarButtonClicked(markerType: typeof MarkerBase) {
    if (this.buttonClickListeners && this.buttonClickListeners.length > 0) {
      this.buttonClickListeners.forEach((listener) =>
        listener('marker', markerType)
      );
    }
  }
}
