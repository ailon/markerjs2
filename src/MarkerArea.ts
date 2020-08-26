export class MarkerArea {
  private target: HTMLImageElement;
  private targetRoot: HTMLElement;

  private width: number;
  private height: number;
  private targetRect: ClientRect;


  constructor(target: HTMLImageElement) {
    this.target = target;
    this.targetRoot = document.body;

    this.width = target.clientWidth;
    this.height = target.clientHeight;

    this.open = this.open.bind(this);
    this.setTargetRect = this.setTargetRect.bind(this);
  }

  public open(): void {
    this.setTargetRect();
  }

  private setTargetRect() {
    const targetRect = this.target.getBoundingClientRect() as DOMRect;
    const bodyRect = this.targetRoot.parentElement.getBoundingClientRect();
    this.targetRect = { left: (targetRect.left - bodyRect.left),
        top: (targetRect.top - bodyRect.top) } as ClientRect;

  }

}
