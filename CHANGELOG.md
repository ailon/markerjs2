# marker.js 2 Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.30.1] - 2023-09-05
### Added
- `wrapText` to `TextMarkerState` (not used in marker.js but needed for mjs Live).

### Fixed
- `wrapText` wasn't applied when restoring state.

## [2.30.0] - 2023-09-04
### Added
- text wrapping option in text based markers. Set `settings.wrapText = true` to enable.

### Fixed
- incorrect text positioning in RTL mode

## [2.29.10] - 2023-09-01
### Fixed
- `inline` mode image margin logic was applied to `popup` mode as well

## [2.29.9] - 2023-08-22
### Fixed
- null reference exceptions on resizing in some cases

## [2.29.8] - 2023-08-21
### Fixed
- incorrect placement of markers when used inside a scaled parent element

## [2.29.7] - 2023-08-16
### Fixed
- in popup mode some property panels would extend beyond the UI boundaries

## [2.29.6] - 2023-08-01
### Fixed
- missing strokes with Apple Pencil

## [2.29.5] - 2023-07-24
### Added
- `title` and `aria-label` attributes on toolbar buttons

## [2.29.4] - 2023-06-12
### Fixed
- (third attempt) markers not removed from instance when closing and reopening the same MarkerArea.

## [2.29.3] - 2023-06-09
### Fixed
- (second attempt as this still wasn't fixed in some instances) markers not removed from instance when closing and reopening the same MarkerArea

## [2.29.2] - 2023-06-09
### Fixed
- markers not removed from instance when closing and reopening the same MarkerArea

## [2.29.1] - 2023-04-25
### Fixed
- incorrect arrow head placement on vertical arrows

## [2.29.0] - 2023-03-06
### Added
- `CaptionFrameMarker` - rectangular frame marker with built-in text caption

## [2.28.1] - 2022-11-29
### Fixed
- resize observer isn't unobserving editor canvas in popup mode on close.

## [2.28.0] - 2022-10-24
### Added
- `Settings.uiOffsetTop` property to manually adjust placement of the UI. 
See reference for the usage scenarios.

### Changed
- UI placement algorithm adjusted to be more universal.

### Fixed
- UI was placed incorrectly when activating marker.js over a partially
off-screen image.

## [2.27.0] - 2022-09-26
### Added
- public getter for `MarkerArea.currentMarker`

### Fixed
- undo/redo removes defs from the underlying SVG

## [2.26.0] - 2022-09-12
### Added
- `isUndoPossible`/`isRedoPossible` properties on `MarkerArea` - true when operation is possible

## [2.25.0] - 2022-09-06
### Changed
- static `Style` to instance level style management via `MarkerArea.styles`. 
**WARNING**: DOM-level "hacky" modifications may break.

## [2.24.0] - 2022-08-22
### Added
- switchToSelectMode() is now public enabling switching from code

### Fixed
- exception when switching to select mode with newFreehandMarkerOnPointerUp=true
- calling redo() from code caused corruption of the undo stack in some instances
- UI was incorrectly positioned when target image is inside absolutely positioned target root
- text editor is opening every time CalloutMarker tip was moved

## [2.23.0] - 2022-08-15
### Added
- `statechange` event. Fired when the state of marker area changes.
- `markerchange` event - fired when marker state changes

### Fixed
- `markerdelete` and `markerbeforedelete` events weren't fired on clear all. Now `markerdelete` event is fired for each marker and `markerbeforedelete` is fired once with `marker` set to undefined.

## [2.22.0] - 2022-07-25
### Added
- `disableRotation` setting to disable the rotation feature on all markers

## [2.21.6] - 2022-07-18
### Fixed
- text markers were offset incorrectly when windows was resized while creating

## [2.21.5] - 2022-07-04
### Fixed
- markercreate event was fired too early on text-based markers. This caused unexpected side-effects when creating new markers from code on the event.

## [2.21.4] - 2022-05-10
### Fixed
- 'markerselect' and 'markerdeselect' events were fired on resize

## [2.21.3] - 2022-04-26
### Fixed
- undo step isn't registered when creating a marker from code

## [2.21.2] - 2022-04-21
### Fixed
- "ghost" control box is shown when creating a new marker from code on launch or when resizing while creating

## [2.21.1] - 2022-04-15
### Fixed
- delete button is not disabled after undo of the last remaining marker
- undo doesn't work after window resize

## [2.21.0] - 2022-04-07
### Added
- `addDefs()` method for adding "defs" element to the marker SVG element. Useful for using custom fonts and potentially other scenarios. See documentation article on adding custom fonts for an example.

## [2.20.0] - 2022-02-22
### Added
- Settings.freehandPixelRatio to control resolution of the FreehandMarker

### Fixed
- toolbar loses currently selected marker type on resize

## [2.19.0] - 2022-01-31
### Added
- `MarkerArea.focus()` and `blur()` methods and `focus`/`blur` events

### Fixed
- global event listeners weren't removed on close
- deleting a marker from keyboard didn't trigger delete events

## [2.18.0] - 2022-01-13
### Added
- `resultButtonBlockVisible` setting determining if render (ok) and close buttons are visible (defauts to true)

### Fixed
- pasting rich text resulted in inconsistent results (now converts to plain text on paste)

## [2.17.2] - 2021-12-01
### Fixed
- `renderState()` resulted in a UI blinking for a split second in some cases

## [2.17.1] - 2021-11-22
### Fixed
- `toolboxBackgroundColor` didn't change the toolbox flyout color

## [2.17.0] - 2021-11-15
### Added
- renderState() method to render previously saved state without opening the UI
- createNewMarker can accept string as a marker type

### Fixed
- when new marker is created from code its type isn't reflected in the toolbar

## [2.16.2] - 2021-10-28
### Fixed
- `markercreate` event was fired before all related actions were completed

## [2.16.1] - 2021-10-28
### Fixed
- doc comments and readme sample used the old eventing system.

## [2.16.0] - 2021-10-27
### Added
- new and expanded event system with events for all kinds of MarkerArea and individual marker lifecycel events.
- `typeName` instance property on markers
- `isSelected` marker property returning true if marker is currently selected

## [2.15.0] - 2021-10-15
### Added
- configurable zIndex for the whole UI
- a way to remove all markers (`clear()` method) and a toolbar button (hidden by default)
- `MarkerArea.addLicenseKey()` proxy instance method for Activator.addKey()

### Fixed
- toolbars were rendered inside the target rectangle when inside `position: relative` parent, even if there was enough space on top

## [2.14.1] - 2021-10-13
### Changed
- deprecated CSSStyleSheet `rules` and `addRule()` members replaced with standard `cssRules` and `insertRule`

## [2.14.0] - 2021-10-06
### Added
- renderTarget property to specify a canvas for rendering the results to (in addition to rendering an image)
- ability to pass non-image target to the constructor (sizes UI according to the target and renders markers only)
- positioning of the logo (left (default) or right) in the free version

## [2.13.0] - 2021-09-28
### Added
- Zoom out button for one-click restoring to 100% zoom (enable via markerArea.uiStyleSettings.zoomOutButtonVisible)

## [2.12.0] - 2021-09-27
### Added
- Zooming feature (enable by setting markerArea.uiStyleSettings.zoomButtonVisible = true)

## [2.11.2] - 2021-08-26
### Fixed
- CurveMarker wasn't scaled properly when resizing

## [2.11.1] - 2021-08-09
### Fixed
- clicking on delete button for the second time resulted in exception
- setting properties on some marker types before drawing them caused exceptions

## [2.11.0] - 2021-08-04
### Added
- CurveMarker - quadratic bezier curve marker support.

## [2.10.0] - 2021-07-27
### Added
- marker notes (UI off by default) - stored in MarkerBase.notes and state

### Changed
- selected marker is kept selected after the window/target image resize.

## [2.9.0] - 2021-07-15
### Added
- optional `deselectCurrentMarker` parameter to `getState()` - when true deselects current marker before getting the state.

### Changed
- `setCurrentMarker()` to public so markers can be [de]selected programatically

### Fixed
- Uncaught TypeError exception when restoring TextMarker in edit state
- color picker wrapping on smaller UI sizes

## [2.8.4] - 2021-07-05
### Fixed
- couldn't render image when text marker text ended in space 
  (workaround: lines are trimmed before rendering now)

## [2.8.3] - 2021-07-02
### Fixed
- text is sized incorrectly in Safari

## [2.8.2] - 2021-06-01
### Fixed
- it's impossible to select text with a mouse in TextMarker

## [2.8.1] - 2021-05-26
### Fixed
- Freehand markers were added twice in newFreehandMarkerOnPointerUp mode

## [2.8.0] - 2021-05-26
### Added
- support for line width in Freehand marker.

### Fixed
- double-clicking on any toolbar button causes content selection

## [2.7.1] - 2021-05-20
### Fixed
- not working in the "legacy" Microsoft Edge (compatibility won't be officially maintained going forward).
- added feature check for ResizeObserver as it was causing exceptions on some browsers.

## [2.7.0] - 2021-05-05
### Added
- settings.defaultColorsFollowCurrentColors switch to maintain selected color for new markers.

## [2.6.2] - 2021-04-29
### Fixed
- keyboard wouldn't show up on Chrome on Android in some instances.
- popup wasn't sized correctly when content was larger than window size.

## [2.6.1] - 2021-04-13
### Fixed
- exception during undo of text markers
- redo stack was broken when clicking undo on an empty area

## [2.6.0] - 2021-04-13
### Added
- undo/redo functionality (redo button is hidden by default).

## [2.5.0] - 2021-03-17
### Added
- UI-less APIs. Create and delete markers from code, hide toolbar and/or toolbox.
- support for customizing icon color in action buttons 
(see IStyleSettings.selectButtonColor, deleteButtonColor, okButtonColor, closeButtonColor)

### Changed
- touch behavior to pass multi-touch events to the browser (this way pinch-zoom 
of the whole page (and other events) are handled by the browser as expected).

## [2.4.1] - 2021-03-05
### Fixed
- hitting delete/backspace while editing text deleted text/callout markers
- text markers were not rendered when toolbar was clicked while editing text

## [2.4.0] - 2021-02-24
### Added
- `newFreehandMarkerOnPointerUp` setting to create a new free-hand marker one every pointer up event.
- deleting markers with Delete or Backspace keys on a keyboard.

## [2.3.3] - 2021-02-10
### Fixed
- `IPoint` wasn't exported.

### Changed
- internal refactoring of `RectangularBoxMarkerBase` and its descendants.

## [2.3.2] - 2021-02-01
### Fixed
- server-side builds failed due to static `Style.styleSheetRoot` defaulting to document.head

## [2.3.1] - 2021-01-25
### Added
- `Style.styleSheetRoot` property to support Shadow DOM scenarios. Defaults to document.head.

### Fixed
- fix EllipseFrameMarker wasn't exported.

## [2.3.0] - 2021-01-19
### Added
- EllipseFrameMarker - unfilled ellipse.
- renderWidth/Height to set specific rendering dimensions.
- text editing on long-press (TextMarker, CalloutMarker).

### Changed
- ellipse marker icon to a filled one for consistency.

### Fixed
- font-size setting on parent elements (eg. body) was affecting UI and renders.
- default-size callout marker was created with wrongly positioned tip.
- text wasn't editable on iOS devices (use long-press to edit).

## [2.2.0] - 2021-01-15
### Added
- responsiveness in `popup` mode. Target image is now scaled to fit the whole available space for more convenient editing.
- `popupMargin` setting to control margin between UI and window border in popup mode.
- `canvasBackgroundColor` setting to control editing canvas in popup mode

### Changed
- z-index in inline mode to a more modest value for easier integration in various layouts

### Fixed
- white toolbar/toolbox corners in inline mode.
- in popup mode when content didn't fit into window toolbars were cut.
- popup sizing issues in Safari.
- when resizing marker area was switchted to select mode but toolbar wasn't.
- momentary flicker when rendering with `renderAtNaturalSize`.
- free-hand markers weren't rendered in Safari on the first try.

## [2.1.1] - 2021-01-11
### Fixed
- text editor was placed incorrectly after rotation and movement.
- fix longer single words caused text editor to go outside bounds

## [2.1.0] - 2021-01-08
### Added
- responsiveness while editing the markers and underlying image size changes.
- scaling of markers when opening previously saved markup of differing dimensions.

## [2.0.0] - 2021-01-05
### Changed
- promoted RC7 to final 2.0

## [2.0.0-rc.7] - 2020-12-31
### Added 
- support for transparent "color" in color picker (context dependent).

### Fixed
- EllipseMarker didn't respect the defaultFillColor setting [potentially breaking].

## [2.0.0-rc.6] - 2020-12-29
### Fixed
- opening popup editor after inline and vice versa caused styling issues.
- unnecessary rounded corners in popup mode.

## [2.0.0-rc.5] - 2020-12-22
### Added
- doc comments for better intellisense experience and class reference.

### Fixed
- Cover and Highlight markers didn't have typeName set making it impossible to request them by string and resulting in state restoration bug.

## [2.0.0-rc.4] - 2020-12-19
### Fixed
- changing UI styles affected all future MarkerArea instances.

## [2.0.0-rc.3] - 2020-12-19
### Added
- renderAtNaturalSize, renderImageType, renderImageQuality, renderMarkersOnly to control rendering results.

### Fixed
- trying to close() an already closed marker area caused an exception.

## [2.0.0-rc.2] - 2020-12-16
### Added
- public targetRoot property to set positioning root other than document.body.
- width/height to MarkerAreaState for future compatibility.

## [2.0.0-rc.1] - 2020-12-15
### Fixed
- Text marker style changes were not reflected while editing text.
- Target image sizing in Safari in some instances.

## [2.0.0-rc.0] - 2020-12-14
### Fixed
- internal build process issues.

## [2.0.0-beta.4] - 2020-12-12
### Fixed
- Active toolbar button icon color wasn't set by default.
- Exact fitting number of toolbar buttons still resulted in an overflow toolbar.
- Marker canvas sometimes was created with 0 height making it impossible to place markers.

## [2.0.0-beta.3] - 2020-12-11
### Fixed
- Custom styling issues

## [2.0.0-beta.2] - 2020-12-10
### Added
- Measurement marker.
- Context-aware cursor styles.
- Add toolbar/toolbox rounded corners.
- Add subtle UI animations.
- Exports for all externally relevant classes, interfaces, and types.

### Changed
- Updated default colorset.

### Fixed
- Toolbox active button icon style wasn't set in default theme.
- Delete button is now context sensitive (disabled when no marker is selected).
- Rotated and moved renctangle-based marker positions were off on state restore.
- Removed debug messages.

## [2.0.0-beta.1] - 2020-12-08
### Added
- toolbar styling customizaiton classes.
- property to manage available marker types (`availableMarkerTypes`).

### Fixed
- box-sizing of the parent elements was distorting the UI.
- internal fixes.

## [2.0.0-beta.0] - 2020-12-02
### Added
- Line style toolbox (used in frame, line, arrow markers).
- Saving and restoring of state.
- Ellipse marker.
- Overflow toolbar for when marker buttons don't fit in the toolbar.

### Fixed
- Callout tip color wasn't changed together with the background color.
- Freehand marker wasn't "commited" unless explicitly switched to Select tool.
- Internal fixes.

## [2.0.0-alpha.2] - 2020-11-20
### Added
- Added Callout marker.
- Newly created markers default to their internally set sizes on simple click (with no dragging).

### Changed
- Improved text positioning and sizing in TextMarker.
- Replaced text toolbox buttons with icons.
- Changed toolbox behavior from static to popup

## 2.0.0-alpha.1 - 2020-11-13
### Added
- Initial public release.

[2.30.1]: https://github.com/ailon/markerjs2/releases/tag/v2.30.1
[2.30.0]: https://github.com/ailon/markerjs2/releases/tag/v2.30.0
[2.29.10]: https://github.com/ailon/markerjs2/releases/tag/v2.29.10
[2.29.9]: https://github.com/ailon/markerjs2/releases/tag/v2.29.9
[2.29.8]: https://github.com/ailon/markerjs2/releases/tag/v2.29.8
[2.29.7]: https://github.com/ailon/markerjs2/releases/tag/v2.29.7
[2.29.6]: https://github.com/ailon/markerjs2/releases/tag/v2.29.6
[2.29.5]: https://github.com/ailon/markerjs2/releases/tag/v2.29.5
[2.29.4]: https://github.com/ailon/markerjs2/releases/tag/v2.29.4
[2.29.3]: https://github.com/ailon/markerjs2/releases/tag/v2.29.3
[2.29.2]: https://github.com/ailon/markerjs2/releases/tag/v2.29.2
[2.29.1]: https://github.com/ailon/markerjs2/releases/tag/v2.29.1
[2.29.0]: https://github.com/ailon/markerjs2/releases/tag/v2.29.0
[2.28.1]: https://github.com/ailon/markerjs2/releases/tag/v2.28.1
[2.28.0]: https://github.com/ailon/markerjs2/releases/tag/v2.28.0
[2.27.0]: https://github.com/ailon/markerjs2/releases/tag/v2.27.0
[2.26.0]: https://github.com/ailon/markerjs2/releases/tag/v2.26.0
[2.25.0]: https://github.com/ailon/markerjs2/releases/tag/v2.25.0
[2.24.0]: https://github.com/ailon/markerjs2/releases/tag/v2.24.0
[2.23.0]: https://github.com/ailon/markerjs2/releases/tag/v2.23.0
[2.22.0]: https://github.com/ailon/markerjs2/releases/tag/v2.22.0
[2.21.6]: https://github.com/ailon/markerjs2/releases/tag/v2.21.6
[2.21.5]: https://github.com/ailon/markerjs2/releases/tag/v2.21.5
[2.21.4]: https://github.com/ailon/markerjs2/releases/tag/v2.21.4
[2.21.3]: https://github.com/ailon/markerjs2/releases/tag/v2.21.3
[2.21.2]: https://github.com/ailon/markerjs2/releases/tag/v2.21.2
[2.21.1]: https://github.com/ailon/markerjs2/releases/tag/v2.21.1
[2.21.0]: https://github.com/ailon/markerjs2/releases/tag/v2.21.0
[2.20.0]: https://github.com/ailon/markerjs2/releases/tag/v2.20.0
[2.19.0]: https://github.com/ailon/markerjs2/releases/tag/v2.19.0
[2.18.0]: https://github.com/ailon/markerjs2/releases/tag/v2.18.0
[2.17.2]: https://github.com/ailon/markerjs2/releases/tag/v2.17.2
[2.17.1]: https://github.com/ailon/markerjs2/releases/tag/v2.17.1
[2.17.0]: https://github.com/ailon/markerjs2/releases/tag/v2.17.0
[2.16.2]: https://github.com/ailon/markerjs2/releases/tag/v2.16.2
[2.16.1]: https://github.com/ailon/markerjs2/releases/tag/v2.16.1
[2.16.0]: https://github.com/ailon/markerjs2/releases/tag/v2.16.0
[2.15.0]: https://github.com/ailon/markerjs2/releases/tag/v2.15.0
[2.14.1]: https://github.com/ailon/markerjs2/releases/tag/v2.14.1
[2.14.0]: https://github.com/ailon/markerjs2/releases/tag/v2.14.0
[2.13.0]: https://github.com/ailon/markerjs2/releases/tag/v2.13.0
[2.12.0]: https://github.com/ailon/markerjs2/releases/tag/v2.12.0
[2.11.2]: https://github.com/ailon/markerjs2/releases/tag/v2.11.2
[2.11.1]: https://github.com/ailon/markerjs2/releases/tag/v2.11.1
[2.11.0]: https://github.com/ailon/markerjs2/releases/tag/v2.11.0
[2.10.0]: https://github.com/ailon/markerjs2/releases/tag/v2.10.0
[2.9.0]: https://github.com/ailon/markerjs2/releases/tag/v2.9.0
[2.8.4]: https://github.com/ailon/markerjs2/releases/tag/v2.8.4
[2.8.3]: https://github.com/ailon/markerjs2/releases/tag/v2.8.3
[2.8.2]: https://github.com/ailon/markerjs2/releases/tag/v2.8.2
[2.8.1]: https://github.com/ailon/markerjs2/releases/tag/v2.8.1
[2.8.0]: https://github.com/ailon/markerjs2/releases/tag/v2.8.0
[2.7.1]: https://github.com/ailon/markerjs2/releases/tag/v2.7.1
[2.7.0]: https://github.com/ailon/markerjs2/releases/tag/v2.7.0
[2.6.2]: https://github.com/ailon/markerjs2/releases/tag/v2.6.2
[2.6.1]: https://github.com/ailon/markerjs2/releases/tag/v2.6.1
[2.6.0]: https://github.com/ailon/markerjs2/releases/tag/v2.6.0
[2.5.0]: https://github.com/ailon/markerjs2/releases/tag/v2.5.0
[2.4.1]: https://github.com/ailon/markerjs2/releases/tag/v2.4.1
[2.4.0]: https://github.com/ailon/markerjs2/releases/tag/v2.4.0
[2.3.3]: https://github.com/ailon/markerjs2/releases/tag/v2.3.3
[2.3.2]: https://github.com/ailon/markerjs2/releases/tag/v2.3.2
[2.3.1]: https://github.com/ailon/markerjs2/releases/tag/v2.3.1
[2.3.0]: https://github.com/ailon/markerjs2/releases/tag/v2.3.0
[2.2.0]: https://github.com/ailon/markerjs2/releases/tag/v2.2.0
[2.1.1]: https://github.com/ailon/markerjs2/releases/tag/v2.1.1
[2.1.0]: https://github.com/ailon/markerjs2/releases/tag/v2.1.0
[2.0.0]: https://github.com/ailon/markerjs2/releases/tag/v2.0.0
[2.0.0-rc.7]: https://github.com/ailon/markerjs2/releases/tag/v2.0.0-rc.7
[2.0.0-rc.6]: https://github.com/ailon/markerjs2/releases/tag/v2.0.0-rc.6
[2.0.0-rc.5]: https://github.com/ailon/markerjs2/releases/tag/v2.0.0-rc.5
[2.0.0-rc.4]: https://github.com/ailon/markerjs2/releases/tag/v2.0.0-rc.4
[2.0.0-rc.3]: https://github.com/ailon/markerjs2/releases/tag/v2.0.0-rc.3
[2.0.0-rc.2]: https://github.com/ailon/markerjs2/releases/tag/v2.0.0-rc.2
[2.0.0-rc.1]: https://github.com/ailon/markerjs2/releases/tag/v2.0.0-rc.1
[2.0.0-rc.0]: https://github.com/ailon/markerjs2/releases/tag/v2.0.0-rc.0
[2.0.0-beta.4]: https://github.com/ailon/markerjs2/releases/tag/v2.0.0-beta.4
[2.0.0-beta.3]: https://github.com/ailon/markerjs2/releases/tag/v2.0.0-beta.3
[2.0.0-beta.2]: https://github.com/ailon/markerjs2/releases/tag/v2.0.0-beta.2
[2.0.0-beta.1]: https://github.com/ailon/markerjs2/releases/tag/v2.0.0-beta.1
[2.0.0-beta.0]: https://github.com/ailon/markerjs2/releases/tag/v2.0.0-beta.0
[2.0.0-alpha.2]: https://github.com/ailon/markerjs2/releases/tag/v2.0.0-alpha.2