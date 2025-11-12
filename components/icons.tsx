import React from 'react';

// Fix: Add style prop to allow inline styling.
export const MapPinIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} style={style} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 2a7 7 0 00-7 7c0 4.418 7 11 7 11s7-6.582 7-11a7 7 0 00-7-7zm0 9a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

// Fix: Updated StarIcon to correctly handle key and event handler props.
export const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10 12.585l-4.243 2.536 1.02-4.94L2.05 6.915l4.98-.43L10 2l2.97 4.485 4.98.43-3.727 3.266 1.02 4.94L10 12.585z" />
  </svg>
);

export const UserCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

export const WrenchScrewdriverIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.664 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.474-4.474c.039-.58-.02-1.193-.14-1.743m-2.1 2.1l-2.1-2.1m-2.1 2.1l2.1-2.1" />
  </svg>
);

export const BriefcaseIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.075c0 1.313-.964 2.443-2.25 2.613-1.286.17-2.614.02-3.835-.453M3.75 14.15V18.25c0 1.313.964 2.443 2.25 2.613 1.286.17 2.614.02 3.835-.453M12 21.75v-7.5M12 21.75c-1.214 0-2.417-.184-3.554-.532M12 21.75c1.214 0 2.417-.184 3.554-.532M6.354 13.996c-1.48-1.29-2.32-3.194-2.32-5.246 0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5c0 2.052-.84 3.956-2.32 5.246m-10.36 0a3.375 3.375 0 006.364 0m-10.36 0a3.375 3.375 0 016.364 0" />
    </svg>
);

export const PhoneIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
  </svg>
);

export const QuestionMarkCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

export const PaperAirplaneIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

export const AppleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 16 16">
    <path d="M11.182.008C10.148-.03 9.07 1.05 8.003 1.05c-1.068 0-2.14-1.08-3.182-1.042C3.39 0 2.21.933 1.385 2.44c-.824 1.507-.633 3.91.178 5.418.812 1.507 2.12 3.42 3.65 3.42.924 0 1.838-.933 2.793-.933.955 0 1.868.933 2.793.933 1.52 0 2.838-1.913 3.65-3.42.812-1.508 1.003-3.91.178-5.418C13.79.933 12.61 0 11.182.008zM8.003 12.356c-1.054 0-1.74-.782-2.434-1.874-.694-1.092-.934-2.582-.284-3.64C5.9 6.23 6.843 5.5 8.003 5.5c1.157 0 2.1.73 2.724 1.336.624.605.864 2.05.214 3.144-.694 1.092-1.38 1.874-2.434 1.874z"/>
  </svg>
);

export const AndroidIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 16 16">
    <path d="M5.03 16h5.94c.59 0 .94-.48.81-1.05L11 9H5l-.78 5.95c-.13.57.22 1.05.81 1.05zM3.05 4.19a.5.5 0 0 1 .5-.5h8.9a.5.5 0 0 1 .5.5v3.62h-9.9V4.19zM1 3.61c0-.49.38-.89.86-.89h12.28c.48 0 .86.4.86.89v4.29c0 .49-.38.89-.86.89H1.86c-.48 0-.86-.4-.86-.89V3.61zm2.34-2.14a.5.5 0 0 1 .47-.33h8.38a.5.5 0 0 1 .47.33l.42 1.25H2.34l.42-1.25zM11.64 1.5a1 1 0 1 0-1.99-.01A1 1 0 0 0 11.64 1.5zm-7.28 0a1 1 0 1 0-1.99-.01 1 1 0 0 0 1.99.01z"/>
  </svg>
);