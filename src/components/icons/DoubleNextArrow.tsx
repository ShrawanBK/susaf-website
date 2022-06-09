import React from 'react';
import { IconProps } from './interface';

function DoubleNextArrowIcon(props: IconProps) {
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
                    d="M 16.88,15.53 7,5.66 A 1,1 0 0 0 5.59,7.07 l 9.06,9.06 -8.8,8.8 a 1,1 0 0 0 0,1.41 v 0 a 1,1 0 0 0 1.42,0 l 9.61,-9.61 a 0.85,0.85 0 0 0 0,-1.2 z"
                />
                <path
                    fill={fill}
                    d="M 26.46,15.53 16.58,5.66 a 1,1 0 0 0 -1.41,1.41 l 9.06,9.06 -8.8,8.8 a 1,1 0 0 0 0,1.41 v 0 a 1,1 0 0 0 1.41,0 l 9.62,-9.61 a 0.85,0.85 0 0 0 0,-1.2 z"
                />
            </g>
        </svg>
    );
}

export default DoubleNextArrowIcon;
