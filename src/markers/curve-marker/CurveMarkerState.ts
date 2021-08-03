import { LinearMarkerBaseState } from '../LinearMarkerBaseState';

/**
 * Represents state of a {@link CurveMarker}.
 */
export interface CurveMarkerState extends LinearMarkerBaseState {
  /**
   * Line color.
   */
  strokeColor: string,
  /**
   * Line width.
   */
  strokeWidth: number,
  /**
   * Line dash array.
   */
  strokeDasharray: string,

  curveX: number,
  curveY: number
}
