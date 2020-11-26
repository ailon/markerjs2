import { ArrowType } from '../../ui/toolbox-panels/ArrowTypePanel';
import { LineMarkerState } from '../line-marker/LineMarkerState';

export interface ArrowMarkerState extends LineMarkerState {
  arrowType: ArrowType
}