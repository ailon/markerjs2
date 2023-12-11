import { IStyleSettings } from '../core/IStyleSettings';

/**
 * Base class for all toolbox property panels.
 */
export abstract class ToolboxPanel {
  protected _id?: string;
  /**
   * Panel ID.
   */
  public get id(): string | undefined {
    return this._id;
  }
  /**
   * Panel name/title.
   */
  public title: string;
  /**
   * Panel button icon as an SVG markup.
   */
  public icon: string;

  /**
   * UI style settings for colors, etc.
   */
  public uiStyleSettings: IStyleSettings;

  /**
   * Create panel with supplied title and icon.
   * @param title - panel name (used for accessibility)
   * @param icon - panel button icon (SVG image markup)
   */
  constructor(title: string, icon?: string) {
    this.title = title;
    this.icon = icon;
  }
  /**
   * Returns toolbox panel UI.
   */
  public abstract getUi(): HTMLDivElement;
}
