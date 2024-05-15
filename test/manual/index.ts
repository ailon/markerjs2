// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Activator,
  FrameMarker,
  MarkerArea,
  Style,
  StyleManager
} from '../../src';
import { DisplayMode } from '../../src/core/Settings';
import { MarkerAreaState } from '../../src/MarkerAreaState';

export * from './../../src/index';

export class Experiments {
  private markerArea1: MarkerArea;
  private displayMode: DisplayMode = 'inline';
  private currentState: MarkerAreaState;

  private oddLaunch = true;

  constructor() {
    this.renderResult = this.renderResult.bind(this);
    //Activator.addKey('1234');
  }

  public openMarkerArea(target: HTMLImageElement): void {
    if (this.markerArea1 === undefined) {
      this.markerArea1 = new MarkerArea(target);
      Style.styleSheetRoot = document.head;

      this.markerArea1.addRenderEventListener(this.renderResult);

      this.markerArea1.addEventListener('markerbeforedelete', (event) => {
        if (!confirm(`delete marker${event.marker ? '' : 's'}?`)) {
          event.preventDefault();
        }
      });
      this.markerArea1.addEventListener('focus', () => console.log(`focused`));
      this.markerArea1.addEventListener('blur', () => console.log(`blured`));

      this.markerArea1.addEventListener('statechange', (event) => {
        console.log(`state change: ${event.markerArea.getState()}`);
        // console.log(`undo possible?: ${event.markerArea.isUndoPossible}`);
        // console.log(`redo possible?: ${event.markerArea.isRedoPossible}`);
      });
      this.markerArea1.addEventListener('markerchange', (event) => {
        console.log(
          `marker state change: ${JSON.stringify(event.marker?.getState())}`
        );
      });

      // this.markerArea1.addEventListener('markerselect', event => {
      //   console.log('select');
      // });
      // this.markerArea1.addEventListener('markercreate', event => {
      //   console.log('create');
      //   event.markerArea.createNewMarker(event.marker.typeName)
      // });

      this.markerArea1.settings.defaultText = 'Hello World!';

      this.markerArea1.settings.displayMode = this.displayMode;
      this.markerArea1.settings.popupMargin = 10;

      this.markerArea1.settings.wrapText = true;

      this.markerArea1.settings.defaultColorsFollowCurrentColors = true;

      this.markerArea1.settings.defaultColorSet = [
        'yellow',
        'green',
        'red',
        'yellow',
        'green',
        'red',
        'yellow',
        'green',
        'red',
        'yellow',
        'green',
        'red',
        'yellow',
        'green',
        'red',
        'yellow',
        'green',
        'red'
      ];

      this.markerArea1.settings.newFreehandMarkerOnPointerUp = false;

      this.markerArea1.uiStyleSettings.selectButtonColor = 'lightblue';
      this.markerArea1.uiStyleSettings.deleteButtonColor = 'red';
      this.markerArea1.uiStyleSettings.okButtonColor = 'green';
      this.markerArea1.uiStyleSettings.closeButtonColor = 'yellow';

      this.markerArea1.uiStyleSettings.redoButtonVisible = true;

      this.markerArea1.uiStyleSettings.zoomButtonVisible = false;
      this.markerArea1.uiStyleSettings.zoomOutButtonVisible = false;

      this.markerArea1.uiStyleSettings.clearButtonVisible = true;

      this.markerArea1.uiStyleSettings.logoPosition = 'right';

      this.markerArea1.availableMarkerTypes = this.markerArea1.ALL_MARKER_TYPES;

      this.markerArea1.renderAtNaturalSize = true;

      this.markerArea1.settings.freehandPixelRatio = 2;
    }
    this.markerArea1.show();

    if (this.currentState) {
      this.markerArea1.restoreState(this.currentState);
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        this.markerArea1.undo();
        e.preventDefault();
        e.stopImmediatePropagation();
      }
      if (
        (e.key === 'y' && (e.ctrlKey || e.metaKey)) ||
        (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey)
      ) {
        this.markerArea1.redo();
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    });
  }

  private renderResult(dataUrl: string, state: MarkerAreaState) {
    (document.getElementById('resultImage1') as HTMLImageElement).src = dataUrl;
    this.currentState = JSON.parse(JSON.stringify(state));
    console.log(JSON.stringify(this.currentState));
  }

  public async render(resultTarget: HTMLImageElement): Promise<void> {
    resultTarget.src = await this.markerArea1.render();
    this.markerArea1.close();
  }

  public setDisplayMode(mode: DisplayMode): void {
    this.displayMode = mode;
  }

  public closeMarkerArea(): void {
    if (this.markerArea1) {
      this.markerArea1.close();
    }
  }

  public addFrameMarker(): void {
    if (this.markerArea1) {
      this.markerArea1.createNewMarker(FrameMarker);
    }
  }
  public deleteCurrentMarker(): void {
    if (this.markerArea1) {
      this.markerArea1.deleteSelectedMarker();
    }
  }
  public renderAndClose(): void {
    if (this.markerArea1) {
      this.markerArea1.startRenderAndClose();
    }
  }

  public renderState(): void {
    (document.getElementById('resultImage1') as HTMLImageElement).src = '';

    this.markerArea1 = new MarkerArea(document.getElementById('testImage1'));
    this.markerArea1.addEventListener('render', (event) =>
      this.renderResult(event.dataUrl, event.state)
    );
    this.markerArea1.renderState(this.currentState);
  }

  public openNoUI(target: HTMLImageElement): void {
    this.markerArea1 = new MarkerArea(target);
    this.markerArea1.addRenderEventListener(this.renderResult);
    this.markerArea1.settings.displayMode = this.displayMode;

    // this.markerArea1.uiStyleSettings.toolbarHeight = 0;
    this.markerArea1.uiStyleSettings.hideToolbar = true;
    this.markerArea1.uiStyleSettings.hideToolbox = true;

    this.markerArea1.targetRoot = document.getElementById('app');

    this.markerArea1.show();
    if (this.currentState) {
      this.markerArea1.restoreState(this.currentState);
    }
  }

  public getState(): void {
    if (this.markerArea1) {
      this.currentState = this.markerArea1.getState(true);
      //console.log(this.currentState);
    }
  }

  public restoreState(): void {
    if (this.markerArea1 && this.currentState) {
      this.markerArea1.restoreState(this.currentState);
    }
  }

  public undo(): void {
    if (this.markerArea1) {
      this.markerArea1.undo();
    }
  }
  public redo(): void {
    if (this.markerArea1) {
      this.markerArea1.redo();
    }
  }
}
