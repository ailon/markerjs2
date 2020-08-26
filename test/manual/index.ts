import { MarkerArea } from '../../src';

export * from './../../src/index';

export class Experiments {
  public static openMarkerArea(target: HTMLImageElement): void {
    const markerjs = new MarkerArea(target);
    markerjs.open();
  }
}