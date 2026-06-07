import React from 'react';

/**
 * The Diar.ia wordmark as live text. Geist 600, tight tracking, with the
 * dots and `.br` always in brand teal. Renders "diar.ia.br" by default;
 * pass `tld={false}` to drop the `.br`.
 */
export function Logo({ size = 20, onDark = false, tld = true, style = {} }) {
  const dot = onDark ? 'var(--brand-bright)' : 'var(--brand)';
  return (
    <span
      style={{
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        fontSize: size,
        letterSpacing: '-0.02em',
        color: onDark ? 'var(--on-ink)' : 'var(--ink)',
        display: 'inline-flex',
        alignItems: 'baseline',
        ...style,
      }}
    >
      diar<span style={{ color: dot }}>.</span>ia
      {tld && <span style={{ color: dot }}>.br</span>}
    </span>
  );
}
