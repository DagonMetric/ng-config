# StaticConfigLoaderModule

Implements [ConfigLoader](https://github.com/DagonMetric/ng-translit/blob/master/modules/ng-config/src/config-loader.ts) for providing static config data.

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
