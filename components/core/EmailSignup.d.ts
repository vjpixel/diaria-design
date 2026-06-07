import * as React from 'react';

export interface EmailSignupProps {
  placeholder?: string;
  /** Inline submit button label. Default "Assinar grátis". */
  buttonLabel?: string;
  /** Invert for ink/dark surfaces (footer, dark hero). */
  onDark?: boolean;
  defaultValue?: string;
  onSubmit?: () => void;
  style?: React.CSSProperties;
}

/** Signature pill email field with an inline submit button. */
export function EmailSignup(props: EmailSignupProps): JSX.Element;
