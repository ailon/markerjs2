import { LinearMarkerBaseState } from '../LinearMarkerBaseState';

/**
 * Represents state of a {@link LineMarker}.
 */
export interface LineMarkerState extends LinearMarkerBaseState {
  /**
   * Line color.
   */
  strokeColor: string;
  /**
   * Line width.
   */
  strokeWidth: number;
  /**
   * Line dash array.
   */
  strokeDasharray: string;
}
