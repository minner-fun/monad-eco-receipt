import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'appkit-button': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        balance?: 'show' | 'hide';
        size?: 'sm' | 'md';
        label?: string;
        loadingLabel?: string;
        disabled?: boolean;
      };
      'appkit-network-button': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      'appkit-account-button': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        balance?: 'show' | 'hide';
      };
    }
  }
}

export {};
