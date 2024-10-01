import {
  CredentialSubject,
  CredentialSubjectValue,
  EthereumEip712Signature2021,
  VerifiableEthereumEip712Signature2021,
} from '../../../../../domain/entities/ethereumEip712Signature';
import { CREDENTIAL_CREATOR, ICredentialCreator } from '../../../creator/icredential.creator';
import { TIME_GENERATOR, TimeGenerator } from '../../../../time.generator';
import { BaseSocialCallback } from './callback/base.social.callback';
import { ENVIRONMENT_GETTER, IEnvironmentGetter } from '../../../../environment/ienvironment.getter';
import { CredentialCallbackResponse } from '../../credential.callback.response';
import { DID_RESOLVER, IDIDResolver } from '../../../../did/resolver/idid.resolver';
import { Inject } from '@nestjs/common';
import { CRYPTO_SERVICE, ICryptoService } from '../../../../crypto/icrypto.service';
import { HttpService } from '@nestjs/axios';
import { ENS_MANAGER_SERVICE, IEnsManagerService } from '../../../../ens-manager/iens-manager.service';
import { GetAuthUrlRequest } from './requests/get-auth-url.request';
import {AbstractResolver} from "../../abstract.resolver";

export abstract class AbstractSocialResolver<
  T extends BaseSocialCallback = { state: string },
  K extends CredentialSubjectValue = {}
> extends AbstractResolver<
    T ,
    K
> {

  abstract getCredentialName(): string;

  abstract getAuthUrl(authUrlRequest: GetAuthUrlRequest): string;

  getCallbackUrl(): string {
    return `${this.environmentGetter.getApiDomain()}/credentials/socials/${this.getCredentialName()}/callback`;
  }
}
