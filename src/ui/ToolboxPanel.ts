export abstract class ToolboxPanel {
  public title: string;
  constructor(title: string) {
    this.title = title;
  }
  public abstract getUi(): HTMLDivElement;
}