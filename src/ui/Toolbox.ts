import { ToolboxPanel } from './ToolboxPanel';
import { Style, StyleClass, StyleRule } from './../core/Style';
import { DisplayMode } from '../core/Settings';

export class Toolbox {
  private panels: ToolboxPanel[] = [];
  private activePanel: ToolboxPanel;
  private panelButtons: HTMLDivElement[] = [];

  private markerjsContainer: HTMLDivElement;
  private displayMode: DisplayMode;
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
      color: ${Style.settings.toolboxColor};
      font-family: sans-serif;
      ${this.displayMode === 'popup' ? 'height:' + Style.settings.toolbarHeight * 2.5 + 'px;' : ''}
      box-sizing: content-box;
    `
      )
    );
    
    const buttonPadding = Style.settings.toolbarHeight / 4;
    this.toolboxButtonRowStyleClass = Style.addClass(new StyleClass('toolbox_button_row', `
      display: flex;
      cursor: default;
      background-color: ${Style.settings.toolbarBackgroundColor};
      box-sizing: content-box;
    `));
    this.toolboxPanelRowStyleClass = Style.addClass(new StyleClass('toolbox_panel_row', `
      display: flex;
      ${this.displayMode === 'inline' ? 'position: absolute;' : '' }
      ${this.displayMode === 'inline' ? 'bottom: ' + Style.settings.toolbarHeight + 'px;' : '' }
      cursor: default;
      background-color: ${Style.settings.toolbarBackgroundHoverColor};
      height: ${Style.settings.toolbarHeight * 1.5}px;
      ${this.displayMode === 'inline' ? 'width: 100%;' : ''}
      box-sizing: content-box;
    `));

    this.toolboxButtonStyleClass = Style.addClass(new StyleClass('toolbox_button', `
      display: inline-block;
      width: ${Style.settings.toolbarHeight - buttonPadding * 2}px;
      height: ${Style.settings.toolbarHeight - buttonPadding * 2}px;
      padding: ${buttonPadding}px;
      box-sizing: content-box;
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

  constructor(markerjsContainer: HTMLDivElement, displayMode: DisplayMode) {
    this.markerjsContainer = markerjsContainer;
    this.displayMode = displayMode;

    this.panelButtonClick = this.panelButtonClick.bind(this);

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

      this.panelRow = document.createElement('div');
      this.panelRow.className = this.toolboxPanelRowStyleClass.name;
      this.uiContainer.appendChild(this.panelRow);
      this.buttonRow = document.createElement('div');
      this.buttonRow.className = this.toolboxButtonRowStyleClass.name;
      this.uiContainer.appendChild(this.buttonRow);

      this.panelButtons.splice(0);

      this.panels.forEach(panel => {
        const panelBtnDiv = document.createElement('div');
        panelBtnDiv.className = this.toolboxButtonStyleClass.name;
        panelBtnDiv.innerHTML = panel.icon;
        panelBtnDiv.title = panel.title;
        panelBtnDiv.addEventListener('click', () => {
          this.panelButtonClick(panel);
        })
        this.panelButtons.push(panelBtnDiv);
        this.buttonRow.appendChild(panelBtnDiv);
      });
      if (this.displayMode === 'inline') {
        this.panelRow.style.display = 'none';
      } else {
        this.panelRow.style.visibility = 'hidden';
      }
    }
    // if (this.displayMode === 'popup' && this.panels.length > 0) {
    //   // this.showPanel(this.activePanel ? this.activePanel : this.panels[0]);
    //   this.panelButtonClick(this.panels[0]);
    // }
  }

  private panelButtonClick(panel: ToolboxPanel) {
    let panelIndex = -1; 
    if (panel !== this.activePanel) {
      panelIndex = this.panels.indexOf(panel);
      this.panelRow.innerHTML = '';
      const panelUI = panel.getUi();
      panelUI.style.margin = `${Style.settings.toolbarHeight / 4}px`;
      this.panelRow.appendChild(panelUI);
      this.panelRow.style.display = 'flex';
      this.panelRow.style.visibility = 'visible';
      this.activePanel = panel;
    } else {
      this.activePanel = undefined;
      // hide panel
      if (this.displayMode === 'inline') {
        this.panelRow.style.display = 'none';
      } else {
        this.panelRow.style.visibility = 'hidden';
      }
    }
    this.panelButtons.forEach((pb, index) => {
      pb.className =
        index === panelIndex
          ? `${this.toolboxButtonStyleClass.name} ${this.toolboxActiveButtonStyleClass.name}`
          : this.toolboxButtonStyleClass.name;
    });
  }

}