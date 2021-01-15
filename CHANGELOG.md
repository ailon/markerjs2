# marker.js 2 Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[2.2.0]: https://github.com/ailon/markerjs2/releases/tag/v2.1.0
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