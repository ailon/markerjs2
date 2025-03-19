# marker.js 2 &mdash; Add image annotation to your web apps

> ⚠️ **Deprecation notice** ⚠️
>
> **marker.js 3** is out now. This means that while marker.js 2 will be supported for some time, all future development will be focused on version 3 and beyond. Get the most current version information on [markerjs.com](https://markerjs.com)

marker.js 2 is a JavaScript browser library to enable image annotation in your web applications. Add marker.js 2 to your web app and instantly enable users to annotate and mark up images. You can save, share or otherwise process the results.

> For a more detailed "Getting started" and other docs and tutorials, please refer to the [official documentation](https://markerjs.com/docs).

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
// skip this line if you are importing markerjs2 into the global space via the script tag
import * as markerjs2 from 'markerjs2';

// create an instance of MarkerArea and pass the target image reference as a parameter
let markerArea = new markerjs2.MarkerArea(document.getElementById('myimg'));

// register an event listener for when user clicks OK/save in the marker.js UI
markerArea.addEventListener('render', (event) => {
  // we are setting the markup result to replace our original image on the page
  // but you can set a different image or upload it to your server
  document.getElementById('myimg').src = event.dataUrl;
});

// finally, call the show() method and marker.js UI opens
markerArea.show();
```

## Demos

Check out [marker.js 2 demos](https://markerjs.com/demos) for various usage examples.

## More docs and tutorials

For a more detailed "Getting started" and other docs and tutorials, please refer to
the [official documentation](https://markerjs.com/docs).

## Credits

marker.js 2 is using icons from [Material Design Icons](https://materialdesignicons.com/) for its toolbar.

## License

Linkware (see [LICENSE](https://github.com/ailon/markerjs2/blob/master/LICENSE) for details) - the UI displays a small link back to the marker.js 2 website which should be retained.

Alternative licenses are available through the [marker.js 2 website](https://markerjs.com).
