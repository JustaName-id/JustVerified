import {
  CredentialSubject,
  CredentialSubjectValue,
  EthereumEip712Signature2021,
  VerifiableEthereumEip712Signature2021,
} from '../../../../../domain/entities/eip712';
import { CREDENTIAL_CREATOR, ICredentialCreator } from '../../../creator/icredential.creator';
import { TIME_GENERATOR, TimeGenerator } from '../../../../time.generator';
import { AllCallback } from './callback/all.callback';
import { ENVIRONMENT_GETTER, IEnvironmentGetter } from '../../../../environment/ienvironment.getter';
import { CredentialCallbackResponse } from '../../credential.callback.response';
import { DID_RESOLVER, IDIDResolver } from '../../../../did/resolver/idid.resolver';
import { Inject } from '@nestjs/common';
import { CRYPTO_SERVICE, ICryptoService } from '../../../../crypto/icrypto.service';
import { HttpService } from '@nestjs/axios';
import { ENS_MANAGER_SERVICE, IEnsManagerService } from '../../../../ens-manager/iens-manager.service';
import { GetAuthUrlRequest } from './requests/get-auth-url.request';

/* eslint-disable @typescript-eslint/ban-types */
export abstract class AbstractSubjectResolver<
  T extends AllCallback = {},
  K extends CredentialSubjectValue = {}
> {

  @Inject(ENVIRONMENT_GETTER)
  protected readonly environmentGetter: IEnvironmentGetter
  @Inject(CREDENTIAL_CREATOR)
  protected readonly credentialCreator: ICredentialCreator
  @Inject(DID_RESOLVER)
  protected readonly didResolver: IDIDResolver
  @Inject(TIME_GENERATOR)
  protected readonly dateGenerator: TimeGenerator
  @Inject(CRYPTO_SERVICE)
  protected readonly cryptoEncryption: ICryptoService;
  @Inject(ENS_MANAGER_SERVICE)
  protected readonly ensManagerService: IEnsManagerService;
  @Inject()
  protected readonly httpService: HttpService

  abstract getCredentialName(): string;

  abstract getType(): string[];

  abstract getContext(): string[];

  abstract getAuthUrl(authUrlRequest: GetAuthUrlRequest): string;

  abstract callbackSuccessful(
    data: T,
    subname: string
  ): Promise<VerifiableEthereumEip712Signature2021>;

  abstract getCallbackParameters(): string[];

  getDataKey(): string {
    return (
      this.getCredentialName().toLowerCase() +
      '_' +
      this.environmentGetter.getEnsDomain().toLowerCase()
    );
  }

  getCallbackUrl(): string {
    return `${this.environmentGetter.getApiDomain()}/credentials/${this.getCredentialName()}/callback`;
  }

  async callback(data: T & { state?: string} ): Promise<CredentialCallbackResponse> {
    if (this.checkCallbackParametersHaveAllRequiredFields(data)) {
      const { ens, authId } = JSON.parse(this.cryptoEncryption.decrypt(data?.state));
      const vc = await this.callbackSuccessful(data, ens);
      await this.successfulVerification(vc, ens);
      return {
        dataKey: this.getDataKey(),
        verifiableCredential: vc,
        authId: authId,
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
  async successfulVerification(
    vc: VerifiableEthereumEip712Signature2021,
    subname: string
  ): Promise<void> {
    const checkIfMAppEnabled = await this.ensManagerService.checkIfMAppEnabled(subname);
    if (checkIfMAppEnabled) {
      await this.ensManagerService.appendVcInMAppEnabledEns(
        subname,
        vc,
        this.getCredentialName()
      );
    }
  }

  async generateCredentialSubject(
    credentialSubject: CredentialSubject & K, ens: string
  ): Promise<VerifiableEthereumEip712Signature2021<K>> {
    const did = await this.didResolver.getEnsDid(ens)
    const ethereumEip712Signature2021 = new EthereumEip712Signature2021<K>({
      type: this.getType(),
      context: this.getContext(),
      credentialSubject: {
        did,
        ...credentialSubject
      },
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
    )) as VerifiableEthereumEip712Signature2021<K>;

    return verified;
  }
}
