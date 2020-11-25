import { MarkerBaseState } from '../core/MarkerBaseState';

export interface RectangularBoxMarkerBaseState extends MarkerBaseState {
  left: number;
  top: number;
  width: number;
  height: number;
  rotationAngle: number;
}