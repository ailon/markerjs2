import { MarkerBaseState } from '../core/MarkerBaseState';
import { ITransformMatrix } from '../core/TransformMatrix';

export interface RectangularBoxMarkerBaseState extends MarkerBaseState {
  left: number;
  top: number;
  width: number;
  height: number;
  rotationAngle: number;
  visualTransformMatrix: ITransformMatrix;
  containerTransformMatrix: ITransformMatrix;
}