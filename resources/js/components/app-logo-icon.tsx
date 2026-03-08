import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 4h10v10H4V4Zm14 0h10v10H18V4ZM4 18h10v10H4V18Zm17 0h-3v4h4v-4h3v7H18v-7h3Zm-3 7h4v3h-4v-3Z"
            />
        </svg>
    );
}
