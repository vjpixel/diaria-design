import React from 'react';

/**
 * Mono, uppercase, wide-tracked label. The connective tissue of the
 * Diar.ia layout — section eyebrows, meta lines, "● EDIÇÃO DE HOJE".
 */
export function Kicker({ children, accent = false, onDark = false, style = {}, ...rest }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.16em',
        color: accent
          ? (onDark ? 'var(--brand-bright)' : 'var(--brand-deep)')
          : (onDark ? 'var(--on-ink-soft)' : 'var(--ink-soft)'),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
