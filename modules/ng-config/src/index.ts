/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

/**
 * Entry point for all public APIs of the ng-config package.
 */

export * from './config-options';
export * from './config-provider-token';
export * from './config-provider';
export * from './config-section';
export { configAppInitializerFactory, ConfigModule } from './config.module';
export { ConfigService, ConfigLoadingContext } from './config.service';
