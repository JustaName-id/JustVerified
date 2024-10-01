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
  shadowDepth,
  style,
}) => {
  return (
    <Text
      style={{
        color,
        fontSize,
        textTransform: 'uppercase',
        fontWeight: 900,
        textShadow: textShadow('#5E577F', shadowDepth || 1),
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

const textShadow = (
  color: string,
  shadowDepth: number,
) => `-${shadowDepth}px ${shadowDepth}px  ${color},
  ${shadowDepth}px -${shadowDepth}px ${color}, 
 -${shadowDepth}px -${shadowDepth}px ${color}, 
 0px -${shadowDepth}px ${color}, 
 0px ${shadowDepth}px ${color}, 
 ${shadowDepth}px 0px ${color}, 
 -${shadowDepth}px 0px ${color}, 
 ${shadowDepth}px ${shadowDepth}px ${color}`;
