import React from 'react';
import { IconProps } from './interface';

function DoublePreviousArrowIcon(props: IconProps) {
    const {
        fill = '#045981',
    } = props;
    return (
        <svg
            version="1.1"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
        >
            <g>
                <path
                    fill={fill}
                    d="M 15.12,15.53 25,5.66 a 1,1 0 0 1 1.41,1.41 l -9.06,9.06 8.8,8.8 a 1,1 0 0 1 0,1.41 v 0 a 1,1 0 0 1 -1.42,0 l -9.61,-9.61 a 0.85,0.85 0 0 1 0,-1.2 z"
                />
                <path
                    fill={fill}
                    d="m 5.54,15.53 9.88,-9.87 a 1,1 0 1 1 1.41,1.41 l -9.06,9.06 8.8,8.8 a 1,1 0 0 1 0,1.41 v 0 a 1,1 0 0 1 -1.41,0 L 5.54,16.73 a 0.85,0.85 0 0 1 0,-1.2 z"
                />
            </g>
        </svg>
    );
}

export default DoublePreviousArrowIcon;
