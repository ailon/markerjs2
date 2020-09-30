import { ToolboxPanel } from './ToolboxPanel';
import { Style, StyleClass } from './../core/Style';

export class Toolbox {
  private panels: ToolboxPanel[] = [];
  private markerjsContainer: HTMLDivElement;
  private uiContainer: HTMLDivElement;
  private toolboxStyleClass: StyleClass;
  
  private addStyles() {
    this.toolboxStyleClass = Style.addClass(
      new StyleClass(
        'toolbox',
        `
      width: 100%;
      height: 20px;
      background-color: #eeeeff;
      box-shadow: 0px 3px rgba(33, 33, 33, 0.1);
    `
      )
    );
  }

  constructor(markerjsContainer: HTMLDivElement) {
    this.markerjsContainer = markerjsContainer;
    this.addStyles();
  }

  public show(): void {
    this.uiContainer = document.createElement('div');
    this.uiContainer.className = this.toolboxStyleClass.name;

    this.markerjsContainer.appendChild(this.uiContainer);
  }

  public setPanels(panels: ToolboxPanel[]): void {
    this.panels = panels;
    if (this.uiContainer !== undefined) {
      this.uiContainer.innerHTML = '';
      this.panels.forEach(panel => this.uiContainer.appendChild(panel.getUi()));
    }
  }

}