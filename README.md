# Configuration / Settings Service for Angular

[![GitHub Actions Status](https://github.com/DagonMetric/ng-config/workflows/Main%20Workflow/badge.svg)](https://github.com/DagonMetric/ng-config/actions)
[![Azure Pipelines Status](https://dev.azure.com/DagonMetric/ng-config/_apis/build/status/DagonMetric.ng-config?branchName=master)](https://dev.azure.com/DagonMetric/ng-config/_build/latest?definitionId=9&branchName=master)
[![codecov](https://codecov.io/gh/DagonMetric/ng-config/branch/master/graph/badge.svg)](https://codecov.io/gh/DagonMetric/ng-config)
[![npm version](https://img.shields.io/npm/v/@dagonmetric/ng-config.svg)](https://www.npmjs.com/package/@dagonmetric/ng-config)
[![Gitter](https://badges.gitter.im/DagonMetric/general.svg)](https://gitter.im/DagonMetric/general?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Configuration / settings service for Angular applications.

## Features

* Extendable `ConfigProvider` (see built-in [HttpConfigProvider](https://github.com/DagonMetric/ng-config/blob/master/modules/ng-config/http-config-provider/src/http-config-provider.ts) for implementation demo)
* Load settings when Angular app starts with `APP_INITIALIZER` factory
* Latest versions of Angular are supported
* Compatible with Angular Universal (Server Side Rendering - SSR)
* Powered with RxJS

## Getting Started

### Installation

npm

```bash
npm install @dagonmetric/ng-config
```

or yarn

```bash
yarn add @dagonmetric/ng-config
```

### Module Setup (app.module.ts)

The following code is a simple module setup.

```typescript
import { ConfigModule } from '@dagonmetric/ng-config';
import { HttpConfigProviderModule } from '@dagonmetric/ng-config/http-config-provider';

@NgModule({
  imports: [
    // Other module imports

    // ng-config modules
    ConfigModule.init(),
    HttpConfigProviderModule.withOptions({
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

* [ng-config wiki](https://github.com/DagonMetric/ng-config/wiki)

## Feedback and Contributing

Check out the [Contributing](https://github.com/DagonMetric/ng-config/blob/master/CONTRIBUTING.md) page to see the best places to log issues and start discussions.

## License

This repository is licensed with the [MIT](https://github.com/DagonMetric/ng-config/blob/master/LICENSE) license.
