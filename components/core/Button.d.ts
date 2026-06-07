import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. `ink` = primary, `teal` = accent (on dark), `outline` = secondary, `ghost` = tertiary. Default `ink`. */
  variant?: 'ink' | 'teal' | 'outline' | 'ghost';
  /** Control height. Default `md`. */
  size?: 'sm' | 'md' | 'lg';
  /** Set true when placed on an ink/dark surface so borders & text invert. */
  onDark?: boolean;
  children?: React.ReactNode;
}

/**
 * Diar.ia pill button. Primary actions use `ink`; `teal` is reserved for
 * accent CTAs on dark surfaces; `outline`/`ghost` step down the hierarchy.
 */
export function Button(props: ButtonProps): JSX.Element;
