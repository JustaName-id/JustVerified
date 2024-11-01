import { Button } from "@react-email/components";
import * as React from "react";
import { Title } from "./title";

export interface CustomButtonProps {
  text: string;
  href: string;
  style?: React.CSSProperties;
}

export const EmailButton: React.FC<CustomButtonProps> = ({ text, href, style = {} }) => {
  return (
    <Button style={{
      display: 'flex',
      borderRadius: '6px',
      border: '1px solid #000',
      opacity: '1',
      background: '#3280F4',
      padding: '15px 30px',
      gap: '6px',
      margin: '0 auto',
      ...style
    }} href={href}>
      <Title
        text={text}
        color={"#FFFFFF"}
        fontSize={"16px"}
        style={{
          transform: 'capitalize',
          fontStyle: "normal",
          fontWeight: '900',
          lineHeight: '24px',
          margin: 0,
        }}
      />
    </Button>
  )
}
