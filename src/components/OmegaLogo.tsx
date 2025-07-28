import * as React from 'react';

const OmegaLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width="100"
    height="100"
    {...props}
  >
    <path
      d="M25,85 A40,25 0 0,1 75,85 L68,85 A25,20 0 0,0 32,85 Z M20,75 L15,75 L15,65 L20,65 Z M80,75 L85,75 L85,65 L80,65 Z"
      fill="currentColor"
    />
  </svg>
);

export default OmegaLogo;
