import * as React from 'react';

export interface KickerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tint the label in brand teal (deep on light, bright on dark). */
  accent?: boolean;
  /** Invert for ink/dark surfaces. */
  onDark?: boolean;
  children?: React.ReactNode;
}

/** Monospace uppercase eyebrow/meta label with 0.16em tracking. */
export function Kicker(props: KickerProps): JSX.Element;
