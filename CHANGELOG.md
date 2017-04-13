## Changelog

-   [2.2.6 (2017–04–13)](#226-20170413)
-   [2.2.3 (2017–04–13)](#223-20170413)
-   [2.2.2 (2017–04–13)](#222-20170413)
-   [2.2.1 (2017–04–13)](#221-20170413)

## 2.2.6 (2017–04–13)

### Added

-   [`c91d2ed`][1] Make dataset properties enumerable ([#6][2])

    This might better reflect what the original code intended to do…

## 2.2.3 (2017–04–13)

### Added

-   [`51e3e93`][3] Use HTMLElement.prototype instead of Element.prototype

    In a browser with native support:

    `'dataset' in HTMLElement.prototype` → `true`
    `'dataset' in Element.prototype` → `false`

    See [https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset][4]

## 2.2.2 (2017–04–13)

### Fixed

-   [`7832fa2`][5] transpile es build target

    Closes [#3][6]

## 2.2.1 (2017–04–13)

### Tests

-   [`fa61402`][7] travis-ci & browserstack

[1]: https://github.com/epiloque/element-dataset/commit/c91d2ed78fdc25465bdca2ddb13fbb0813844808

[2]: https://github.com/epiloque/element-dataset/issues/6

[3]: https://github.com/epiloque/element-dataset/commit/51e3e939c0d85af4d70259eb6f550de430d6a1f7

[4]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset

[5]: https://github.com/epiloque/element-dataset/commit/7832fa276a6fb538c99ae9bc93a384da1f83f84c

[6]: https://github.com/epiloque/element-dataset/issues/3

[7]: https://github.com/epiloque/element-dataset/commit/fa614028a77618cb8564fb895b48545952160c90
