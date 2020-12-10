# marker.js 2 Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[2.0.0-beta.2]: https://github.com/ailon/markerjs2/releases/tag/v2.0.0-beta.2
[2.0.0-beta.1]: https://github.com/ailon/markerjs2/releases/tag/v2.0.0-beta.1
[2.0.0-beta.0]: https://github.com/ailon/markerjs2/releases/tag/v2.0.0-beta.0
[2.0.0-alpha.2]: https://github.com/ailon/markerjs2/releases/tag/v2.0.0-alpha.2