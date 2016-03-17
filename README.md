
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]

# [element-dataset](https://github.com/epiloque/element-dataset)

Polyfills the HTMLElement.dataset property, does not overdrive the prototype
with non-standard methods, falls back to native implementation. Tested on IE
8/9/10, Chrome 16+, FireFox 5+.

To start using in your website,
[download](https://github.com/epiloque/element-dataset/releases) the AMD module.

Or install it as a npm module (supports Webpack and Browserify): 

```sh
$ npm install --save element-dataset
```

# [Thanks](https://github.com/epiloque/element-dataset#Thanks)

Thanks to [Brett Zamir](https://github.com/brettz9), [Elijah Grey](https://github.com/eligrey)

Thanks to BrowserStack for providing the infrastructure that allows us to run
our build in real browsers.

# [License](https://github.com/epiloque/element-dataset#License)

element-dataset is released under the terms of the BSD-3-Clause license.

This software includes or is derivative of works distributed under the licenses
listed below. Please refer to the specific files and/or packages for more
detailed information about the authors, copyright notices, and licenses.

* Elijah Grey's
  [html5-dataset.js](https://github.com/adamancini/html5-dataset/blob/master/html5-dataset.js)
  is is released under the terms of the LGPL license.
* Brett Zamir's
  [html5-dataset.js](https://gist.github.com/brettz9/4093766#file_html5_dataset.js)
  is is released under the terms of the X11/MIT license.

[npm-url]: https://www.npmjs.com/package/element-dataset
[npm-image]: https://img.shields.io/npm/v/element-dataset.svg

[travis-url]: https://travis-ci.org/epiloque/element-dataset
[travis-image]: https://img.shields.io/travis/epiloque/element-dataset.svg
