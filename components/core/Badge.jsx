import React from 'react';

/**
 * Small editorial tag/chip. `tint` = teal fill (active/featured),
 * `outline` = hairline border (neutral), `solid` = ink fill.
 * Mono, uppercase, square-ish corners.
 */
export function Badge({ children, variant = 'outline', style = {}, ...rest }) {
  const variants = {
    tint:    { background: 'var(--brand-tint)', color: 'var(--brand-deep)', border: '1px solid transparent' },
    outline: { background: 'transparent', color: 'var(--ink-soft)', border: '1px solid var(--rule)' },
    solid:   { background: 'var(--ink)', color: 'var(--paper)', border: '1px solid transparent' },
  };
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        padding: '4px 10px',
        borderRadius: 'var(--radius-sm)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        ...variants[variant],
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
