
import * as React from 'react';
import { BaseEmail } from '../components/base';
import { Title } from '../components/title';
import { Text } from '@react-email/components';
import { EmailButton } from '../components/buttons';

const FirstEmail: React.FC = () => {
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
        <EmailButton text="CTA Goes here" href={''} />
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

export default FirstEmail;

