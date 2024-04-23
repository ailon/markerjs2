/**
 * Renders the original image and markup to a flat raster image.
 */
export class Renderer {
  /**
   * Whether the image should be rendered at the original (natural) target image size.
   */
  public naturalSize = false;
  /**
   * Rendered image type (`image/png`, `image/jpeg`, etc.).
   */
  public imageType = 'image/png';
  /**
   * For formats that support it, specifies rendering quality.
   *
   * In the case of `image/jpeg` you can specify a value between 0 and 1 (lowest to highest quality).
   *
   * @type {number} - image rendering quality (0..1)
   */
  public imageQuality?: number;
  /**
   * When set to true, only the marker layer without the original image will be rendered.
   */
  public markersOnly = false;

  /**
   * When set and {@linkcode naturalSize} is `false` sets the width of the rendered image.
   *
   * Both `width` and `height` have to be set for this to take effect.
   */
  public width?: number;
  /**
   * When set and {@linkcode naturalSize} is `false` sets the height of the rendered image.
   *
   * Both `width` and `height` have to be set for this to take effect.
   */
  public height?: number;

  /**
   * Initiates rendering of the result image and returns a promise which when resolved
   * contains a data URL for the rendered image.
   *
   * @param target - target (underlying original) image
   * @param markerImage - marker layer
   */
  public rasterize(
    target: HTMLImageElement,
    markerImage: SVGSVGElement,
    targetCanvas?: HTMLCanvasElement
  ): Promise<string> {
    return new Promise<string>((resolve) => {
      const canvas =
        targetCanvas !== undefined
          ? targetCanvas
          : document.createElement('canvas');

      if (target === null) {
        this.markersOnly = true;
        this.naturalSize = false;
      }

      const markerImageCopy = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
      );
      markerImageCopy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      markerImageCopy.setAttribute(
        'width',
        markerImage.width.baseVal.valueAsString
      );
      markerImageCopy.setAttribute(
        'height',
        markerImage.height.baseVal.valueAsString
      );
      markerImageCopy.setAttribute(
        'viewBox',
        '0 0 ' +
          markerImage.viewBox.baseVal.width.toString() +
          ' ' +
          markerImage.viewBox.baseVal.height.toString()
      );
      markerImageCopy.innerHTML = markerImage.innerHTML;

      if (this.naturalSize === true) {
        // scale to full image size
        markerImageCopy.width.baseVal.value = target.naturalWidth;
        markerImageCopy.height.baseVal.value = target.naturalHeight;
      } else if (this.width !== undefined && this.height !== undefined) {
        // scale to specific dimensions
        markerImageCopy.width.baseVal.value = this.width;
        markerImageCopy.height.baseVal.value = this.height;
      }

      canvas.width = markerImageCopy.width.baseVal.value;
      canvas.height = markerImageCopy.height.baseVal.value;

      const data = markerImageCopy.outerHTML;

      const ctx = canvas.getContext('2d');
      if (this.markersOnly !== true) {
        ctx.drawImage(target, 0, 0, canvas.width, canvas.height);
      }

      const DOMURL = window.URL; // || window.webkitURL || window;

      const img = new Image(canvas.width, canvas.height);
      img.setAttribute('crossOrigin', 'anonymous');

      const blob = new Blob([data], { type: 'image/svg+xml' });

      const url = DOMURL.createObjectURL(blob);

      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        DOMURL.revokeObjectURL(url);

        const result = canvas.toDataURL(this.imageType, this.imageQuality);
        resolve(result);
      };

      img.src = url;
    });
  }
}
