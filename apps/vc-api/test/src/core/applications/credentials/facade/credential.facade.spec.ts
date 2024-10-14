import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { AbstractSocialResolver } from '../../../../../../src/core/applications/credentials/facade/social-credential-resolver/social-resolver/abstract.social.resolver';
import { CredentialCreatorFacade } from '../../../../../../src/core/applications/credentials/facade/credential.facade';
import { SocialResolverNotFoundException } from '../../../../../../src/core/domain/exceptions/SocialResolverNotFound.exception';
import {
  ISocialCredentialResolver,
  SOCIAL_CREDENTIAL_RESOLVER,
} from '../../../../../../src/core/applications/credentials/facade/social-credential-resolver/isocial.credential.resolver';
import {
  EMAIL_RESOLVER,
  IEmailResolver,
} from '../../../../../../src/core/applications/credentials/facade/email-resolver/iemail.resolver';

const CREDENTIAL_NAME = 'CREDENTIAL_NAME';
const CREDENTIAL_NAME_2 = 'CREDENTIAL_NAME_2';

const AUTH_URL = 'AUTH_URL';
const CALLBACK_URL = 'CALLBACK_URL';

const RESOLVER: Partial<AbstractSocialResolver<{ state: string }, {}>> = {
  getCredentialName: () => CREDENTIAL_NAME,
  getAuthUrl: () => AUTH_URL,
  getCallbackUrl: () => CALLBACK_URL,
}

describe('CredentialCreatorFacade', () => {
  let facade: CredentialCreatorFacade;
  let socialResolver: DeepMocked<ISocialCredentialResolver>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CredentialCreatorFacade,
        {
          provide: SOCIAL_CREDENTIAL_RESOLVER,
          useValue: createMock<ISocialCredentialResolver>(),
        },
        {
          provide: EMAIL_RESOLVER,
          useValue: createMock<IEmailResolver>(),
        },
      ],
    }).compile();

    facade = module.get<CredentialCreatorFacade>(CredentialCreatorFacade);
    socialResolver = module.get<DeepMocked<ISocialCredentialResolver>>(
      SOCIAL_CREDENTIAL_RESOLVER
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSocialResolver', () => {
    it('should return the correct social resolver for a given credential name', () => {
      socialResolver.getSocialResolvers.mockReturnValue([RESOLVER as AbstractSocialResolver]);

      expect(
        facade.getSocialResolver(CREDENTIAL_NAME).getCredentialName()
      ).toBe(CREDENTIAL_NAME);
    });

    it('should throw SocialResolverNotFoundException if resolver is not found', () => {
      socialResolver.getSocialResolvers.mockReturnValue([RESOLVER as AbstractSocialResolver]);

      expect(() => {
        facade.getSocialResolver(CREDENTIAL_NAME_2);
      }).toThrow(SocialResolverNotFoundException);
    });
  });
});
