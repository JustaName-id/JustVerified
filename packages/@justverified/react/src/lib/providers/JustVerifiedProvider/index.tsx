import { Credentials } from '../../types';
import { Text } from '@justaname.id/sdk'
import { useSignInWithEns, useMApp } from '@justaname.id/react-signin';
import { JustVerifiedDialog } from '../../dialogs';
import {
  useCanEnableMApps,
  useEnsAuth,
  useEnsSignIn,
  useEnsSignOut,
  useIsMAppEnabled,
  useRecords
} from '@justaname.id/react';
import { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export interface JustVerifiedContextProps {
  handleOpenVCDialog: (open: boolean) => void;
  configuredCredentials: Credentials[];
  configuredCredentialsRecords: Text[];
}

export const JustVerifiedContext = createContext<JustVerifiedContextProps >({
  handleOpenVCDialog: () => { },
  configuredCredentials: [],
  configuredCredentialsRecords: []
});

export interface JustVerifiedProviderProps {
  children: ReactNode;
  credentials: Credentials[];
  openOnConnect?: boolean;
}

const MAPP = 'justverified.eth';

export const JustVerifiedProvider: FC<JustVerifiedProviderProps> = ({
                                                                      children,
                                                                      credentials ,
                                                                      openOnConnect= true
                                                                    }) => {
  const [openVCDialog, setOpenVCDialog] = useState(false);
  const { connectedEns, isEnsAuthPending } = useSignInWithEns();
  const { handleOpenMAppDialog, canOpenMAppDialog, isMAppEnabled, isCanOpenMAppDialogPending } = useMApp({
    mApp: MAPP
  });
  const { records, refetchRecords} = useRecords({
    fullName: connectedEns?.ens || "",
  })
  const { connectedEns: connectedToVerification, isEnsAuthPending: isConnectedToVerificationEnsAuthPending } = useEnsAuth({
    backendUrl: "http://localhost:3009/verifications/v1",
    currentEnsRoute:"/auth/current"
  })
  const { signOut: signOutVerification} = useEnsSignOut({
    backendUrl: "http://localhost:3009/verifications/v1",
    signoutRoute:"/auth/signout"
  })
  const { signIn: signInVerification } = useEnsSignIn()
  const { canEnableMApps, isCanEnableMAppsPending } = useCanEnableMApps({
    ens: connectedEns?.ens || ''
  });
  const { isMAppEnabledPending } = useIsMAppEnabled({
    ens: connectedEns?.ens || '',
    mApp: MAPP
  });

  const credentialKeys = useMemo(() => {
    return credentials.map(credential => credential + '_' + MAPP);
  }, [credentials]);

  const credentialRecords = useMemo(() => {
    return records?.texts.filter(text => credentialKeys.includes(text.key));
  }, [records, credentials]);

  const configuredCredentials = useMemo(() => {
    if (!credentialRecords) {
      return [];
    }
    return credentials.filter(credential => credentialRecords.find(record => record.key === credential + '_' + MAPP));
  }, [credentials, credentialRecords]);

  const configuredCredentialsRecords = useMemo(() => {
    if (!credentialRecords) {
      return [];
    }
    return credentialRecords.filter(record =>record.key.endsWith('_'+MAPP))
  }, [credentials, credentialRecords]);

  const handleOpenVCDialog = (open: boolean) => {
    if(isCanOpenMAppDialogPending){
      return
    }
    if(canOpenMAppDialog){
      handleOpenMAppDialog(true);
    }
    else if (open !== openVCDialog) {
      setOpenVCDialog(open);
    }
  }

  useEffect(() => {
    if (isCanEnableMAppsPending || isMAppEnabledPending || isCanOpenMAppDialogPending || isConnectedToVerificationEnsAuthPending) {
      return;
    }
    if (openOnConnect && configuredCredentials && configuredCredentials.length !== credentials.length && connectedToVerification) {
      handleOpenVCDialog(true);
    }

  }, [isCanEnableMAppsPending, isMAppEnabledPending, openOnConnect, configuredCredentials, credentials, isCanOpenMAppDialogPending, connectedToVerification, isConnectedToVerificationEnsAuthPending]);

  useEffect(() => {
    if(isEnsAuthPending){
      return
    }

    if(!connectedEns){
      handleOpenVCDialog(false)
      return
    }

    if(!connectedToVerification) {
      signInVerification({
        signinRoute:'/auth/signin',
        ens: connectedEns.ens,
        signinNonceRoute: '/auth/nonce',
        backendUrl:"http://localhost:3009/verifications/v1"
      })
    }
  }, [connectedEns, connectedToVerification, isEnsAuthPending])

  useEffect(() => {
    if(connectedEns && connectedToVerification){
      if(connectedEns.address !== connectedToVerification.address) {
        signOutVerification()
        handleOpenVCDialog(true)
      }
    }
  },[connectedEns, connectedToVerification])

  return (
    <JustVerifiedContext.Provider value={{
      handleOpenVCDialog,
      configuredCredentials,
      configuredCredentialsRecords
    }}>
      {children}
      <JustVerifiedDialog
        open={openVCDialog}
        handleOpenDialog={handleOpenVCDialog}
        credentials={credentials}
        alreadyConfigured={configuredCredentials}
      />
    </JustVerifiedContext.Provider>
  );
}

export interface UseJustVerifiedReturn {
  handleOpenVCDialog: (open: boolean) => void;
  configuredCredentials: Credentials[];
  configuredCredentialsRecords: Text[];
}

export const useJustVerified = (): UseJustVerifiedReturn => {
  const context = useContext<JustVerifiedContextProps>(JustVerifiedContext);
  if (!context) {
    throw new Error('useJustVerified must be used within a JustVerifiedProvider');
  }
  return {
    handleOpenVCDialog: context.handleOpenVCDialog,
    configuredCredentials: context.configuredCredentials,
    configuredCredentialsRecords: context.configuredCredentialsRecords
  }
}
