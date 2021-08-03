/**
 * Utility class to simplify SVG operations.
 */
export class SvgHelper {
  /**
   * Creates SVG "defs".
   */
  public static createDefs(): SVGDefsElement {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    return defs;
  }

  /**
   * Sets attributes on an arbitrary SVG element
   * @param el - target SVG element.
   * @param attributes - set of name-value attribute pairs.
   */
  public static setAttributes(
    el: SVGElement,
    attributes: Array<[string, string]>
  ): void {
    for (const [attr, value] of attributes) {
      el.setAttribute(attr, value);
    }
  }

  /**
   * Creates an SVG rectangle with the specified width and height.
   * @param width 
   * @param height 
   * @param attributes - additional attributes.
   */
  public static createRect(
    width: number | string,
    height: number | string,
    attributes?: Array<[string, string]>
  ): SVGRectElement {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    rect.setAttribute('width', width.toString());
    rect.setAttribute('height', height.toString());
    if (attributes) {
      SvgHelper.setAttributes(rect, attributes);
    }

    return rect;
  }

  /**
   * Creates an SVG line with specified end-point coordinates.
   * @param x1 
   * @param y1 
   * @param x2 
   * @param y2 
   * @param attributes - additional attributes.
   */
  public static createLine(
    x1: number | string,
    y1: number | string,
    x2: number | string,
    y2: number | string,
    attributes?: Array<[string, string]>
  ): SVGLineElement {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

    line.setAttribute('x1', x1.toString());
    line.setAttribute('y1', y1.toString());
    line.setAttribute('x2', x2.toString());
    line.setAttribute('y2', y2.toString());
    if (attributes) {
      SvgHelper.setAttributes(line, attributes);
    }

    return line;
  }

  /**
   * Creates an SVG polygon with specified points.
   * @param points - points as string.
   * @param attributes - additional attributes.
   */
  public static createPolygon(
    points: string,
    attributes?: Array<[string, string]>
  ): SVGPolygonElement {
    const polygon = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polygon'
    );

    polygon.setAttribute('points', points);
    if (attributes) {
      SvgHelper.setAttributes(polygon, attributes);
    }

    return polygon;
  }

  /**
   * Creates an SVG circle with the specified radius.
   * @param radius 
   * @param attributes - additional attributes.
   */
  public static createCircle(
    radius: number,
    attributes?: Array<[string, string]>
  ): SVGCircleElement {
    const circle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );

    circle.setAttribute('cx', (radius / 2).toString());
    circle.setAttribute('cy', (radius / 2).toString());
    circle.setAttribute('r', radius.toString());
    if (attributes) {
      SvgHelper.setAttributes(circle, attributes);
    }

    return circle;
  }

  /**
   * Creates an SVG ellipse with the specified horizontal and vertical radii.
   * @param rx 
   * @param ry 
   * @param attributes - additional attributes.
   */
  public static createEllipse(
    rx: number,
    ry: number,
    attributes?: Array<[string, string]>
  ): SVGEllipseElement {
    const ellipse = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'ellipse'
    );

    ellipse.setAttribute('cx', (rx / 2).toString());
    ellipse.setAttribute('cy', (ry / 2).toString());
    ellipse.setAttribute('rx', (rx / 2).toString());
    ellipse.setAttribute('ry', (ry / 2).toString());
    if (attributes) {
      SvgHelper.setAttributes(ellipse, attributes);
    }

    return ellipse;
  }

  /**
   * Creates an SVG group.
   * @param attributes - additional attributes.
   */
  public static createGroup(attributes?: Array<[string, string]>): SVGGElement {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    if (attributes) {
      SvgHelper.setAttributes(g, attributes);
    }
    return g;
  }

  /**
   * Creates an SVG transform.
   */
  public static createTransform(): SVGTransform {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    return svg.createSVGTransform();
  }

  /**
   * Creates an SVG marker.
   * @param id 
   * @param orient 
   * @param markerWidth 
   * @param markerHeight 
   * @param refX 
   * @param refY 
   * @param markerElement 
   */
  public static createMarker(
    id: string,
    orient: string,
    markerWidth: number | string,
    markerHeight: number | string,
    refX: number | string,
    refY: number | string,
    markerElement: SVGGraphicsElement
  ): SVGMarkerElement {
    const marker = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'marker'
    );
    SvgHelper.setAttributes(marker, [
      ['id', id],
      ['orient', orient],
      ['markerWidth', markerWidth.toString()],
      ['markerHeight', markerHeight.toString()],
      ['refX', refX.toString()],
      ['refY', refY.toString()],
    ]);

    marker.appendChild(markerElement);

    return marker;
  }

  /**
   * Creaes an SVG text element.
   * @param attributes - additional attributes.
   */
  public static createText(
    attributes?: Array<[string, string]>
  ): SVGTextElement {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '0');
    text.setAttribute('y', '0');

    if (attributes) {
      SvgHelper.setAttributes(text, attributes);
    }

    return text;
  }

  /**
   * Creates an SVG TSpan.
   * @param text - inner text.
   * @param attributes - additional attributes.
   */
  public static createTSpan(
    text: string,
    attributes?: Array<[string, string]>
  ): SVGTSpanElement {
    const tspan = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'tspan'
    );
    tspan.textContent = text;

    if (attributes) {
      SvgHelper.setAttributes(tspan, attributes);
    }

    return tspan;
  }

  /**
   * Creates an SVG image element.
   * @param attributes - additional attributes.
   */
  public static createImage(
    attributes?: Array<[string, string]>
  ): SVGImageElement {
    const image = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'image'
    );

    if (attributes) {
      SvgHelper.setAttributes(image, attributes);
    }

    return image;
  }

  /**
   * Creates an SVG point with the specified coordinates.
   * @param x 
   * @param y 
   */
  public static createPoint(      
    x: number,
    y: number
  ): SVGPoint {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const svgPoint = svg.createSVGPoint();
      svgPoint.x = x;
      svgPoint.y = y;
  
      return svgPoint;
  }

  /**
   * Creates an SVG path with the specified shape (d).
   * @param d - path shape
   * @param attributes - additional attributes.
   */
   public static createPath(
    d: string,
    attributes?: Array<[string, string]>
  ): SVGPathElement {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    path.setAttribute('d', d);
    if (attributes) {
      SvgHelper.setAttributes(path, attributes);
    }

    return path;
  }
}
