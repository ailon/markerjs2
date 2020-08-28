export class Renderer {
    public naturalSize = false; 
    public imageType = 'image/png';
    public imageQuality?: number;
    public markersOnly = false;

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
