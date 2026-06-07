import React from 'react';

/**
 * The Diar.ia subscribe field: a pill-shaped wrapper holding an email input
 * and an inline submit button. Two themes — `light` (on cream) and `dark`
 * (on ink). This is the site's signature conversion control.
 */
export function EmailSignup({
  placeholder = 'seu@email.com',
  buttonLabel = 'Assinar grátis',
  onDark = false,
  defaultValue = '',
  onSubmit,
  style = {},
}) {
  const borderColor = onDark ? 'var(--rule-on-ink)' : 'var(--ink)';
  const textColor = onDark ? 'var(--on-ink)' : 'var(--ink)';
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit && onSubmit(); }}
      style={{
        display: 'flex',
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--radius-pill)',
        padding: 4,
        background: onDark ? 'transparent' : 'var(--surface-card)',
        ...style,
      }}
    >
      <input
        defaultValue={defaultValue}
        placeholder={placeholder}
        style={{
          flex: 1,
          border: 'none',
          background: 'transparent',
          padding: '10px 16px',
          fontFamily: 'var(--font-sans)',
          fontSize: 14,
          color: textColor,
          outline: 'none',
          minWidth: 0,
        }}
      />
      <button
        type="submit"
        style={{
          background: onDark ? 'var(--paper)' : 'var(--ink)',
          color: onDark ? 'var(--ink)' : 'var(--paper)',
          border: 'none',
          padding: '10px 22px',
          borderRadius: 'var(--radius-pill)',
          fontFamily: 'var(--font-sans)',
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {buttonLabel}
      </button>
    </form>
  );
}
