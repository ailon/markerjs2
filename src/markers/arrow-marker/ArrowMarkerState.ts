import { ArrowType } from '../../ui/toolbox-panels/ArrowTypePanel';
import { LineMarkerState } from '../line-marker/LineMarkerState';

/**
 * Represents arrow marker state.
 */
export interface ArrowMarkerState extends LineMarkerState {
  /**
   * Type of arrow.
   */
  arrowType: ArrowType;
}
