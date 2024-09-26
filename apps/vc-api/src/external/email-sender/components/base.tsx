import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface BaseEmailProps {
  title: React.ReactNode;
  children?: React.ReactNode;
  email: string;
  preview: string;
}

export const BaseEmail: React.FC<BaseEmailProps> = ({
  title,
  children,
  email,
  preview,
}) => (
  <Html
    style={{
      backgroundColor: '#D2C1FF',
      padding: '50px 0',
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

        <Section
          style={{
            padding: '20px 40px',
            borderRadius: '20px',
            marginTop: '20px',
            border: '1px solid #8517E3',
            background: '#F7FAFF',
          }}
        >
          {children ?? null}
        </Section>

        <Text
          style={{
            textAlign: 'center',
            marginTop: '40px',
            color: '#5E577F',
          }}
        >
          This email was sent to{' '}
          <strong
            style={{
              color: '#8517E3',
              textDecoration: 'underline',
            }}
          >
            {email}
          </strong>
        </Text>

        <Img
          src={"https://cdn.justaname.id/avatar/justahead.png"}
          alt="JustaName"
          style={logo}
        />
        <Text style={paragraph}>Not expecting this email?</Text>

        <Text style={paragraph}>
          Contact{' '}
          <Link
            href="mailto:support@justaname.id"
            style={{
              color: '#8517E3',
              textDecoration: 'underline',
              fontWeight: 'bold',
            }}
          >
            support@justaname.id
          </Link>{' '}
          if you did not request this code.
        </Text>

        <Text
          style={{
            color: '#9B92FF',
            textAlign: 'center',
            fontSize: '15px',
            margin: 0,
            marginTop: '20px',
            fontStyle: 'italic',
            fontWeight: '900',
            lineHeight: '20px',
          }}
        >
          Securely powered by JustaName.
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#D2C1FF',
  fontFamily: 'Poppins,Verdana,Arial,sans-serif',
  padding: '0px',
};

const container = {
  borderRadius: '20px',
  border: '2px solid #5E577F',
  background: '#FFF',
  boxShadow: '-10px 10px 0px 0px #5E577F',
  width: '100%',
  minWidth: '600px',
  padding: '40px',
};

const logo = {
  margin: '20px auto',
  width: '150px',
};

const paragraph = {
  color: '#444',
  fontSize: '15px',
  fontFamily: 'Poppins,Verdana,Arial,sans-serif',
  letterSpacing: '0',
  lineHeight: '23px',
  padding: '0 40px',
  margin: '0',
  textAlign: 'center' as const,
};
