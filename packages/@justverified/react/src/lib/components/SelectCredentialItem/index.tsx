import { ArrowIcon, Avatar, ClickableItem, LoadingSpinner } from '@justaname.id/react-ui';
import React, { useEffect, useMemo } from 'react';
import { GithubIcon } from '../../icons';
import { Credentials } from '../../types';

export interface SelectSubnameItemProps {
  credential: Credentials;
  selectedCredential: Credentials | undefined
  onClick: () => void;
  isAlreadyConfigured: boolean;
}

export const SelectCredentialItem: React.FC<SelectSubnameItemProps> = ({
                                                                      credential,
  selectedCredential,
  onClick,
  isAlreadyConfigured
                                                                    }) => {
  const [hover, setHover] = React.useState(false);
  const loading = useMemo(() => selectedCredential === credential, [selectedCredential, credential]);

  console.log(hover, loading, isAlreadyConfigured, selectedCredential, credential, isAlreadyConfigured ||( selectedCredential && selectedCredential?.length > 0 && selectedCredential !== credential));
  useEffect(() => {
    if (loading) {
      setHover(false);
    }
  }, [loading, hover]);
  return (
    <ClickableItem name={credential.charAt(0).toUpperCase() + credential.slice(1)}
                   onClick={onClick}
                   left={  <GithubIcon />}
                   right={<>
                     <div style={{
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       opacity: (hover && !loading) ? 1 : 0
                     }}>
                       <ArrowIcon />
                     </div>

                     <div style={{
                       display: 'flex',
                       position: 'relative',
                       alignItems: 'center',
                       justifyContent: 'center',
                       opacity: loading? 1 : 0,
                       height: '30px',
                       width: loading? '30px' : '0'
                     }}>
                       <LoadingSpinner color={'var(--justaname-primary-color)'} />
                     </div>
                   </>}
                   loading={loading}
                   onHover={(hover) => setHover(hover)}
                   disabled={isAlreadyConfigured ||( selectedCredential && selectedCredential?.length > 0 && selectedCredential !== credential)}
    />
  )
}
