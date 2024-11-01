import * as React from 'react';
import { BaseEmail } from '../components/base';
import { Title } from '../components/title';
import { Container, Text } from '@react-email/components';
import { EmailNotificationContent } from '../../../core/domain/entities/emailNotificationContent';

interface OtpEmailProps extends EmailNotificationContent {
  otp: string;
  email: string;
}

export const VerificationEmail: React.FC<OtpEmailProps> & {
  PreviewProps: OtpEmailProps;
} = ({ otp, email }: OtpEmailProps) => {

  return (
    <BaseEmail
      title={
        <Title
          text={'Verify your email'}
          color={'#000000'}
          fontSize={'24px'}
          style={{
            textAlign: 'center',
            margin: '0 auto',
            lineHeight: 'normal',
            fontWeight: '700'
          }}
        />
      }
      type='otp'
      email={email}
      preview={'Verify your email with the OTP'}
    >
      <React.Fragment>

        <Text
          style={{
            color: '#000000',
            textAlign: 'center',
            fontSize: '14px',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '16px',
            marginTop: '10px',
            margin: '0',
          }}
        >
          Please verify your email by entering the OTP below:
        </Text>
        <Container
          style={{
            marginTop: '20px',
            marginBottom: '20px',
            paddingTop: 20,
            width: '100%',
            paddingBottom: 20,
            backgroundColor: 'rgba(217, 217, 217, 0.35)',
            textAlign: 'center',
          }}
        >
          <Text
            style={{
              color: '#3280F4',
              fontSize: '40px',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: 'normal',
              textAlign: 'center',
              letterSpacing: '10px',
              margin: '0',
            }}
          >
            {otp}
          </Text>
        </Container>

      </React.Fragment>
    </BaseEmail>
  );
};

export default VerificationEmail;

// Define the preview properties for this email
VerificationEmail.PreviewProps = {
  otp: "12345678",
  email: 'example@example.com'
};
