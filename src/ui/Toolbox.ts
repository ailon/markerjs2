import { ToolboxPanel } from './ToolboxPanel';
import { Style, StyleClass, StyleRule } from './../core/Style';

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
      width: 200px;
      height: 100%;
      background-color: ${Style.settings.toolboxBackgroundColor};
      box-shadow: 0px 3px rgba(33, 33, 33, 0.1);
      color: ${Style.settings.toolboxColor};
      font-family: sans-serif;
    `
      )
    );

    Style.addRule(
      new StyleRule(
        `.${this.toolboxStyleClass.name} h3`,
        `
      margin: 10px 0px;
      font-size: 1.1em;
      font-weight: normal;
    `
      )
    );

    Style.addRule(
      new StyleRule(
        `.${this.toolboxStyleClass.name} hr`,
        `
      border: 0px;
      border-top: 1px dotted ${Style.settings.toolboxColor};
      opacity: 0.3;
      margin: 10px;
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
      this.panels.forEach((panel, index) => {
        const panelDiv = document.createElement('div');
        panelDiv.style.margin = '5px 10px';
        const panelHeader = document.createElement('h3')
        panelHeader.innerText = panel.title;
        panelDiv.appendChild(panelHeader);
        panelDiv.appendChild(panel.getUi());
        this.uiContainer.appendChild(panelDiv);

        if (index < this.panels.length - 1) {
          const separator = document.createElement('hr');
          this.uiContainer.appendChild(separator);
        }
      });
    }
  }

}