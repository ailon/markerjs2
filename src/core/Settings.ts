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
    '#FFFFFF', //white
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
    'fantasy',
  ];

  /**
   * Margin in pixels between marker.js popup UI and window borders.
   */
  public popupMargin = 30;

  /**
   * Create a new Freehand marker for every stroke.
   */
  public newFreehandMarkerOnPointerUp = false;

  /**
   * If set to true, when colors on a marker are changed
   * it changes the default color for other markers as well.
   *
   * @since 2.7.0
   */
  public defaultColorsFollowCurrentColors = false;

  /**
   * Increase this setting for smoother FreehandMarker lines.
   * Note that it will also take more space when you save the state.
   *
   * @since 2.20.0
   */
  public freehandPixelRatio = 1;

  /**
   * When set to true rotation feature is disabled on markers.
   * This doesn't affect markers restored from a previously saved state.
   *
   * @since 2.22.0
   */
  public disableRotation = false;

  /**
   * If set, the UI will be offset by the specified value,
   * otherwise it will be offset by -toolbarHeight or 0 if
   * there's less space than toolbarHeight on top.
   *
   * Use this if you want to control the position inside a
   * `position: relative` parent, as auto-calculation
   * will calculate available space from the relative
   * container and not the whole page.
   *
   * Common usage when used with a relatively positioned parent would be:
   *
   * ```typescript
   * markerArea.targetRoot = document.getElementById('relativeParent');
   * markerArea.settings.uiOffsetTop = -markerArea.styles.settings.toolbarHeight;
   * ```
   * This would ensure that the toolbar is placed above the image
   * even if the image's offset from the relative parent is 0.
   *
   * @since 2.28.0
   */
  public uiOffsetTop?: number;

  /**
   * If set, the UI will be offset by the specified number of pixels on the left.
   *
   * @since 2.31.0
   */
  public uiOffsetLeft?: number;

  /**
   * Default font size for the `CaptionFrameMarker`
   *
   * @since 2.29.0
   */
  public defaultCaptionFontSize = '1rem';
  /**
   * Default caption text for the `CaptionFrameMarker`
   *
   * @since 2.29.0
   */
  public defaultCaptionText = 'Text';
  /**
   * Enable word wrapping in text markers (`TextMarker`, `CalloutMarker`)
   *
   * @since 2.30.0
   */
  public wrapText = false;
  /**
   * Default text for the `TextMarker` based markers
   *
   * @since 2.32.0
   */
  public defaultText = 'Your text here';
}
