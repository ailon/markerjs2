# marker.js 2 &mdash; Let your users annotate and mark images

marker.js 2 is a JavaScript browser library to enable image annotation in your web applications. Add marker.js 2 to your web app and instantly enable users to annotate and mark up images. You can save, share or otherwise process the results.

## Installation

```
npm install markerjs2
```

or 

```
yarn add markerjs2
```

## Usage

To add image annotation to your web application follow these 3 easy steps:

1. Create an instance of `markerjs2.MarkerArea` by passing a target image reference to the constructor.
2. Set an event handler for `render` event.
3. Call the `show()` method.

Here's a simple example:

```js
import * as markerjs2 from 'markerjs2';

let markerArea = new markerjs2.MarkerArea(document.getElementById('myimg'));
markerArea.addRenderEventListener(dataUrl => {
  document.getElementById('myimg').src = dataUrl;
});
markerArea.show();
```

## Credits

marker.js 2 is using icons from [Material Design Icons](https://materialdesignicons.com/) for its toolbar.

## License
Linkware (see [LICENSE](https://github.com/ailon/markerjs2/blob/master/LICENSE) for details) - the UI displays a small link back to the marker.js 2 website which should be retained.

Alternative licenses are available through the [marker.js 2 website](https://markerjs.com).