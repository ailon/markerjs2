import { MarkerArea } from '../MarkerArea';
import { MarkerAreaState } from '../MarkerAreaState';
import { MarkerBase } from './MarkerBase';

export class MarkerAreaEvent {
  public markerArea: MarkerArea;
  public cancelable = false;

  private _defaultPrevented = false;
  public get defaultPrevented(): boolean {
    return this._defaultPrevented;
  }

  public preventDefault(): void {
    this._defaultPrevented = true;
  }

  constructor(markerArea: MarkerArea, cancelable = false) {
    this.markerArea = markerArea;
    this.cancelable = cancelable;
  }
}

export class MarkerAreaRenderEvent extends MarkerAreaEvent {
  public dataUrl: string;
  public state: MarkerAreaState;

  constructor(markerArea: MarkerArea, dataUrl: string, state: MarkerAreaState) {
    super(markerArea, false);
    this.dataUrl = dataUrl;
    this.state = state;
  }
}

export class MarkerEvent extends MarkerAreaEvent {
  public marker?: MarkerBase;

  constructor(markerArea: MarkerArea, marker?: MarkerBase, cancelable = false) {
    super(markerArea, cancelable);
    this.marker = marker;
  }
}

/**
 * General MarkerArea event handler type.
 */
export type MarkerAreaEventHandler = (event: MarkerAreaEvent) => void;

/**
 * MarkerArea render event handler type.
 */
export type MarkerAreaRenderEventHandler = (
  event: MarkerAreaRenderEvent
) => void;

/**
 * Marker event handler type.
 */
export type MarkerEventHandler = (event: MarkerEvent) => void;

/**
 * Describes a repository of MarkerArea event handlers.
 */
export interface IEventListenerRepository {
  /**
   * Event handlers for the `render` event.
   */
  render: MarkerAreaRenderEventHandler[];
  /**
   * Event handlers for the `beforeclose` event.
   */
  beforeclose: MarkerAreaEventHandler[];
  /**
   * Event handlers for the `close` event.
   */
  close: MarkerAreaEventHandler[];
  /**
   * Event handlers for the `show` event.
   */
  show: MarkerAreaEventHandler[];
  /**
   * Event handlers for the `restorestate` event.
   */
  restorestate: MarkerAreaEventHandler[];
  /**
   * Event handlers for the `statechange` event.
   *
   * @since 2.23.0
   */
  statechange: MarkerAreaEventHandler[];
  /**
   * Event handlers for the `markerselect` event.
   */
  markerselect: MarkerEventHandler[];
  /**
   * Event handlers for the `markerdeselect` event.
   */
  markerdeselect: MarkerEventHandler[];
  /**
   * Event handlers for the `markercreating` event.
   */
  markercreating: MarkerEventHandler[];
  /**
   * Event handlers for the `markercreated` event.
   */
  markercreate: MarkerEventHandler[];
  /**
   * Event handlers for the `markerbeforedelete` event.
   */
  markerbeforedelete: MarkerEventHandler[];
  /**
   * Event handlers for the `markerdelete` event.
   */
  markerdelete: MarkerEventHandler[];
  /**
   * Event handlers for the `markerchange` event.
   *
   * @since 2.23.0
   */
  markerchange: MarkerEventHandler[];
  /**
   * Event handlers for the `focus` event.
   *
   * @since 2.19.0
   */
  focus: MarkerAreaEventHandler[];
  /**
   * Event handlers for the `blur` event.
   *
   * @since 2.19.0
   */
  blur: MarkerAreaEventHandler[];
}

/**
 * Event handler type for a specific event type.
 */
export type EventHandler<T extends keyof IEventListenerRepository> =
  T extends 'markerselect'
    ? MarkerEventHandler
    : T extends 'markerdeselect'
    ? MarkerEventHandler
    : T extends 'markercreating'
    ? MarkerEventHandler
    : T extends 'markercreate'
    ? MarkerEventHandler
    : T extends 'markerbeforedelete'
    ? MarkerEventHandler
    : T extends 'markerdelete'
    ? MarkerEventHandler
    : T extends 'markerchange'
    ? MarkerEventHandler
    : T extends 'render'
    ? MarkerAreaRenderEventHandler
    : MarkerAreaEventHandler;

/**
 * Event handler repository.
 */
export class EventListenerRepository implements IEventListenerRepository {
  /**
   * Event handlers for the `render` event.
   */
  render: MarkerAreaRenderEventHandler[] = [];
  /**
   * Event handlers for the `beforeclose` event.
   */
  beforeclose: MarkerAreaEventHandler[] = [];
  /**
   * Event handlers for the `close` event.
   */
  close: MarkerAreaEventHandler[] = [];
  /**
   * Event handlers for the `show` event.
   */
  show: MarkerAreaEventHandler[] = [];
  /**
   * Event handlers for the `restorestate` event.
   */
  restorestate: MarkerAreaEventHandler[] = [];
  /**
   * Event handlers for the `statechange` event.
   *
   * @since 2.23.0
   */
  statechange: MarkerAreaEventHandler[] = [];
  /**
   * Event handlers for the `markerselect` event.
   */
  markerselect: MarkerEventHandler[] = [];
  /**
   * Event handlers for the `markerdeselect` event.
   */
  markerdeselect: MarkerEventHandler[] = [];
  /**
   * Event handlers for the `markercreating` event.
   */
  markercreating: MarkerEventHandler[] = [];
  /**
   * Event handlers for the `markercreate` event.
   */
  markercreate: MarkerEventHandler[] = [];
  /**
   * Event handlers for the `markerbeforedelete` event.
   */
  markerbeforedelete: MarkerEventHandler[] = [];
  /**
   * Event handlers for the `markerdelete` event.
   */
  markerdelete: MarkerEventHandler[] = [];
  /**
   * Event handlers for the `markerchange` event.
   *
   * @since 2.23.0
   */
  markerchange: MarkerEventHandler[] = [];
  /**
   * Event handlers for the `focus` event.
   *
   * @since 2.19.0
   */
  focus: MarkerAreaEventHandler[] = [];
  /**
   * Event handlers for the `blur` event.
   *
   * @since 2.19.0
   */
  blur: MarkerAreaEventHandler[] = [];

  /**
   * Add an event handler for a specific event type.
   * @param eventType - event type.
   * @param handler - function to handle the event.
   */
  public addEventListener<T extends keyof IEventListenerRepository>(
    eventType: T,
    handler: EventHandler<T>
  ): void {
    (<Array<EventHandler<T>>>this[eventType]).push(handler);
  }

  /**
   * Remove an event handler for a specific event type.
   * @param eventType - event type.
   * @param handler - function currently handling the event.
   */
  public removeEventListener<T extends keyof IEventListenerRepository>(
    eventType: T,
    handler: EventHandler<T>
  ): void {
    const index = (<Array<EventHandler<T>>>this[eventType]).indexOf(handler);
    if (index > -1) {
      (<Array<EventHandler<T>>>this[eventType]).splice(index, 1);
    }
  }
}
