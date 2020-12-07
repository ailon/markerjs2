// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Activator, MarkerArea } from '../../src';
import { DisplayMode } from '../../src/core/Settings';
import { MarkerAreaState } from '../../src/MarkerAreaState';

export * from './../../src/index';

export class Experiments {
  private markerArea1: MarkerArea;
  private displayMode: DisplayMode = 'inline';
  private currentState: MarkerAreaState;

  constructor() {
    this.renderResult = this.renderResult.bind(this);
    //Activator.addKey('1234');
  }

  public openMarkerArea(target: HTMLImageElement): void {
    this.markerArea1 = new MarkerArea(target);
    this.markerArea1.addRenderEventListener(this.renderResult);
    this.markerArea1.settings.displayMode = this.displayMode;

    this.markerArea1.uiStyleSettings.toolbarStyleColorsClassName = 'toolbar';
    this.markerArea1.uiStyleSettings.toolbarButtonStyleColorsClassName = 'toolbar-button';
    this.markerArea1.uiStyleSettings.toolbarActiveButtonStyleColorsClassName = 'toolbar-active-button';
    this.markerArea1.uiStyleSettings.toolbarHeight = 40;

    this.markerArea1.show();
    if (this.currentState) {
      this.markerArea1.restoreState(this.currentState);
    }
  }

  private renderResult(dataUrl: string, state: MarkerAreaState) {
    (document.getElementById('resultImage1') as HTMLImageElement).src = dataUrl;
    this.currentState = state;
    console.log(JSON.stringify(state));
  }

  public async render(resultTarget: HTMLImageElement): Promise<void> {
    resultTarget.src = await this.markerArea1.render();
    this.markerArea1.close();
  }

  public setDisplayMode(mode: DisplayMode): void {
    this.displayMode = mode;
  }
}