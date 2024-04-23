import { RectangularBoxMarkerBaseState } from '../RectangularBoxMarkerBaseState';

export interface TextMarkerState extends RectangularBoxMarkerBaseState {
  color: string;
  fontFamily: string;
  padding: number;
  text: string;
  wrapText?: boolean;
}
