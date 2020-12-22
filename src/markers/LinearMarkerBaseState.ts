import { MarkerBaseState } from '../core/MarkerBaseState';

/**
 * Represents base state for line-style markers.
 */
export interface LinearMarkerBaseState extends MarkerBaseState {
  /**
   * x coordinate for the first end-point.
   */
  x1: number,
  /**
   * y coordinate for the first end-point.
   */
  y1: number,
  /**
   * x coordinate for the second end-point.
   */
  x2: number,
  /**
   * y coordinate for the second end-point.
   */
  y2: number
}
