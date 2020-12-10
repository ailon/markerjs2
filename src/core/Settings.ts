export type ColorSet = string[];
export type DisplayMode = 'inline' | 'popup';

export class Settings {
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

  public defaultColor = this.defaultColorSet[0];
  public defaultFillColor = this.defaultColorSet[0];
  public defaultStrokeColor = this.defaultColorSet[7];
  public defaultHighlightColor = this.defaultColorSet[3];
  public defaultStrokeWidth = 3;
  public defaultStrokeDasharray = '';
  public defaultHighlightOpacity = 0.5;
  public defaultFontFamily = 'Helvetica, Arial, sans-serif';

  public defaultStrokeWidths = [1, 2, 3, 5, 10];

  public defaultStrokeDasharrays = ['', '3', '12 3', '9 6 3 6'];

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