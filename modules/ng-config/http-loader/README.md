# HttpConfigLoaderModule

Implements an HTTP client API for [ConfigLoader](https://github.com/DagonMetric/ng-translit/blob/master/modules/ng-config/src/config-loader.ts) that relies on the Angular `HttpClient`.

## Getting Started

### Module Setup (app.module.ts)

```typescript
import { ConfigModule } from '@dagonmetric/ng-config';
import { HttpConfigLoaderModule } from '@dagonmetric/ng-config/http-loader';

@NgModule({
  imports: [
    // Other module imports

    // ng-config
    ConfigModule,
    HttpConfigLoaderModule.withOptions({
      endpoint: '/appsettings.json'
    })
  ]
})
export class AppModule { }
```

For more configuring information, see [HttpConfigLoaderModule wiki](https://github.com/DagonMetric/ng-config/wiki/HttpConfigLoaderModule).
