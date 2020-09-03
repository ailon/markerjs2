import { MarkerBase } from './../core/MarkerBase';
import { Style, StyleClass, StyleRule } from './../core/Style';

export class Toolbar {
  private markerItems: typeof MarkerBase[];
  
  private uiContainer: HTMLDivElement;
  private toolbarStyleClass: StyleClass;

  constructor(markerItems: typeof MarkerBase[]) {
    this.markerItems = markerItems;
    this.addStyles();
  }


  public show(): void {
    this.uiContainer = document.createElement('div');
    this.uiContainer.className = this.toolbarStyleClass.name;

    if (this.markerItems) {
      this.markerItems.forEach(mi => {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.maxHeight = '20px';
        buttonContainer.innerHTML = mi.icon;
        this.uiContainer.appendChild(buttonContainer);
      })
    }

    document.body.appendChild(this.uiContainer);
  }

  private addStyles() {
    this.toolbarStyleClass = Style.addClass(new StyleClass('toolbar', `
      position: fixed;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 20px;
      zIndex: 10000;
      background-color: #eeeeff;
      box-shadow: 0px 3px rgba(33, 33, 33, 0.1);
    `));

    Style.addRule(new StyleRule(`.${this.toolbarStyleClass.name} svg`, `
      height: 20px;
    `));
  }
}
