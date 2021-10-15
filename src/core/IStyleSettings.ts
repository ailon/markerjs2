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
   * If set to true, the toolbar is hidden.
   */
  hideToolbar?: boolean;
  /**
   * If set to true, the toolbox is hidden.
   */
  hideToolbox?: boolean;
  /**
   * Is undo button visible?
   * 
   * @since 2.6.0
   */
  undoButtonVisible?: boolean;
  /**
   * Is redo button visible?
   * 
   * @since 2.6.0
   */
  redoButtonVisible?: boolean;
  /**
   * Is notes button visible?
   * 
   * @since 2.10.0
   */
  notesButtonVisible?: boolean;
  /**
   * Is zoom button visible?
   * 
   * @since 2.12.0
   */
  zoomButtonVisible?: boolean;
  /**
   * Is zoom out button visible?
   * 
   * @since 2.13.0
   */
  zoomOutButtonVisible?: boolean;
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
   * Custom icon color for the select (pointer) toolbar button
   */
  selectButtonColor?: string;
  /**
   * Custom icon color for the delete toolbar button
   */
  deleteButtonColor?: string;
  /**
   * Custom icon color for the OK (render) toolbar button
   */
  okButtonColor?: string;
  /**
   * Custom icon color for the close (cancel) toolbar button
   */
  closeButtonColor?: string;
  /**
   * CSS class name defining the visual style of the toolbar block.
   * 
   * _Note_: should only be used for colors and similar styles. Changing layout-related styles here can break the UI.
   */
  toolbarStyleColorsClassName?: string;
  /**
   * CSS class name defining the visual style of the toolbar overflow block. 
   * Displayed when markers don't fit in the main toolbar block.
   * 
   * _Note_: should only be used for colors and similar styles. Changing layout-related styles here can break the UI.
   */
  toolbarOverflowBlockStyleColorsClassName?: string;
  /**
   * CSS class name defining the visual style of the toolbar buttons.
   * 
   * _Note_: should only be used for colors and similar styles. Changing layout-related styles here can break the UI.
   */
  toolbarButtonStyleColorsClassName?: string;
  /**
   * CSS class name defining the visual style of the active (selected) toolbar button.
   * 
   * _Note_: should only be used for colors and similar styles. Changing layout-related styles here can break the UI.
   */
  toolbarActiveButtonStyleColorsClassName?: string;  
  /**
   * CSS class name defining the visual style of the toolbox (property panel) block.
   * 
   * _Note_: should only be used for colors and similar styles. Changing layout-related styles here can break the UI.
   */
  toolboxStyleColorsClassName?: string;
  /**
   * CSS class name defining the visual style of the toolbox buttons.
   * 
   * _Note_: should only be used for colors and similar styles. Changing layout-related styles here can break the UI.
   */
  toolboxButtonStyleColorsClassName?: string;
  /**
   * CSS class name defining the visual style of the active (selected) toolbox button.
   * 
   * _Note_: should only be used for colors and similar styles. Changing layout-related styles here can break the UI.
   */
  toolboxActiveButtonStyleColorsClassName?: string;
  /**
   * CSS class name defining the visual style of the panel containing toolbox buttons. 
   * That is the top level panel with buttons switching active toolbox panels.
   * 
   * _Note_: should only be used for colors and similar styles. Changing layout-related styles here can break the UI.
   */
  toolboxButtonRowStyleColorsClassName?: string;
  /**
   * CSS class name defining the visual style of the panel containing specific toolbox properties.
   * This is the popup panel that opens when a toolbox button is pressed.
   * 
   * _Note_: should only be used for colors and similar styles. Changing layout-related styles here can break the UI.
   */
  toolboxPanelRowStyleColorsClassName?: string;

  /**
   * CSS class name defining the visual style of the note editing text area.
   * 
   * @since 2.10.0
   */
  notesAreaStyleClassName?: string;

  /**
   * Position logo in the free version on the bottom left or right of the marker area. Default - left.
   * 
   * @since 2.14.0
   */
  logoPosition?: 'left' | 'right';

  /**
   * zIndex for the marker.js UI.
   * 
   * Defaults to 5 in inline mode and 1000 in popup mode.
   * 
   * @since 2.15.0
   */
  zIndex?: string;
}
