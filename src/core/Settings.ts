/**
 * Represents a list of colors.
 */
export type ColorSet = string[];

/**
 * marker.js 2 display mode - `inline` or `popup`.
 */
export type DisplayMode = 'inline' | 'popup';

/**
 * Default settings for marker.js 2 markers.
 */
export class Settings {
  /**
   * List of colors used in color pickers.
   */
  public defaultColorSet: ColorSet = [
    '#EF4444', // red
    '#10B981', // green
    '#2563EB', // blue
    '#FFFF00', // yellow
    '#7C3AED', // purple
    '#F472B6', // pink
    '#000000', // black
    '#FFFFFF' //white
  ];

  /**
   * Default foreground color.
   */
  public defaultColor = this.defaultColorSet[0];
  /**
   * Default fill color.
   */
  public defaultFillColor = this.defaultColorSet[0];
  /**
   * Default stroke color for markers with background (eg. {@link CalloutMarker}).
   */
  public defaultStrokeColor = this.defaultColorSet[7];
  /**
   * Default highlighter color.
   */
  public defaultHighlightColor = this.defaultColorSet[3];
  /**
   * Default stroke (line) width.
   */
  public defaultStrokeWidth = 3;
  /**
   * Default line dash array
   */
  public defaultStrokeDasharray = '';
  /**
   * Default opacity (alpha) of the {@link HighlightMarker} (and other highlighters).
   */
  public defaultHighlightOpacity = 0.5;
  /**
   * Default font family for text-based markers (eg. {@link TextMarker} and {@link CalloutMarker}).
   *
   */
  public defaultFontFamily = 'Helvetica, Arial, sans-serif';

  /**
   * Stroke (line) width options.
   */
  public defaultStrokeWidths = [1, 2, 3, 5, 10];
  
  /**
   * Stroke dash array options.
   */
  public defaultStrokeDasharrays = ['', '3', '12 3', '9 6 3 6'];

  /**
   * Opacity options.
   */
  public defaultOpacitySteps = [0.1, 0.25, 0.5, 0.75, 1];

  /**
   * Default display mode.
   */
  public displayMode: DisplayMode = 'inline';

  /**
   * Font family options.
   */
  public defaultFontFamilies = [
    'Times, "Times New Roman", serif',
    'Helvetica, Arial, sans-serif',
    'Courier, "Courier New", monospace',
    'cursive',
    'fantasy'
  ];

  /**
   * Margin in pixels between marker.js popup UI and window borders.
   */
  public popupMargin = 30;
}
