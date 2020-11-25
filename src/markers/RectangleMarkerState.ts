import { RectangularBoxMarkerBaseState } from './RectangularBoxMarkerBaseState';

export interface RectangleMarkerState extends RectangularBoxMarkerBaseState {
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  strokeDasharray: string;
  opacity: number;
}