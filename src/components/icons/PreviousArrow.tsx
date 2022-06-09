import React from 'react';
import { IconProps } from './interface';

function PreviousArrowIcon(props: IconProps) {
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
                        points="-199.1,-289 -212.9,-302.7 -199.1,-316.4 -197.1,-314.4 -208.9,-302.7 -197.1,-291      -199.1,-289    "
                    />
                </g>
            </g>
        </svg>
    );
}

export default PreviousArrowIcon;
