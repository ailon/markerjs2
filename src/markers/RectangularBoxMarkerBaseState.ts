import { MarkerBaseState } from '../core/MarkerBaseState';
import { ITransformMatrix } from '../core/TransformMatrix';

/**
 * Represents a state snapshot of a RectangularBoxMarkerBase.
 */
export interface RectangularBoxMarkerBaseState extends MarkerBaseState {
  /**
   * x coordinate of the top-left corner.
   */
  left: number;
  /**
   * y coordinate of the top-left corner.
   */
  top: number;
  /**
   * Marker's width.
   */
  width: number;
  /**
   * Marker's height.
   */
  height: number;
  /**
   * Marker's rotation angle.
   */
  rotationAngle: number;
  /**
   * Transformation matrix for the marker's visual.
   */
  visualTransformMatrix: ITransformMatrix;
  /**
   * Transofrmation matrix for the marker's container.
   */
  containerTransformMatrix: ITransformMatrix;
}
