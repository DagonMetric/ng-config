# Configuration & Options Service for Angular

[![GitHub Actions Status](https://github.com/DagonMetric/ng-config/workflows/Main%20Workflow/badge.svg)](https://github.com/DagonMetric/ng-config/actions)
[![Azure Pipelines Status](https://dev.azure.com/DagonMetric/ng-config/_apis/build/status/DagonMetric.ng-config?branchName=master)](https://dev.azure.com/DagonMetric/ng-config/_build?definitionId=9)
[![codecov](https://codecov.io/gh/DagonMetric/ng-config/branch/master/graph/badge.svg)](https://codecov.io/gh/DagonMetric/ng-config)
[![Gitter](https://badges.gitter.im/DagonMetric/general.svg)](https://gitter.im/DagonMetric/general?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

The `ng-config` is a configuration and options service for Angular applications with flexible api and extendable config providers.

## Features

* **`mapType(key, MyOptionsClass)`** - map configuration values with options class
* **`mapObject(key, myOptionsObj)`** - map configuration values with options object
* **`getValue('myKey')`** - get the raw configuration section value
* **`reload()`** - reload the fresh configuration values from config providers
* **`valueChanges`** - configuration value changes event
* **`ConfigProvider`** - extendable config provider interface and multiple config providers are supported
* **`ConfigModule.configure(true, {...})`** - load configuration automatically at app starts
* Latest version of Angular and compatible with server side rendering (SSR / Angular Universal)

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

Latest npm package is [![npm version](https://badge.fury.io/js/%40dagonmetric%2Fng-config.svg)](https://www.npmjs.com/package/@dagonmetric/ng-config)

### Module Setup (app.module.ts)

```typescript
import { ConfigModule } from '@dagonmetric/ng-config';
import { HttpConfigProviderModule } from '@dagonmetric/ng-config/http-config';

@NgModule({
  imports: [
    // Other module imports

    // ng-config modules
    ConfigModule.configure(true, {
      debug: true
    }),
    HttpConfigProviderModule.configure({
        endpoint: '/api/v1/configuration'
    }),
    // And additional config provider imports...
  ]
})
export class AppModule { }
```

Live edit [app.module.ts in stackblitz](https://stackblitz.com/github/dagonmetric/ng-config/tree/master/samples/demo-app?file=src%2Fapp%2Fapp.module.ts)

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
    const appOptions = this.configService.mapType('app', AppOptions));
    console.log('appOptions: ', JSON.stringify(appOptions));

    // Call reload to get the fresh config values from providers
    // this.configService.reload().subscribe(() => {
    //   console.log('Reloaded');
    // });

    // Configuration value change detection
    // This will only trigger when reload() is called and
    // any value changes
    this.configService.valueChanges.subscribe(() => {
      const latestValue = this.configService.getValue('key1'));
      console.log('latest value: ', latestValue);

      const lastestOptions = this.configService.mapType('app', AppOptions));
      console.log('lastest appOptions: ', lastestOptions);
    });
  }
}
```

Live edit [app.component.ts in stackblitz](https://stackblitz.com/github/dagonmetric/ng-config/tree/master/samples/demo-app?file=src%2Fapp%2Fapp.component.ts)

## Samples & Documentations

* Demo app [view source](https://github.com/DagonMetric/ng-config/tree/master/samples/demo-app) / [live edit in stackblitz](https://stackblitz.com/github/dagonmetric/ng-config/tree/master/samples/demo-app)
* Documentation wiki [ng-config wiki](https://github.com/DagonMetric/ng-config/wiki)

## Integrations

* [ng-config-firebase-remote-config](https://github.com/DagonMetric/ng-config-firebase-remote-config) - Implements [ConfigProvider](https://github.com/DagonMetric/ng-config/blob/master/modules/ng-config/src/config-provider.ts) for Firebase Remote Config

## Related Projects

* [ng-log](https://github.com/DagonMetric/ng-log) - Vendor-agnostic logging, analytics and telemetry service abstractions and some implementations for Angular applications
* [ng-cache](https://github.com/DagonMetric/ng-cache) - Caching service for Angular applications

## Build & Test Tools

We use [lib-tools](https://github.com/lib-tools/lib-tools) for bundling, testing and packaging our library projects.

[![Lib Tools](https://repository-images.githubusercontent.com/273890506/28038a00-dcea-11ea-8b4a-7d655158ccf2)](https://github.com/lib-tools/lib-tools)

## Feedback and Contributing

Check out the [Contributing](https://github.com/DagonMetric/ng-config/blob/master/CONTRIBUTING.md) page.

## License

This repository is licensed with the [MIT](https://github.com/DagonMetric/ng-config/blob/master/LICENSE) license.
