ng-config
=====================

Contains configuration service for [Angular](https://angular.io/) application.

Installation
---------------

```bash
npm install @dagonmetric/ng-config
```

Setup
---------------

```typescript
import { ConfigModule, ConfigStaticLoaderModule } from '@dagonmetric/ng-config';

@NgModule({
    imports: [
        // Other module imports

        // Config
        ConfigModule.forRoot(),
        ConfigStaticLoaderModule.forRoot({ key1: 'value1' })
    ]
})
export class AppModule { }
```

Usage
---------------

```typescript
import { Component } from '@angular/core';

import { ConfigService } from '@dagonmetric/ng-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
    constructor(private readonly _configService: ConfigService) {
        const allSettings = this._configService.getSettings();
        console.log('settings: ', allSettings);

        const loggingSettings = this._configService.getSettings<LoggingOptions>('logging');
        console.log('loggingSettings: ', loggingSettings);
    }
}
```