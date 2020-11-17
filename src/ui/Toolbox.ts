import { ToolboxPanel } from './ToolboxPanel';
import { Style, StyleClass, StyleRule } from './../core/Style';

export class Toolbox {
  private panels: ToolboxPanel[] = [];
  // private activePanel: ToolboxPanel;
  private panelButtons: HTMLDivElement[] = [];

  private markerjsContainer: HTMLDivElement;
  private uiContainer: HTMLDivElement;
  private buttonRow: HTMLDivElement;
  private panelRow: HTMLDivElement;

  private toolboxStyleClass: StyleClass;
  private toolboxButtonStyleClass: StyleClass;
  private toolboxActiveButtonStyleClass: StyleClass;
  private toolboxButtonRowStyleClass: StyleClass;
  private toolboxPanelRowStyleClass: StyleClass;
  
  private addStyles() {
    this.toolboxStyleClass = Style.addClass(
      new StyleClass(
        'toolbox',
        `
      width: 100%;
      display: flex;
      flex-direction: column;
      height: ${Style.settings.toolbarHeight * 2.5}px;
      background-color: ${Style.settings.toolbarBackgroundColor};
      box-shadow: 0px 3px rgba(33, 33, 33, 0.1);
      color: ${Style.settings.toolboxColor};
      font-family: sans-serif;
    `
      )
    );
    
    const buttonPadding = Style.settings.toolbarHeight / 4;
    this.toolboxButtonRowStyleClass = Style.addClass(new StyleClass('toolbox_button_row', `
      display: flex;
      cursor: default;
    `));
    this.toolboxPanelRowStyleClass = Style.addClass(new StyleClass('toolbox_panel_row', `
      display: flex;
      cursor: default;
      background-color: ${Style.settings.toolbarBackgroundHoverColor};
      height: ${Style.settings.toolbarHeight * 1.5}px;
    `));

    this.toolboxButtonStyleClass = Style.addClass(new StyleClass('toolbox_button', `
      display: inline-block;
      width: ${Style.settings.toolbarHeight - buttonPadding * 2}px;
      height: ${Style.settings.toolbarHeight - buttonPadding * 2}px;
      padding: ${buttonPadding}px;
    `));

    this.toolboxActiveButtonStyleClass = Style.addClass(new StyleClass('toolbox_active_button', `
      background-color: ${Style.settings.toolbarBackgroundHoverColor}
    `));

    Style.addRule(
      new StyleRule(
        `.${this.toolboxButtonStyleClass.name}:hover`,
        `
        background-color: ${Style.settings.toolbarBackgroundHoverColor}
    `
      )
    );

    Style.addRule(
      new StyleRule(
        `.${this.toolboxButtonStyleClass.name} svg`,
        `
      fill: ${Style.settings.toolbarColor};
      height: ${Style.settings.toolbarHeight / 2}px;
    `
      )
    );

  }

  constructor(markerjsContainer: HTMLDivElement) {
    this.markerjsContainer = markerjsContainer;

    this.showPanel = this.showPanel.bind(this);

    this.addStyles();
  }

  public show(): void {
    this.uiContainer = document.createElement('div');
    this.uiContainer.className = this.toolboxStyleClass.name;

    this.markerjsContainer.appendChild(this.uiContainer);
  }

  public setPanelButtons(panels: ToolboxPanel[]): void {
    this.panels = panels;
    if (this.uiContainer !== undefined) {
      this.uiContainer.innerHTML = '';

      this.buttonRow = document.createElement('div');
      this.buttonRow.className = this.toolboxButtonRowStyleClass.name;
      this.uiContainer.appendChild(this.buttonRow);
      this.panelRow = document.createElement('div');
      this.panelRow.className = this.toolboxPanelRowStyleClass.name;
      this.uiContainer.appendChild(this.panelRow);

      this.panelButtons.splice(0);

      this.panels.forEach(panel => {
        const panelBtnDiv = document.createElement('div');
        panelBtnDiv.className = this.toolboxButtonStyleClass.name;
        panelBtnDiv.innerHTML = panel.icon;
        panelBtnDiv.title = panel.title;
        panelBtnDiv.addEventListener('click', () => {
          this.showPanel(panel);
        })
        this.panelButtons.push(panelBtnDiv);
        this.buttonRow.appendChild(panelBtnDiv);
      });
    }
    if (this.panels.length > 0) {
      // this.showPanel(this.activePanel ? this.activePanel : this.panels[0]);
      this.showPanel(this.panels[0]);
    }
  }

  private showPanel(panel: ToolboxPanel) {
    this.panelRow.innerHTML = '';
    const panelIndex = this.panels.indexOf(panel);
    this.panelButtons.forEach((pb, index) => {
      pb.className =
        index === panelIndex
          ? `${this.toolboxButtonStyleClass.name} ${this.toolboxActiveButtonStyleClass.name}`
          : this.toolboxButtonStyleClass.name;
    })
    const panelUI = panel.getUi();
    panelUI.style.margin = `${Style.settings.toolbarHeight / 4}px`;
    this.panelRow.appendChild(panelUI);
    // this.activePanel = panel;
  }

}