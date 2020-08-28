export class SvgHelper {
  public static createDefs(): SVGDefsElement {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    return defs;
  }

  public static setAttributes(
    el: SVGElement,
    attributes: Array<[string, string]>
  ): void {
    for (const [attr, value] of attributes) {
      el.setAttribute(attr, value);
    }
  }

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

  public static createGroup(attributes?: Array<[string, string]>): SVGGElement {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    if (attributes) {
      SvgHelper.setAttributes(g, attributes);
    }
    return g;
  }

  public static createTransform(): SVGTransform {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    return svg.createSVGTransform();
  }

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
}
