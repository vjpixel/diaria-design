import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** `tint` (teal, featured), `outline` (neutral, default), `solid` (ink). */
  variant?: 'tint' | 'outline' | 'solid';
  children?: React.ReactNode;
}

/** Mono uppercase tag/chip with small (4px) corners — e.g. "iniciante · 14". */
export function Badge(props: BadgeProps): JSX.Element;
