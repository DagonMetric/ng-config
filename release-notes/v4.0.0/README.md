## Features

* Add `mapObject()` function in `ConfigService` to map config values with options object
* Add `ensureInitialized()` function in `ConfigService` to ensure fetched data to be activated

## Changes

* Rename `init({...})` to `configure(loadOnStartUp: boolean = true, options: ConfigOptions)` in `ConfigModule`
* Rename `init({...})` to `configure({...})` in `HttpConfigProviderModule`
* Rename `load(reload = true)` to `reload()` in `ConfigService`
* Rename `map()` to `mapType()` in `ConfigService`
* Change custom logger options to InjectionToken
* Remove `ConfigPipe`
* Other bug fixes and performance improvements
* Update package dependencies

npm packages are available on:

* [@dagonmetric/ng-config - npm registry](https://www.npmjs.com/package/@dagonmetric/ng-config)
* [@dagonmetric/ng-config - github package registry](https://github.com/DagonMetric/ng-config/packages)
