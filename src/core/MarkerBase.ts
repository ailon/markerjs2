export abstract class MarkerBase {
  protected container: SVGGElement;

  public static title: string;
  /**
   * SVG icon markup
   */
  public static icon: string;

  constructor(container: SVGGElement) {
    this.container = container;
  }
}