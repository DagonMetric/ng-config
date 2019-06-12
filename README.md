[![Build Status](https://dev.azure.com/DagonMetric/ng-config/_apis/build/status/DagonMetric.ng-config?branchName=master)](https://dev.azure.com/DagonMetric/ng-config/_build/latest?definitionId=9&branchName=master)
[![Build status](https://ci.appveyor.com/api/projects/status/sglpbayjta323oi6/branch/master?svg=true)](https://ci.appveyor.com/project/admindagonmetriccom/ng-config/branch/master)
[![codecov](https://codecov.io/gh/DagonMetric/ng-config/branch/master/graph/badge.svg)](https://codecov.io/gh/DagonMetric/ng-config)
[![npm version](https://img.shields.io/npm/v/@dagonmetric/ng-config.svg)](https://www.npmjs.com/package/@dagonmetric/ng-config)
[![Dependency Status](https://david-dm.org/DagonMetric/ng-config.svg)](https://david-dm.org/DagonMetric/ng-config)
[![Gitter](https://badges.gitter.im/DagonMetric/general.svg)](https://gitter.im/DagonMetric/general?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

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
