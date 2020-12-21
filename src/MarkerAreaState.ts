import { MarkerBaseState } from './core/MarkerBaseState';

/**
 * Describes a MarkerArea state object used to save and restore marker.js state between sessions.
 */
export interface MarkerAreaState {
  /**
   * Editing canvas width.
   */
  width: number;
  /**
   * Editing canvas height.
   */
  height: number;
  /**
   * States of individual markers.
   */
  markers: MarkerBaseState[];
}
