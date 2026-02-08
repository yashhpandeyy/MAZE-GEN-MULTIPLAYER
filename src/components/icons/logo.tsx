import type { SVGProps } from 'react';

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M3 3h7v2H5v5H3V3z" />
      <path d="M21 3h-7v2h5v5h2V3z" />
      <path d="M3 21h7v-2H5v-5H3v7z" />
      <path d="M21 21h-7v-2h5v-5h2v7z" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
      <path d="M8 8h3v2H8z" />
      <path d="M13 14h3v2h-3z" />
    </svg>
  );
}
