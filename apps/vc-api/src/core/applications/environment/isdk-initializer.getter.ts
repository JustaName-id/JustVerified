import { JustaName } from '@justaname.id/sdk';

export const SDK_INITIALIZER_GETTER = 'SDK_INITIALIZER_GETTER'

export interface ISdkInitializerGetter {
  getInitializedSdk(): JustaName;
}
