# StaticConfigProviderModule

Implements [ConfigProvider](https://github.com/DagonMetric/ng-config/blob/master/modules/ng-config/src/config-provider.ts) for providing static config data.

## Getting Started

### Module Setup (app.module.ts)

```typescript
import { ConfigModule } from '@dagonmetric/ng-config';
import { StaticConfigProviderModule } from '@dagonmetric/ng-config/static-config-provider';

@NgModule({
  imports: [
    // Other module imports

    // ng-config
    ConfigModule,
    StaticConfigProviderModule.withOptions({
      data: {
        applicationName: 'ng-config',
        defaultLang: 'en'
      }
    })
  ]
})
export class AppModule { }
```

For more configuring information, see [StaticConfigProviderModule wiki](https://github.com/DagonMetric/ng-config/wiki/StaticConfigProviderModule).
