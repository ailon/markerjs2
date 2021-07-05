# marker.js 2 Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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