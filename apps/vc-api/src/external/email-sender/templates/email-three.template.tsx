import * as React from 'react';
import { BaseEmail } from '../components/base';
import { Title } from '../components/title';
import { Section, Text } from '@react-email/components';

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


  const repeatedContent = "Lorem ipsum dolor sit amet consectetur. Maecenas integer gravida ullamcorper tempus sed. Pellentesque amet tincidunt blandit vitae nulla sapien ac. Rhoncus quam feugiat dolor in quisque. Proin urna blandit faucibus tempor a bibendum augu.";

  return (
    <BaseEmail title={emailTitle} email="" preview="">
      <div style={styles.contentContainer}>
        <Text style={styles.bodyText}>
          Lorem ipsum dolor sit amet consectetur. In netus diam in quisque sagittis
          vulputate nisi eget sed. Sed lectus eu eget morbi eget.
        </Text>
        
        <Section style={styles.sectionStyle}>
          {Array.from({ length: 3 }, (_, index) => (
            <Text key={index} style={styles.bodyText}>
              {repeatedContent}
            </Text>
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
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '10px',
  },
  sectionStyle: {
    display: 'flex',
    padding: '10px', 
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '10px', 
    borderRadius: '10px', 
    background: 'rgba(217, 217, 217, 0.35)', 
  },
  bodyText: {
    fontSize: '12px',
    margin: '0',
    textAlign: 'left',
    lineHeight: '15px',
    fontStyle: 'normal',

        marginTop:'10px',
    fontWeight: 400,
  },
};

export default FirstEmail;
