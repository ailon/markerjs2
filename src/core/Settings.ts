export type ColorSet = string[];

export class Settings {
  public defaultFillColor = 'red';
  public defaultStrokeColor = 'red';
  public defaultStrokeWidth = 3;
  public defaultOpacity = 1;

  public defaultColorSet: ColorSet = [
    'red', 'green', 'blue', 'yellow', 'white', 'black', 'magenta', 'cyan'
  ];
}