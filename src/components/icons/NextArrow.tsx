import React from 'react';
import { IconProps } from './interface';

function NextArrowIcon(props: IconProps) {
    const {
        fill = '#045981',
    } = props;
    return (
        <svg
            version="1.1"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g>
                <g transform="translate(237.000000, 335.000000)">
                    <polyline
                        fill={fill}
                        points="-210.9,-289 -212.9,-291 -201.1,-302.7 -212.9,-314.4 -210.9,-316.4 -197.1,-302.7      -210.9,-289    "
                    />
                </g>
            </g>
        </svg>
    );
}

export default NextArrowIcon;
