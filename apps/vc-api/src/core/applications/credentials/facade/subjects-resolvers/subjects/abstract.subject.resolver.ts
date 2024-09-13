import {
  CredentialSubject,
  CredentialSubjectValue,
  EthereumEip712Signature2021,
  VerifiedEthereumEip712Signature2021,
} from '../../../../../domain/entities/eip712';
import { ICredentialCreator } from '../../../creator/icredential.creator';
import { TimeGenerator } from '../../../../time.generator';
import { AllCallback } from './callback/all.callback';
import { IEnvironmentGetter } from '../../../../environment/ienvironment.getter';
import { CredentialCallbackResponse } from '../../credential.callback.response';

/* eslint-disable @typescript-eslint/ban-types */
export abstract class AbstractSubjectResolver<
  T extends AllCallback = {},
  K extends CredentialSubjectValue = {}
> {
  credentialCreator: ICredentialCreator;
  dateGenerator: TimeGenerator;
  environmentGetter: IEnvironmentGetter;
  protected constructor(
    injectedCredentialCreator: ICredentialCreator,
    injectedDateGenerator: TimeGenerator,
    injectedEnvironmentGetter: IEnvironmentGetter
  ) {
    this.credentialCreator = injectedCredentialCreator;
    this.dateGenerator = injectedDateGenerator;
    this.environmentGetter = injectedEnvironmentGetter;
  }

  abstract getCredentialName(): string;

  abstract getType(): string[];

  abstract getContext(): string[];

  abstract getAuthUrl(): string;

  abstract callbackSuccessful(
    data: T
  ): Promise<VerifiedEthereumEip712Signature2021>;

  abstract getCallbackParameters(): string[];

  getDataKey(): string {
    return (
      this.getCredentialName().toLowerCase() +
      '_' +
      this.environmentGetter.getEnsDomain().toLowerCase()
    );
  }

  getCallbackUrl(): string {
    return `${this.environmentGetter.getApiDomain()}/auth/${this.getCredentialName()}/callback`;
  }

  async callback(data: T): Promise<CredentialCallbackResponse> {
    if (this.checkCallbackParametersHaveAllRequiredFields(data)) {
      const vc = await this.callbackSuccessful(data);
      this.successfulVerification(vc);
      return {
        dataKey: this.getDataKey(),
        verifiableCredential: vc,
      };
    } else {
      throw new Error('Callback parameters are missing');
    }
  }

  checkCallbackParametersHaveAllRequiredFields(data: T): boolean {
    return this.getCallbackParameters().every(
      (param) => data[param] !== undefined
    );
  }

  getExpirationPeriod(): number {
    return 3;
  }

  // TODO: Implement this
  successfulVerification(
    vc: VerifiedEthereumEip712Signature2021
  ): Promise<void> {
    return Promise.resolve();
  }

  async generateCredentialSubject(
    credentialSubject: CredentialSubject & K
  ): Promise<VerifiedEthereumEip712Signature2021<K>> {
    const ethereumEip712Signature2021 = new EthereumEip712Signature2021<K>({
      type: this.getType(),
      context: this.getContext(),
      credentialSubject: credentialSubject,
      issuanceDate: this.dateGenerator.generate(),
      expirationDate: new Date(
        this.dateGenerator.generateWithOffset(
          this.getExpirationPeriod(),
          'months'
        )
      ),
    });

    const verified = (await this.credentialCreator.createCredential(
      ethereumEip712Signature2021
    )) as VerifiedEthereumEip712Signature2021<K>;

    return verified;
  }
}
