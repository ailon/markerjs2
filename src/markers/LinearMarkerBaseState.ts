import { MarkerBaseState } from '../core/MarkerBaseState';

export interface LinearMarkerBaseState extends MarkerBaseState {
  x1: number,
  y1: number,
  x2: number,
  y2: number
}