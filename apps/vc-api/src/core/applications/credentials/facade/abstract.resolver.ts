import {ENVIRONMENT_GETTER, IEnvironmentGetter} from "../../environment/ienvironment.getter";
import {Inject} from "@nestjs/common";
import {
  CredentialSubjectValue, EthereumEip712Signature2021,
  VerifiableEthereumEip712Signature2021
} from "../../../domain/entities/ethereumEip712Signature";
import {CREDENTIAL_CREATOR, ICredentialCreator} from "../creator/icredential.creator";
import {DID_RESOLVER, IDIDResolver} from "../../did/resolver/idid.resolver";
import {TIME_GENERATOR, TimeGenerator} from "../../time.generator";
import {CRYPTO_SERVICE, ICryptoService} from "../../crypto/icrypto.service";
import {ENS_MANAGER_SERVICE, IEnsManagerService} from "../../ens-manager/iens-manager.service";
import {HttpService} from "@nestjs/axios";
import {CredentialCallbackResponse} from "./credential.callback.response";
import {BaseCallback} from "./base.callback";


export abstract class AbstractResolver<
  T extends BaseCallback,
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

  abstract getKey(): string;

  abstract getType(): string[];

  abstract extractCredentialSubject(
    data: T,
  ): Promise<K>;

  getDataKey(): string {
    return (
      this.getKey().toLowerCase() +
      '_' +
      this.environmentGetter.getEnsDomain().toLowerCase()
    );
  }

  getContext(): string[] {
    return []
  }

  getExpirationPeriod(): number {
    return 3;
  }

  async successfulCredentialGeneration(
    vc: VerifiableEthereumEip712Signature2021,
    subname: string
  ): Promise<void> {
    const checkIfMAppEnabled = await this.ensManagerService.checkIfMAppEnabled(subname);
    if (checkIfMAppEnabled) {
      await this.ensManagerService.appendVcInMAppEnabledEns(
        subname,
        vc,
        this.getKey()
      );
    }
  }

  encryptState({ens, authId}: { ens: string; authId: string }): string {
    const stateObject = { ens, authId };
    return this.cryptoEncryption.encrypt(JSON.stringify(stateObject));
  }

  decryptState(state: string): { ens: string; authId: string } {
    return JSON.parse(this.cryptoEncryption.decrypt(state));
  }

  getEnsAndAuthId(data: T): { ens: string; authId: string } {
    const { ens, authId } = this.decryptState(data.state);
    return { ens, authId };
  }

  async generateCredential(
    data: T,
  ): Promise<CredentialCallbackResponse> {
    const credentialSubject = await this.extractCredentialSubject(data);
    const { ens , authId} = this.getEnsAndAuthId(data);

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

    const verifiableCredential = (await this.credentialCreator.createCredential(
      ethereumEip712Signature2021
    )) as VerifiableEthereumEip712Signature2021<K>;

    await this.successfulCredentialGeneration(verifiableCredential, ens);

    return {
      dataKey: this.getDataKey(),
      verifiableCredential,
      authId,
    };
  }
}