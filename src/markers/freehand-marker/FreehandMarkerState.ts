import { RectangularBoxMarkerBaseState } from '../RectangularBoxMarkerBaseState';

/**
 * Represents state of the {@link FreehandMarker}.
 */
export interface FreehandMarkerState extends RectangularBoxMarkerBaseState {
  /**
   * URL of the drawing image.
   */
  drawingImgUrl: string;
}
