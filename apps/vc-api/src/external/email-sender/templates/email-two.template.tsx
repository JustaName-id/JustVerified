
import * as React from 'react';
import { BaseEmail } from '../components/base';
import { Title } from '../components/title';
import { Section, Text } from '@react-email/components';

import { EmailNotificationContent } from '../../../core/domain/entities/emailNotificationContent';

interface OtpEmailProps extends EmailNotificationContent {
  otp: string;
  email: string;
}export const VerificationEmail: React.FC<OtpEmailProps> & {
    PreviewProps: OtpEmailProps;
  } = ({ otp, email }: OtpEmailProps) => {
  
  const emailTitle = (
    <span style={styles.titleContainer}>
      <Title
        text="Email Title"
        color="#000"
        fontSize="24px"
        style={styles.titleStyle}
      />
    </span>
  );

  return (
    <BaseEmail title={emailTitle} email="" preview="">
      <div style={styles.contentContainer}>
        <Text style={styles.bodyText}>
          Lorem ipsum dolor sit amet consectetur. In netus diam in quisque sagittis
          vulputate nisi eget sed. Sed lectus eu eget morbi eget.
        </Text>
    <Section
  style={{
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: '20px 0', 
    backgroundColor:'rgba(217, 217, 217, 0.35)'
  }}
>
  {String(otp).split('').map((digit, index) => (
    <span
      key={index}
      style={{
        color: '#3280F4', 
    
        fontSize: '40px', 
        fontStyle: 'normal', 
        fontWeight: 700,
        lineHeight: 'normal',
        textAlign: 'center', 
        margin: '0', 
        marginRight: index < String(otp).length - 1 ? '20px' : '0', 
      }}
    >
    {digit} 
    </span>
  ))}
</Section>

      </div>
    </BaseEmail>
  );
};

const styles = {
  titleContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    textAlign: 'start',
  },
  titleStyle: {

    fontWeight: 700,
    lineHeight: 'normal',
  },
  contentContainer: {
    marginTop:'10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '10px',
  },
  bodyText: {
    fontSize: '12px',
    margin: '0',
    textAlign: 'left',
    lineHeight: '15px',
  
    fontStyle: 'normal',
    fontWeight: 400,
  },
};

export default VerificationEmail;

VerificationEmail.PreviewProps = {
    otp: "123456",
    email: 'example@example.com'
  };
  