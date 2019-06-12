[![Build Status](https://dev.azure.com/DagonMetric/ng-config/_apis/build/status/DagonMetric.ng-config?branchName=master)](https://dev.azure.com/DagonMetric/ng-config/_build/latest?definitionId=9&branchName=master)
[![Build status](https://ci.appveyor.com/api/projects/status/sglpbayjta323oi6/branch/master?svg=true)](https://ci.appveyor.com/project/admindagonmetriccom/ng-config/branch/master)
[![codecov](https://codecov.io/gh/DagonMetric/ng-config/branch/master/graph/badge.svg)](https://codecov.io/gh/DagonMetric/ng-config)
[![npm version](https://img.shields.io/npm/v/@dagonmetric/ng-config.svg)](https://www.npmjs.com/package/@dagonmetric/ng-config)
[![Dependency Status](https://david-dm.org/DagonMetric/ng-config.svg)](https://david-dm.org/DagonMetric/ng-config)
[![Gitter](https://badges.gitter.im/DagonMetric/general.svg)](https://gitter.im/DagonMetric/general?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# Configuration Service Package for Angular

## Features

* Extendable `ConfigLoader` (see built-in [HttpConfigLoader](https://github.com/DagonMetric/ng-config/blob/master/modules/ng-config/http-loader/src/http-config-loader.ts) for implementation demo)
* Load settings when Angular app starts with `APP_INITIALIZER` factory
* Latest versions of Angular are supported
* Compatible with Angular Universal (Server Side Rendering - SSR)
* Powered with RxJS

## Getting Started

### Installation

npm

```shell
npm install @dagonmetric/ng-config
```

or yarn

```shell
yarn add @dagonmetric/ng-config
```

### Module Setup (app.module.ts)

The following code is a simple module setup.

```typescript
import { ConfigModule } from '@dagonmetric/ng-config';
import { HttpConfigLoaderModule } from '@dagonmetric/ng-config/http-loader';

@NgModule({
  imports: [
    // Other module imports

    // ng-config module
    ConfigModule.init(),
    HttpConfigLoaderModule.withOptions({
        endpoint: '/appsettings.json'
    })
  ]
})
export class AppModule { }
```

### Usage (app.component.ts)

```typescript
import { Component } from '@angular/core';

import { ConfigService } from '@dagonmetric/ng-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private readonly _configService: ConfigService) {
    const configValue = this._configService.getValue<string>('key1'));
  }
}
```

## Documentation

[Wiki](https://github.com/DagonMetric/ng-config/wiki)

## Feedback and Contributing

Check out the [Contributing](https://github.com/DagonMetric/ng-config/blob/master/CONTRIBUTING.md) page to see the best places to log issues and start discussions.

## License

This repository is licensed with the [MIT](https://github.com/DagonMetric/ng-config/blob/master/LICENSE) license.
