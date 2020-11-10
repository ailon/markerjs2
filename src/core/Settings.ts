export type ColorSet = string[];
export type DisplayMode = 'inline' | 'popup';

export class Settings {
  public defaultFillColor = 'red';
  public defaultStrokeColor = 'red';
  public defaultStrokeWidth = 3;
  public defaultHighlightOpacity = 0.5;
  public defaultFontFamily = 'Helvetica, Arial, sans-serif';
  public defaultHighlightColor = 'yellow';

  public defaultColorSet: ColorSet = [
    'red', 'green', 'blue', 'yellow', 'white', 'black', 'magenta', 'cyan'
  ];

  public defaultStrokeWidths = [1, 2, 3, 5, 10];

  public defaultOpacitySteps = [0.1, 0.25, 0.5, 0.75, 1];

  public displayMode: DisplayMode = 'inline';

  public defaultFontFamilies = [
    'Times, "Times New Roman", serif',
    'Helvetica, Arial, sans-serif',
    'Courier, "Courier New", monospace',
    'cursive',
    'fantasy'
  ]
}