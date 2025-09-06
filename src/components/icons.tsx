import type { SVGProps } from 'react';

export function IntelliOpsLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
      <path d="M12 8v4" />
      <path d="m9.17 14.83.01-.01" />
      <path d="m14.83 14.83.01-.01" />
      <path d="M9.17 9.17.01-.01" />
      <path d="m14.83 9.17.01-.01" />
      <path d="m12 16.01.01-.01" />
      <path d="M12 12h.01" />
    </svg>
  );
}
