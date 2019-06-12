# Configuration Service Modules for Angular

Contains configuration service modules for Angular applications.

## Modules

[ng-config](modules/ng-config)

Configuration core service package.

[ng-config-static-loader](modules/ng-config/static-loader)

Implements a static data loader for `ConfigLoader`.

[ng-config-http-loader](modules/ng-config/http-loader)

Implements an HTTP client API for `ConfigLoader` that relies on the Angular `HttpClient`.

## Features

* Extendable `ConfigLoader` (see built-in [HttpConfigLoader](https://github.com/DagonMetric/ng-config/blob/master/modules/ng-config/http-loader/src/http-config-loader.ts) for implementation demo)
* Latest versions of Angular are supported
* Compatible with Angular Universal (Server Side Rendering - SSR)
* Powered with RxJS

## Getting Started

* [Documentation](https://github.com/DagonMetric/ng-config/wiki)

## Feedback and Contributing

Check out the [Contributing](https://github.com/DagonMetric/ng-config/blob/master/CONTRIBUTING.md) page to see the best places to log issues and start discussions.

## License

This repository is licensed with the [MIT](https://github.com/DagonMetric/ng-config/blob/master/LICENSE) license.
