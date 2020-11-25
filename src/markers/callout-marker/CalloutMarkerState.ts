import { IPoint } from '../../MarkerArea';
import { TextMarkerState } from '../text-marker/TextMarkerState';

export interface CalloutMarkerState extends TextMarkerState {
  bgColor: string;
  tipPosition: IPoint;
}
