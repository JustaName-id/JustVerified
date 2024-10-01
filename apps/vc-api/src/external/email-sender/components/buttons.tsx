import { Button } from '@react-email/components';
import * as React from 'react';
import { Title } from './title';

export interface CustomButtonProps {
  text: string;
  href: string;
  style?: React.CSSProperties;
}

export const JustButton: React.FC<CustomButtonProps> = ({ text, href, style = {} }) => {
  return (
    <Button
      style={{
     
        display: 'inline-block',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#8517e3', 
        color: '#fff', 
        fontFamily: 'Arial, sans-serif', 
        fontSize: '14px', 
        fontWeight: 'bold',
        textAlign: 'center',
        boxShadow: '-3px 3px 0 0 #f8bdf7',
     
        cursor: 'pointer',
        transition: 'background-color 0.2s ease-in-out',

        ...style,
      }}
      href={href}
    >
      {text}
    </Button>
  );
};

export default JustButton;