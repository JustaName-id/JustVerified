// import {Button} from "@react-email/components";
// import * as React from "react";
// import {Title} from "./title";

// export interface CustomButtonProps {
//     text: string;
//     href: string;
//     style?: React.CSSProperties;
// }

// export const EmailButton: React.FC<CustomButtonProps> = ({text, href, style={}}) => {
//     return (
//         <Button style={{
//             borderRadius: '100px',
//             border: '1px solid #5E577F',
//             background: '#9B92FF',
//             display: 'flex',
//             padding: '7px 15px',
//             justifyContent: 'center',
//             alignItems: 'center',
//             gap: '10px',
//             ...style
//         }} href={href}>
//             <Title
//                 text={text}
//                 color={"#FFFFFF"}
//                 fontSize={"14px"}
//                 style={{
//                     margin: 0,
//                 }}
//             />
//         </Button>
//     )
// }
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
        <Button
            style={{
                display: 'flex',
               height:'44px',
          
                borderRadius: '6px', 
                border: '1px solid #000', 
                opacity: '1',
                background: '#3280F4', 
                padding: '0px 30px', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '6px', 
                ...style 
            }}
            href={href}
        >
            <Title
                text={text}
                color={"#FFFFFF"}
                fontSize={"16px"}
                style={{
                  transform:'capitalize',
                  fontStyle: "normal",
                  fontWeight: '900',
                  lineHeight: '24px',
                    margin: 0,
                }}
            />
        </Button>
    );
};
