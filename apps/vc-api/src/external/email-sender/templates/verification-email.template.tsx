import * as React from 'react';
import { BaseEmail } from '../components/base';
import { Title } from '../components/title';
import { Text } from '@react-email/components';
import { EmailNotificationContent } from '../../../core/domain/entities/emailNotificationContent';

interface OtpEmailProps extends EmailNotificationContent {
  otp: string;
}

export const VerificationEmail: React.FC<OtpEmailProps> & {
  PreviewProps: OtpEmailProps;
} = ({ otp }: OtpEmailProps) => {

  return (
    <BaseEmail
      title={
        <span
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            textAlign: 'center',
          }}
        >
          <Title
            text="Verify your email"
            color="#9B92FF"
            fontSize="32px"
            style={{
              marginLeft: '10px',
            }}
          />
        </span>
      }
      preview="Verify your email with the OTP"
    >
      <React.Fragment>
        <div style={{ textAlign: 'center' }}>
          <Text
            style={{
              color: '#5E577F',
              textAlign: 'center',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: '400',
              lineHeight: '20px',
              margin: '20px 0',
            }}
          >
            Please verify your email by entering the OTP below:
          </Text>
          <div>
            <Text
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                textAlign: 'center',
                margin: '20px 0',
                color: '#9B92FF',
              }}
            >
              {otp}
            </Text>
          </div>
          <Text
            style={{
              color: '#5E577F',
              textAlign: 'center',
              fontSize: '12px',
              marginTop: '20px',
            }}
          >
            Enter this OTP on the verification page to complete the process.
          </Text>
        </div>
      </React.Fragment>
    </BaseEmail>
  );
};

export default VerificationEmail;

// Define the preview properties for this email
VerificationEmail.PreviewProps = {
  otp: "123456",
};
