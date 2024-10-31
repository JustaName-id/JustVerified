import { Text } from '@react-email/components';
import * as React from 'react';

export interface TitleProps {
  text: string;
  color: string;
  fontSize: string;
  style?: React.CSSProperties;
  shadowDepth?: number;
}
export const Title: React.FC<TitleProps> = ({
  text,
  color,
  fontSize,
  style,
}) => {
  return (
    <Text
      style={{
        color,
        fontSize,
        fontWeight: 700,
        lineHeight: 'fit-content',
        letterSpacing: 0,
        position: 'relative',
        margin: 0,
        width: 'fit-content',
        ...style,
      }}
    >
      {text}
    </Text>
  );
};
