import * as React from 'react';

export interface LogoProps {
  /** Font size in px. Wordmark stays legible down to ~16px. Default 20. */
  size?: number;
  /** Invert text color for dark surfaces (dots become bright teal). */
  onDark?: boolean;
  /** Include the `.br` TLD. Default true. */
  tld?: boolean;
  style?: React.CSSProperties;
}

/** Live-text Diar.ia wordmark. For fixed assets prefer the SVG/PNG in assets/logo. */
export function Logo(props: LogoProps): JSX.Element;
