import { IPoint } from '../../core/IPoint';
import { TextMarkerState } from '../text-marker/TextMarkerState';

/**
 * Represents the state of a CalloutMarker.
 */
export interface CalloutMarkerState extends TextMarkerState {
  /**
   * Background (fill) color.
   */
  bgColor: string;
  /**
   * Position of the callout tip.
   */
  tipPosition: IPoint;
}
