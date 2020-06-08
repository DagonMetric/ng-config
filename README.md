# Configuration & Options Service for Angular

[![GitHub Actions Status](https://github.com/DagonMetric/ng-config/workflows/Main%20Workflow/badge.svg)](https://github.com/DagonMetric/ng-config/actions)
[![Azure Pipelines Status](https://dev.azure.com/DagonMetric/ng-config/_apis/build/status/DagonMetric.ng-config?branchName=master)](https://dev.azure.com/DagonMetric/ng-config/_build?definitionId=9)
[![codecov](https://codecov.io/gh/DagonMetric/ng-config/branch/master/graph/badge.svg)](https://codecov.io/gh/DagonMetric/ng-config)
[![npm version](https://img.shields.io/npm/v/@dagonmetric/ng-config.svg)](https://www.npmjs.com/package/@dagonmetric/ng-config)
[![Gitter](https://badges.gitter.im/DagonMetric/general.svg)](https://gitter.im/DagonMetric/general?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

The `ng-config` is a configuration and options service for Angular applications with flexible api and extendable config providers.

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

    // ng-config modules
    ConfigModule.configure(),
    HttpConfigProviderModule.configure({
        endpoint: '/api/v1/configuration'
    }),
    // And additional config provider imports...
  ]
})
export class AppModule { }
```

### Usage

```typescript
import { Component } from '@angular/core';

import { ConfigService } from '@dagonmetric/ng-config';

export class AppOptions {
  name = '';
  lang = '';
  logEnabled = false;
  logLevel = 0;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private readonly configService: ConfigService) {
    // Get with key
    const configValue = this.configService.getValue('key1'));
    console.log('value: ', configValue);

    // Get with options class
    const appOptions = this.configService.mapType(AppOptions));
    console.log('appOptions: ', JSON.stringify(appOptions));

    // Configuration value change detection
    this.configService.valueChanges.subscribe(()=> {
      const latestValue = this.configService.getValue('key1'));
      console.log('latest value: ', latestValue);

      const lastestOptions = this.configService.mapType(AppOptions));
      console.log('lastest appOptions: ', lastestOptions);
    });
  }
}
```

## Documentation

* [ng-config wiki](https://github.com/DagonMetric/ng-config/wiki)

## Integrations

* [ng-config-firebase-remote-config](https://github.com/DagonMetric/ng-config-firebase-remote-config) - Firebase Remote Config implementation for [ConfigProvider](https://github.com/DagonMetric/ng-config/blob/master/modules/ng-config/src/config-provider.ts)

## Feedback and Contributing

Check out the [Contributing](https://github.com/DagonMetric/ng-config/blob/master/CONTRIBUTING.md) page.

## License

This repository is licensed with the [MIT](https://github.com/DagonMetric/ng-config/blob/master/LICENSE) license.
