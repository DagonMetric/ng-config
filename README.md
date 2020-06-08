# Configuration & Options Service for Angular

[![GitHub Actions Status](https://github.com/DagonMetric/ng-config/workflows/Main%20Workflow/badge.svg)](https://github.com/DagonMetric/ng-config/actions)
[![Azure Pipelines Status](https://dev.azure.com/DagonMetric/ng-config/_apis/build/status/DagonMetric.ng-config?branchName=master)](https://dev.azure.com/DagonMetric/ng-config/_build?definitionId=9)
[![codecov](https://codecov.io/gh/DagonMetric/ng-config/branch/master/graph/badge.svg)](https://codecov.io/gh/DagonMetric/ng-config)
[![npm version](https://img.shields.io/npm/v/@dagonmetric/ng-config.svg)](https://www.npmjs.com/package/@dagonmetric/ng-config)
[![Gitter](https://badges.gitter.im/DagonMetric/general.svg)](https://gitter.im/DagonMetric/general?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

The `ng-config` is a configuration and options service for Angular applications with flexible api and extendable config providers.

## Features

* Flexible strongly typed options mapping with options classes *(e.g. `const options = config.map<IdentityOptions>`)*
* Extendable `ConfigProvider` (see built-in [HttpConfigProvider](https://github.com/DagonMetric/ng-config/blob/master/modules/ng-config/http-config-provider/src/http-config-provider.ts) for implementation demo)
* Multiple configuration providers / loaders are supported
* Configuration value change detection with `valueChanges` observable
* Load configuration when Angular app starts with `APP_INITIALIZER` factory
* Latest versions of Angular are supported
* Compatible with Angular Universal (Server Side Rendering - SSR)

## Get Started

### Installation

npm

```bash
npm install @dagonmetric/ng-config
```

or yarn

```bash
yarn add @dagonmetric/ng-config
```

### Module Setup

```typescript
import { ConfigModule } from '@dagonmetric/ng-config';
import { HttpConfigProviderModule } from '@dagonmetric/ng-config/http-config-provider';

@NgModule({
  imports: [
    // Other module imports

    // ng-config module
    ConfigModule.init(),
    HttpConfigProviderModule.init({
        endpoint: '/appsettings.json'
    })
  ]
})
export class AppModule { }
```

### Usage

```typescript
import { Component } from '@angular/core';

import { ConfigService } from '@dagonmetric/ng-config';

export class IdentityOptions {
  popupRedirectUri = ';
  automaticSilentRenew = true;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private readonly configService: ConfigService) {
    // Get with key
    const configValue = this.configService.getValue('key1'));
    console.log('configValue: ', configValue);

    // Get with options class
    const identityOptions = this.configService.map(IdentityOptions));
    console.log('identityOptions: ', identityOptions);

    // Change detection
    this.configService.valueChanges.subscribe(()=> {
      const lastestOptions = this.configService.map(IdentityOptions));
      console.log('lastestOptions: ', lastestOptions);
    });
  }
}
```

## Documentation

* [ng-config wiki](https://github.com/DagonMetric/ng-config/wiki)

## Sub-modules

* [http-config-provider](https://github.com/DagonMetric/ng-config/tree/master/modules/ng-config/http-config-provider) - Implements an HTTP client API for [ConfigProvider](https://github.com/DagonMetric/ng-config/blob/master/modules/ng-config/src/config-provider.ts) that relies on the Angular `HttpClient`

## Integrations

* [ng-config-firebase-remote-config](https://github.com/DagonMetric/ng-config-firebase-remote-config) - Firebase Remote Config implementation for `ConfigProvider`

## Feedback and Contributing

Check out the [Contributing](https://github.com/DagonMetric/ng-config/blob/master/CONTRIBUTING.md) page to see the best places to log issues and start discussions.

## License

This repository is licensed with the [MIT](https://github.com/DagonMetric/ng-config/blob/master/LICENSE) license.
