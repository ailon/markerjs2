/**
 * Describes customizable marker.js UI settings.
 */
export interface IStyleSettings {
  /**
   * Background color for the editor canvas when in popup mode.
   */
  canvasBackgroundColor?: string;
  /**
   * Background color of the toolbar block.
   */
  toolbarBackgroundColor?: string;
  /**
   * Background color of toolbar buttons on hover.
   */
  toolbarBackgroundHoverColor?: string;
  /**
   * Foreground color of toolbar icons.
   */
  toolbarColor?: string;
  /**
   * Base height of the toolbar block in pixels.
   */
  toolbarHeight?: number;
  /**
   * Background color of the toolbox (property panel) block.
   */
  toolboxBackgroundColor?: string;
  /**
   * Foreground color of toolbox buttons and objects.
   */
  toolboxColor?: string;
  /**
   * Accent color for selected toolbox objects.
   */
  toolboxAccentColor?: string;
  /**
   * CSS class name defining the visual style of the toolbar block.
   * 
   * _Note_: should only be used for colors and similar styles. Changing layout-related styles here can break the UI.
   */
  toolbarStyleColorsClassName?: string,
  /**
   * CSS class name defining the visual style of the toolbar overflow block. 
   * Displayed when markers don't fit in the main toolbar block.
   * 
   * _Note_: should only be used for colors and similar styles. Changing layout-related styles here can break the UI.
   */
  toolbarOverflowBlockStyleColorsClassName?: string,
  /**
   * CSS class name defining the visual style of the toolbar buttons.
   * 
   * _Note_: should only be used for colors and similar styles. Changing layout-related styles here can break the UI.
   */
  toolbarButtonStyleColorsClassName?: string,
  /**
   * CSS class name defining the visual style of the active (selected) toolbar button.
   * 
   * _Note_: should only be used for colors and similar styles. Changing layout-related styles here can break the UI.
   */
  toolbarActiveButtonStyleColorsClassName?: string,  
  /**
   * CSS class name defining the visual style of the toolbox (property panel) block.
   * 
   * _Note_: should only be used for colors and similar styles. Changing layout-related styles here can break the UI.
   */
  toolboxStyleColorsClassName?: string,
  /**
   * CSS class name defining the visual style of the toolbox buttons.
   * 
   * _Note_: should only be used for colors and similar styles. Changing layout-related styles here can break the UI.
   */
  toolboxButtonStyleColorsClassName?: string,
  /**
   * CSS class name defining the visual style of the active (selected) toolbox button.
   * 
   * _Note_: should only be used for colors and similar styles. Changing layout-related styles here can break the UI.
   */
  toolboxActiveButtonStyleColorsClassName?: string,
  /**
   * CSS class name defining the visual style of the panel containing toolbox buttons. 
   * That is the top level panel with buttons switching active toolbox panels.
   * 
   * _Note_: should only be used for colors and similar styles. Changing layout-related styles here can break the UI.
   */
  toolboxButtonRowStyleColorsClassName?: string,
  /**
   * CSS class name defining the visual style of the panel containing specific toolbox properties.
   * This is the popup panel that opens when a toolbox button is pressed.
   * 
   * _Note_: should only be used for colors and similar styles. Changing layout-related styles here can break the UI.
   */
  toolboxPanelRowStyleColorsClassName?: string
}
