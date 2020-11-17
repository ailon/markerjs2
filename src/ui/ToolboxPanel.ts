export abstract class ToolboxPanel {
  public title: string;
  public icon: string;
  constructor(title: string, icon?: string) {
    this.title = title;
    this.icon = icon;
  }
  public abstract getUi(): HTMLDivElement;
}