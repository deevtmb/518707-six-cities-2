import { ConfigSchema } from './config.schema.js';

export interface ConfigInterface {
  get(key: string): string | undefined;
  get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T];
}
