# HttpConfigProviderModule

Implements an HTTP client API for [ConfigProvider](https://github.com/DagonMetric/ng-config/blob/master/modules/ng-config/src/config-provider.ts) that relies on the Angular `HttpClient`.

## Getting Started

### Module Setup (app.module.ts)

```typescript
import { ConfigModule } from '@dagonmetric/ng-config';
import { HttpConfigProviderModule } from '@dagonmetric/ng-config/http-config-provider';

@NgModule({
  imports: [
    // Other module imports

    // ng-config
    ConfigModule,
    HttpConfigProviderModule.withOptions({
      endpoint: '/appsettings.json'
    })
  ]
})
export class AppModule { }
```

For more configuring information, see [HttpConfigProviderModule wiki](https://github.com/DagonMetric/ng-config/wiki/HttpConfigProviderModule).
