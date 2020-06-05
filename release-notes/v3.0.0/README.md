## Fetures

* strongly typed options mapping with options classes *(e.g. `const options = config.map<IdentityOptions>`)*
* Custom options class name suffix support in `ConfigOptions`
* Custom logger support in `ConfigOptions`
* Configuration values change detection with `valueChanges` observable

## Changes

* Rename `ConfigLoader` to `ConfigProvider`
* Change `ConfigService.providerNames` to `ConfigService.providers`
* Remove `loadEvent` from `ConfigService`
* Remove `StaticConfigLoader`
* Update package dependencies

npm packages are available on:

* [@dagonmetric/ng-config - npm registry](https://www.npmjs.com/package/@dagonmetric/ng-config)
* [@dagonmetric/ng-config - github package registry](https://github.com/DagonMetric/ng-config/packages)
