import { MarkerArea } from '../../src';

export * from './../../src/index';

export class Experiments {
  private markerArea1: MarkerArea;
  public openMarkerArea(target: HTMLImageElement): void {
    this.markerArea1 = new MarkerArea(target);
    this.markerArea1.addRenderEventListener(this.renderResult);
    this.markerArea1.show();
  }

  private renderResult(dataUrl: string) {
    (document.getElementById('resultImage1') as HTMLImageElement).src = dataUrl;
  }

  public async render(resultTarget: HTMLImageElement): Promise<void> {
    resultTarget.src = await this.markerArea1.render();
    this.markerArea1.close();
  }
}