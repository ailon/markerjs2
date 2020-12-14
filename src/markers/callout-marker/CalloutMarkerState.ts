import { IPoint } from '../../core/IPoint';
import { TextMarkerState } from '../text-marker/TextMarkerState';

export interface CalloutMarkerState extends TextMarkerState {
  bgColor: string;
  tipPosition: IPoint;
}
