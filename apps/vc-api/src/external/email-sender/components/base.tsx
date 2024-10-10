import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Img,
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

export const BaseEmail: React.FC<BaseEmailProps> = ({ title, children }) => {
  return (
    <Html style={styles.html}>
      <Head>
        <Font
          fontFamily="Poppins"
          fallbackFontFamily="sans-serif"
          fontWeight={900}
          fontStyle="normal"
        />
        <Font
          fontFamily="Poppins"
          fallbackFontFamily="sans-serif"
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.section}>
            <div>{title}</div>
            {children}
          </Section>

          <div style={styles.footer}>
            <div style={styles.contactInfo}>
              <Text style={styles.contactText}>
                Contact <strong style={styles.supportEmail}>support@justaname.id</strong> if you did not request this code.
              </Text>
              <strong style={styles.unsubscribeText}>Unsubscribe</strong>
            </div>

            <div style={styles.logoContainer}>
              <Img
                src="https://justaname-bucket.s3.eu-central-1.amazonaws.com/email-templates/jan-logo.svg"
                alt="JustaName"
                style={styles.logo}
              />
              <Text style={styles.poweredByText}>
                Securely powered by JustaName.
              </Text>
            </div>
          </div>
        </Container>
      </Body>
    </Html>
  );
};

const styles = {
  html: {
    backgroundColor: '#FFF',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  body: {
    backgroundColor: '#FFF',
    fontFamily: 'Poppins, Verdana, Arial, sans-serif',
    padding: '0',
  },
  container: {
    borderRadius: '5px',
    border: '0.5px solid #5E577F',
    background: '#FFF',
    width: '100%',
    maxWidth: '550px',
    padding: '20px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start' as const,
    gap: '10px',
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
    marginTop: '20px',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
  },
  contactText: {
    textAlign: 'center',
    color: '#5E577F',
    fontSize: '8px',
    fontWeight: '700',
    margin: '0',
    lineHeight: '10px',
  },
  supportEmail: {
    color: '#3280F4',
  },
  unsubscribeText: {
    color: '#3280F4',
    fontSize: '8px',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
  },
  logo: {
    width: '62px',
  },
  poweredByText: {
    color: '#3280F4',
    fontSize: '8px',
    fontWeight: '900',
    margin: '0',
    lineHeight: '10px',
  },
};

export default BaseEmail;
