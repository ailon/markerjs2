import { LinearMarkerBaseState } from '../LinearMarkerBaseState';

export interface LineMarkerState extends LinearMarkerBaseState {
  strokeColor: string,
  strokeWidth: number,
  strokeDasharray: string
}