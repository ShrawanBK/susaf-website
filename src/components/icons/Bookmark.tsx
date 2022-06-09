import React from 'react';
import { IconProps } from './interface';

function BookmarkIcon(props: IconProps) {
    const {
        fill = '#045981',
    } = props;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
            <path fill={fill} d="M37,43l-13-6l-13,6V9c0-2.2,1.8-4,4-4h18c2.2,0,4,1.8,4,4V43z" />
        </svg>
    );
}

export default BookmarkIcon;
