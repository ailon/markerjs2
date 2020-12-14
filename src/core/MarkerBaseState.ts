export type MarkerState = 'new' | 'creating' | 'select' | 'move' | 'resize' | 'rotate';

export interface MarkerBaseState {
  typeName: string;
  state: MarkerState;
}
