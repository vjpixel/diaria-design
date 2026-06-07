import React from 'react';

/**
 * Horizontal editorial rule. `thick` is the 2px solid ink rule that brackets
 * the masthead; default is a 1px hairline at 18% ink.
 */
export function Rule({ thick = false, onDark = false, style = {} }) {
  return (
    <div
      style={{
        height: thick ? 2 : 1,
        background: onDark ? 'var(--on-ink)' : 'var(--ink)',
        opacity: thick ? 1 : (onDark ? 0.2 : 0.18),
        width: '100%',
        ...style,
      }}
    />
  );
}
