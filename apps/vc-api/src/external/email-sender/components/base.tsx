import {
  Body,
  Column,
  Container,
  Font,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface BaseEmailProps {
  title: React.ReactNode;
  children?: React.ReactNode;
  email: string;
  preview: string;
  type?: 'otp' | 'other';

}

export const BaseEmail: React.FC<BaseEmailProps> = ({
                                                      title,
                                                      children,
                                                      email,
                                                      preview,
                                                      type,
                                                    }) => {
  const disclaimerMessage =
    type === 'otp'
      ? 'If you did not request this code.'
      : 'If you did not expect this email.';

  return (
    <Html
      style={{
        backgroundColor: '#FFF',
        padding: '10px'
      }}
    >
      <Head>
        <Font
          fontFamily="Poppins"
          fallbackFontFamily="Verdana"
          fontWeight={900}
          webFont={{
            url: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJnecnFHGPezSQ.woff2',
            format: 'woff2',
          }}
          fontStyle="normal"
        />
        <Font
          fontFamily="Poppins"
          fallbackFontFamily="Verdana"
          fontWeight={400}
          webFont={{
            url: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJnecnFHGPezSQ.woff2',
            format: 'woff2',
          }}
          fontStyle="normal"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {title}

          <Section>
            {children ?? null}
          </Section>

          <Text
            style={{
              textAlign: 'center',
              margin: '0px',
              marginBottom: '10px',
              fontSize: '12px',
            }}
          >
            This email was sent to{' '}
            <strong
              style={{
                color: '#3280F4',
                textDecoration: 'underline',
              }}
            >
              {email}
            </strong>
          </Text>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignSelf: 'stretch',

              height: '100%',
            }}
          >

            <Column style={{ width: '50%', padding: '5px' }}>
              <Text style={paragraph}>
                Contact{' '}
                <Link
                  href="mailto:support@justaname.id"
                  style={{
                    color: '#3280F4',
                    textDecoration: 'underline',
                    fontWeight: 'bold',

                  }}
                >
                  support@justaname.id
                </Link>{' '}
                {disclaimerMessage}
              </Text>

            </Column>


            <Column>
              <Row>
                <Img
                  src="https://justaname-bucket.s3.eu-central-1.amazonaws.com/email-templates/jan-logo.png"
                  alt="JustaName"
                  style={logo}
                />
              </Row>
              <Row>
                <Text
                  style={{
                    color: '#3280F4',
                    lineHeight: '16px',
                    fontSize: '9px',
                    margin: '0px',
                    fontWeight: '900',
                    fontStyle: 'italic',
                    textAlign: 'right',
                  }}
                >
                  Securely powered by JustaName.
                </Text>
              </Row>
            </Column>
          </Row>

        </Container>
      </Body>
    </Html>
  );
}
const main = {

  fontFamily: 'Poppins,Verdana,Arial,sans-serif',
  padding: '0px',
};

const container = {
  borderRadius: '5px',
  border: '0.5px solid #000',
  background: '#FFF',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  padding: '20px',
};

const logo = {
  margin: "0px 50px 0px auto",
  width: '62px',
};

const paragraph = {
  lineHeight: '16px',
  margin: '0px',
  color: '#5E577F',
  fontSize: '9px',
  fontFamily: 'Poppins,Verdana,Arial,sans-serif',
  fontWeight: '700',
};
