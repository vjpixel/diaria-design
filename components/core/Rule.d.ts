import * as React from 'react';

export interface RuleProps {
  /** 2px solid ink rule (masthead brackets). Default is a 1px hairline. */
  thick?: boolean;
  /** Invert color for dark surfaces. */
  onDark?: boolean;
  style?: React.CSSProperties;
}

/** Horizontal divider — the newspaper rule that structures the layout. */
export function Rule(props: RuleProps): JSX.Element;
