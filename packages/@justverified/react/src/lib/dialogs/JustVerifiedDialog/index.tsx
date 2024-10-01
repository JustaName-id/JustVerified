import { Credentials } from '../../types';
import {
  Badge,
  CloseIcon,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  Flex,
  H2, JustaNameLogoIcon,
  SPAN
} from '@justaname.id/react-ui';
import {
  useSignInWithJustaName,
  JustaNameFooter,
  JustaNameLoadingDialog,
  JustSignInContext,
  JustaNameDialog
} from '@justaname.id/react-signin';
import {FC, Fragment, useContext, useEffect, useMemo, useState} from 'react';
import { useEnsAuth, useEnsSignIn, useEnsSignOut, useRecords } from '@justaname.id/react';
import { SelectCredentialItem } from '../../components';
export interface VCDialogProps {
  open: boolean;
  handleOpenDialog: (open: boolean) => void;
  credentials: Credentials[]
  alreadyConfigured: Credentials[] | undefined
}
export const JustVerifiedDialog: FC<VCDialogProps> = ({
                                                    open,
                                                    handleOpenDialog,
                                                    credentials,
                                                    alreadyConfigured
}) => {
  const { logo } = useContext(JustSignInContext)
  const [selectedCredential, setSelectedCredential] = useState<Credentials | undefined>(undefined)
  const { connectedEns } = useSignInWithJustaName();
  const { refetchRecords} = useRecords({
    fullName: connectedEns?.ens || "",
  })
  const { connectedEns: connectedToVerification, isEnsAuthPending } = useEnsAuth({
    backendUrl: "http://localhost:3009/verifications/v1",
    currentEnsRoute:"/auth/current"
  })

  const initiateVerification = async (credential: Credentials) => {
    const eventSource = new EventSource(
      'http://localhost:3009/verifications/v1' + '/credentials/'+ credential,
      { withCredentials: true }
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.redirectUrl) {
          setSelectedCredential(credential);
          window.open(data.redirectUrl, '_blank');
        } else if (data.result) {
          refetchRecords();
          setSelectedCredential(undefined);
          eventSource.close();
        } else if (data.error) {
          setSelectedCredential(undefined);
          eventSource.close();
        }
      } catch (error) {
      }
    };

    eventSource.onerror = (error) => {
      setSelectedCredential(undefined);
      refetchRecords();
      eventSource.close();
    };
  };

  if(!connectedToVerification){
    return <JustaNameLoadingDialog open={true} />
  }

  return (
    <JustaNameDialog open={open} handleClose={() => handleOpenDialog(false)} header={
      <div style={{
        paddingLeft:'24px',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        flexGrow:1
      }}>
        {
          logo
            ? <img src={logo} alt="logo" style={{ height: '62px' , width: 'auto' }} />
            :         <JustaNameLogoIcon height={62} />

        }
      </div>
    }
    >
      <Flex
        style={{
          padding: '0px 0 0 0',
          borderRadius: '16px',
          background: 'var(--justaname-foreground-color-4)'
        }}
        direction={'column'}
      >
        <Flex
          style={{
            // border: "1px solid var(--justaname-input-border-color)",
            borderRadius: '16px',
            background: 'var(--justaname-background-color)',
            gap: '20px',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '500px'
          }}
        >
          <Flex
            justify="space-between"
            direction="row"
            gap="10px"
          >
            <Badge>
              <SPAN style={{
                fontSize:'10px',
                lineHeight:'10px',
                fontWeight: 900,
              }}>{connectedEns?.ens}</SPAN>
            </Badge>
          </Flex>

          <Flex
            justify="space-between"
            direction="column"
            gap="10px"
          >
            <H2>
              Complete the following verifications
            </H2>
          </Flex>

          <Flex
            direction={'column'}
            gap={'15px'}
            style={{
              maxHeight: '20vh',
              overflowY: 'scroll',
              overflowX: 'hidden'
            }}
          >
            {
              credentials.map((credential, index) => {
                return (
                  <Fragment key={'credential-' + index}>
                    <SelectCredentialItem
                      selectedCredential={selectedCredential}
                      credential={credential}
                      onClick={() => {
                        initiateVerification(credential)
                      }}
                      isAlreadyConfigured={alreadyConfigured?.includes(credential) || false}

                    />
                  </Fragment>
                );
              })
            }
          </Flex>
        </Flex>
      </Flex>
    </JustaNameDialog>
    )
  }
