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
     * Initiates rendering of the result image and returns a promise which when resolved
     * contains a data URL for the rendered image.
     * 
     * @param target - target (underlying original) image
     * @param markerImage - marker layer
     */
    public rasterize(
        target: HTMLImageElement, 
        markerImage: SVGSVGElement, 
    ): Promise<string> {
        return new Promise<string>((resolve) => {
            const canvas = document.createElement("canvas");

            if (this.naturalSize === true) {
                // scale to full image size
                markerImage.width.baseVal.value = target.naturalWidth;
                markerImage.height.baseVal.value = target.naturalHeight;
            }
    
            canvas.width = markerImage.width.baseVal.value;
            canvas.height = markerImage.height.baseVal.value;
    
            const data = markerImage.outerHTML;
    
            const ctx = canvas.getContext("2d");
            if (this.markersOnly !== true) { 
                ctx.drawImage(target, 0, 0, canvas.width, canvas.height);
            }
    
            const DOMURL = window.URL; // || window.webkitURL || window;
    
            const img = new Image(canvas.width, canvas.height);
            img.setAttribute("crossOrigin", "anonymous");
    
            const blob = new Blob([data], { type: "image/svg+xml" });
    
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
