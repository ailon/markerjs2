import { MarkerBaseState } from './core/MarkerBaseState';

export interface MarkerAreaState {
  width: number;
  height: number;
  markers: MarkerBaseState[];
}