import { RectangularBoxMarkerBaseState } from './RectangularBoxMarkerBaseState';

/**
 * Represents RectangleMarker's state.
 */
export interface RectangleMarkerState extends RectangularBoxMarkerBaseState {
  /**
   * Rectangle fill color.
   */
  fillColor: string;
  /**
   * Rectangle border stroke (line) color.
   */
  strokeColor: string;
  /**
   * Rectange border width.
   */
  strokeWidth: number;
  /**
   * Rectange border dash array.
   */
  strokeDasharray: string;
  /**
   * Rectangle opacity (alpha). 0 to 1.
   */
  opacity: number;
}
