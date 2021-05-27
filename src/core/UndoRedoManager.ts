/**
 * Manages undo and redo stacks.
 */
export class UndoRedoManager<T> {
  private undoStack: T[] = [];
  private redoStack: T[] = [];

  private lastRedoStep: T;

  /**
   * Returns true if there are items in the undo stack.
   */
  public get isUndoPossible(): boolean {
    return this.undoStack.length > 0;
  }

  /**
   * Returns true if there are items in the redo stack.
   */
  public get isRedoPossible(): boolean {
    return this.redoStack.length > 0;
  }

  /**
   * Adds a step to the undo stack.
   * @param stepData data representing a state.
   */
  public addUndoStep(stepData: T): void {
    if (
      this.undoStack.length === 0 ||
      JSON.stringify(this.undoStack[this.undoStack.length - 1]) !==
        JSON.stringify(stepData)
    ) {
        this.undoStack.push(stepData);
        if (JSON.stringify(this.lastRedoStep) !== JSON.stringify(stepData)) {
          this.redoStack.splice(0, this.redoStack.length);
        }
    }
  }

  /**
   * Returns data for the previous step in the undo stack and adds last step to the redo stack.
   * @returns 
   */
  public undo(): T | undefined {
    if (this.undoStack.length > 1) {
      const lastStep = this.undoStack.pop();
      if (lastStep !== undefined) {
        this.redoStack.push(lastStep);
      }
      return this.undoStack.length > 0 ? this.undoStack[this.undoStack.length - 1] : undefined;
    }
  }

  /**
   * Returns most recent item in the redo stack.
   * @returns 
   */
  public redo(): T | undefined {
    this.lastRedoStep = this.redoStack.pop();
    return this.lastRedoStep;
  }
}
