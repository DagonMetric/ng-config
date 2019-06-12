[![Build Status](https://dev.azure.com/DagonMetric/ng-config/_apis/build/status/DagonMetric.ng-config?branchName=master)](https://dev.azure.com/DagonMetric/ng-config/_build/latest?definitionId=9&branchName=master)
[![Build status](https://ci.appveyor.com/api/projects/status/sglpbayjta323oi6/branch/master?svg=true)](https://ci.appveyor.com/project/admindagonmetriccom/ng-config/branch/master)
[![codecov](https://codecov.io/gh/DagonMetric/ng-config/branch/master/graph/badge.svg)](https://codecov.io/gh/DagonMetric/ng-config)
[![npm version](https://img.shields.io/npm/v/@dagonmetric/ng-config.svg)](https://www.npmjs.com/package/@dagonmetric/ng-config)
[![Dependency Status](https://david-dm.org/DagonMetric/ng-config.svg)](https://david-dm.org/DagonMetric/ng-config)
[![Gitter](https://badges.gitter.im/DagonMetric/general.svg)](https://gitter.im/DagonMetric/general?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# StaticConfigLoaderModule

Implements [ConfigLoader](https://github.com/DagonMetric/ng-config/blob/master/modules/ng-config/src/config-loader.ts) for providing static config data.

## Getting Started

### Module Setup (app.module.ts)

```typescript
import { ConfigModule } from '@dagonmetric/ng-config';
import { StaticConfigLoaderModule } from '@dagonmetric/ng-config/static-loader';

@NgModule({
  imports: [
    // Other module imports

    // ng-config
    ConfigModule,
    StaticConfigLoaderModule.withSettings({
      applicationName: 'ng-config',
      defaultLang: 'en'
    })
  ]
})
export class AppModule { }
```

For more configuring information, see [StaticConfigLoaderModule wiki](https://github.com/DagonMetric/ng-config/wiki/StaticConfigLoaderModule).
