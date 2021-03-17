/**
 * Represents marker's state (status) in time.
 */
export type MarkerState = 'new' | 'creating' | 'select' | 'move' | 'resize' | 'rotate' | 'edit';

/**
 * Represents marker's state used to save and restore state continue annotation in the future.
 */
export interface MarkerBaseState {
  /**
   * Marker's type name.
   */
  typeName: string;
  /**
   * Current editing state/status.
   */
  state: MarkerState;
}
