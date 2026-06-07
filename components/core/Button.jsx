import React from 'react';

/**
 * Diar.ia primary control. Pill-shaped, sans-serif, four editorial variants.
 * - ink      filled near-black (primary CTA: Assinar, Ler edição)
 * - teal     filled brand accent (use on ink/dark surfaces)
 * - outline  hairline border, transparent fill (secondary: Entrar)
 * - ghost    text only, no chrome (tertiary: Buscar)
 */
export function Button({
  children,
  variant = 'ink',
  size = 'md',
  onDark = false,
  style = {},
  ...rest
}) {
  const pads = {
    sm: '8px 14px',
    md: '11px 22px',
    lg: '13px 26px',
  };
  const fonts = { sm: 13, md: 13, lg: 14 };

  const base = {
    fontFamily: 'var(--font-sans)',
    fontSize: fonts[size],
    fontWeight: 500,
    lineHeight: 1,
    padding: pads[size],
    borderRadius: 'var(--radius-pill)',
    border: '1px solid transparent',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    transition: 'opacity var(--duration-fast) var(--ease-standard), background var(--duration-fast) var(--ease-standard)',
    whiteSpace: 'nowrap',
  };

  const variants = {
    ink: {
      background: 'var(--ink)',
      color: 'var(--paper)',
    },
    teal: {
      background: 'var(--brand)',
      color: 'var(--ink)',
      fontWeight: 600,
    },
    outline: {
      background: 'transparent',
      color: onDark ? 'var(--on-ink)' : 'var(--ink)',
      borderColor: onDark ? 'var(--rule-on-ink)' : 'var(--rule)',
    },
    ghost: {
      background: 'transparent',
      color: onDark ? 'var(--on-ink-soft)' : 'var(--ink-soft)',
    },
  };

  return (
    <button
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
      {...rest}
    >
      {children}
    </button>
  );
}
