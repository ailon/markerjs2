export type ColorSet = string[];
export type DisplayMode = 'inline' | 'popup';

export class Settings {
  public defaultFillColor = 'red';
  public defaultStrokeColor = 'red';
  public defaultStrokeWidth = 3;
  public defaultOpacity = 1;
  public defaultFontFamily = 'Helvetica, Arial, sans-serif';

  public defaultColorSet: ColorSet = [
    'red', 'green', 'blue', 'yellow', 'white', 'black', 'magenta', 'cyan'
  ];

  public defaultStrokeWidths = [1, 2, 3, 5, 10];

  public displayMode: DisplayMode = 'inline';

  public defaultFontFamilies = [
    'Times, "Times New Roman", serif',
    'Helvetica, Arial, sans-serif',
    'Courier, "Courier New", monospace',
    'cursive',
    'fantasy'
  ]
}