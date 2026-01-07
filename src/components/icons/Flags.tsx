import React from 'react';

export const FlagBR = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 640 480" className={className} {...props}>
        <path fill="#009c3b" d="M0 0h640v480H0z" />
        <path fill="#ffdf00" d="m85 240 235-165 235 165-235 165z" />
        <circle cx="320" cy="240" r="100" fill="#002776" />
    </svg>
);

export const FlagES = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 640 480" className={className} {...props}>
        <path fill="#aa151b" d="M0 0h640v480H0z" />
        <path fill="#f1bf00" d="M0 120h640v240H0z" />
    </svg>
);

export const FlagUK = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 640 480" className={className} {...props}>
        <path fill="#012169" d="M0 0h640v480H0z" />
        <path fill="#fff" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z" />
        <path fill="#c8102e" d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176-60-25L0 0z" />
        <path fill="#fff" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
        <path fill="#c8102e" d="M0 192v96h640v-96H0zM273 0v480h96V0h-96z" />
    </svg>
);
