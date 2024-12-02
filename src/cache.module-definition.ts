import { ConfigurableModuleBuilder, Provider } from '@nestjs/common';
import { CacheModuleOptions } from './interfaces';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<CacheModuleOptions>({ moduleName: 'Cache' })
  .setFactoryMethodName('createCacheOptions')
  .setExtras<{
    isGlobal: boolean;
    extraProviders: Provider[];
  }>(
    {
      isGlobal: false,
      extraProviders: [],
    },
    (definition, extras) => {
      return {
        ...definition,
        providers: (definition.providers ?? []).concat(extras.extraProviders),
        global: extras.isGlobal,
      };
    },
  )
  .build();
