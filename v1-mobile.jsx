// V1 Mobile — direção A adaptada para 375px.
// Mesmo conteúdo, mesma personalidade editorial (Georgia + Geist),
// mas reorganizada para o gesto do polegar:
//  · Nav compacta sticky no topo
//  · Masthead reduzido + assinatura logo abaixo do fold
//  · Estante de livros em scroll horizontal (gesto natural)
//  · Cursos em lista densa, tap-friendly
//  · Barra de assinatura sticky no rodapé

const m1 = {
  paper: '#FBFAF6',
  paperAlt: '#ebe5d0',
  ink: '#171411',
  inkSoft: '#171411',
  inkFaint: '#171411',
  rule: 'rgba(23,20,17,0.18)',
  green: 'var(--brand)',
  greenDeep: 'var(--brand-deep)',
  greenTint: 'var(--brand-tint)',
};

const m1Serif = `Georgia, 'Times New Roman', serif`;
const m1Sans = `'Geist', -apple-system, BlinkMacSystemFont, system-ui, sans-serif`;
const m1Mono = `'Geist Mono', 'JetBrains Mono', ui-monospace, monospace`;

const M1Kicker = ({ children, color, size = 10 }) => (
  <div style={{ fontFamily: m1Mono, fontSize: size, textTransform: 'uppercase', letterSpacing: '0.14em', color: color || m1.inkSoft }}>{children}</div>
);

const M1Rule = ({ thick, style }) => (
  <div style={{ height: thick ? 2 : 1, background: m1.ink, opacity: thick ? 1 : 0.18, ...style }} />
);

const M1Logo = ({ size = 18 }) => (
  <div style={{ fontFamily: m1Sans, fontWeight: 600, fontSize: size, letterSpacing: '-0.02em', color: m1.ink, display: 'inline-flex', alignItems: 'baseline' }}>
    diar<span style={{ color: m1.green }}>.</span>ia<span style={{ color: m1.green }}>.br</span>
  </div>
);

// ── Sticky nav ──────────────────────────────────────────────
const M1Nav = () => (
  <header style={{
    position: 'sticky', top: 0, zIndex: 20,
    padding: '12px 20px',
    background: 'rgba(244,239,226,0.92)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    borderBottom: `1px solid ${m1.rule}`,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  }}>
    <M1Logo size={17} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button aria-label="menu" style={{ background: 'transparent', border: 'none', padding: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ width: 18, height: 1.5, background: m1.ink }} />
        <span style={{ width: 18, height: 1.5, background: m1.ink }} />
      </button>
    </div>
  </header>
);

// ── Masthead ────────────────────────────────────────────────
const M1Masthead = () => (
  <section style={{ padding: '28px 20px 28px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
      <M1Kicker>Ter · 19 mai 2026</M1Kicker>
      <M1Kicker>Vol. III · Nº 412</M1Kicker>
    </div>
    <M1Rule thick />
    <h1 style={{
      fontFamily: m1Serif, fontSize: 76, lineHeight: 0.86,
      letterSpacing: '-0.04em', fontWeight: 500,
      margin: '20px 0 16px', color: m1.ink, textAlign: 'center',
    }}>
      diar<span style={{ color: m1.green, fontWeight: 400 }}>.</span>ia<span style={{ color: m1.green, fontWeight: 400 }}>.br</span>
    </h1>
    <M1Rule thick />
    <p style={{
      fontFamily: m1Serif, fontSize: 22, lineHeight: 1.28,
      fontStyle: 'italic', margin: '24px 0 0', color: m1.ink, fontWeight: 400,
    }}>
      Seu filtro no caos. Um resumo diário de IA — para ler em 5 minutos e usar IA <span style={{ color: m1.green }}>melhor</span>.
    </p>
    {/* signup card */}
    <div style={{ marginTop: 28, padding: '20px 18px', background: '#fff', border: `1px solid ${m1.ink}`, borderRadius: 12 }}>
      <M1Kicker color={m1.green}>● Receba grátis, todo dia útil</M1Kicker>
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input defaultValue="seu@email.com" style={{
          border: `1px solid ${m1.rule}`, background: m1.paper,
          padding: '14px 16px', borderRadius: 999,
          fontFamily: m1Sans, fontSize: 16, color: m1.ink, outline: 'none',
        }} />
        <button style={{
          background: m1.ink, color: m1.paper, border: 'none',
          padding: '15px 22px', borderRadius: 999,
          fontFamily: m1Sans, fontSize: 15, fontWeight: 600,
        }}>Assinar grátis →</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        <M1Kicker size={9}>✓ 5 min/dia</M1Kicker>
        <M1Kicker size={9}>✓ Sem spam</M1Kicker>
        <M1Kicker size={9}>✓ Cancele quando quiser</M1Kicker>
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 24, paddingTop: 20, borderTop: `1px solid ${m1.rule}` }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: m1Serif, fontSize: 24, fontWeight: 500, color: m1.ink }}>12,4k</div>
        <M1Kicker size={9}>leitores</M1Kicker>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: m1Serif, fontSize: 24, fontWeight: 500, color: m1.ink }}>412</div>
        <M1Kicker size={9}>edições</M1Kicker>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: m1Serif, fontSize: 24, fontWeight: 500, color: m1.ink }}>5 min</div>
        <M1Kicker size={9}>leitura</M1Kicker>
      </div>
    </div>
  </section>
);

// ── Today's issue ───────────────────────────────────────────
const M1Feature = ({ issue }) => (
  <section style={{ padding: '32px 20px 36px', borderTop: `1px solid ${m1.rule}`, borderBottom: `1px solid ${m1.rule}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
      <M1Kicker color={m1.green}>● Edição de hoje</M1Kicker>
      <M1Kicker>#{issue.n} · {issue.mins} min</M1Kicker>
    </div>
    <div style={{ aspectRatio: '4/3', borderRadius: 6, overflow: 'hidden', background: m1.paperAlt, marginBottom: 22 }}>
      <img src={issue.cover} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
    </div>
    <h2 style={{
      fontFamily: m1Serif, fontSize: 34, lineHeight: 1.02,
      letterSpacing: '-0.025em', fontWeight: 500,
      margin: 0, color: m1.ink,
    }}>{issue.title}</h2>
    <p style={{
      fontFamily: m1Serif, fontSize: 17, lineHeight: 1.42,
      color: m1.inkSoft, margin: '16px 0 0', fontStyle: 'italic',
    }}>{issue.dek}</p>
    <button style={{
      marginTop: 22, background: m1.ink, color: m1.paper,
      border: 'none', padding: '14px 22px', borderRadius: 999,
      fontFamily: m1Sans, fontSize: 14, fontWeight: 500,
    }}>Ler edição completa →</button>
  </section>
);

// ── Especiais: Livros (horizontal shelf) + Cursos (stacked list) ──
const M1BookSpine = ({ book, i }) => {
  const heights = [160, 180, 155, 175, 165, 185, 170, 180];
  const widths = [44, 50, 42, 48, 46, 52, 44, 48];
  return (
    <div style={{
      width: widths[i % widths.length],
      height: heights[i % heights.length],
      background: book.spine,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      padding: '12px 6px',
      boxShadow: 'inset -2px 0 0 rgba(0,0,0,0.18), inset 2px 0 0 rgba(255,255,255,0.06)',
      flex: '0 0 auto',
    }}>
      <div style={{
        writingMode: 'vertical-rl', transform: 'rotate(180deg)',
        fontFamily: m1Serif, fontSize: 11, fontWeight: 500,
        color: 'rgba(255,255,255,0.94)',
        whiteSpace: 'nowrap',
      }}>{book.title}</div>
    </div>
  );
};

const M1SpecialsLivros = () => {
  const d = window.DiariaData;
  return (
    <section style={{ padding: '40px 0 36px', background: m1.paperAlt, borderBottom: `1px solid ${m1.rule}` }}>
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <M1Kicker color={m1.green}>● Lista aberta · grátis</M1Kicker>
          <M1Kicker>{d.books.length}+ títulos</M1Kicker>
        </div>
        <h2 style={{
          fontFamily: m1Serif, fontSize: 42, fontWeight: 500,
          letterSpacing: '-0.03em', margin: '4px 0 12px',
          color: m1.ink, lineHeight: 0.98,
        }}>
          Livros<br /><span style={{ fontStyle: 'italic' }}>sobre IA.</span>
        </h2>
        <p style={{ fontFamily: m1Sans, fontSize: 15, lineHeight: 1.5, color: m1.inkSoft, margin: '0 0 22px' }}>
          De introdução acessível a tratados densos. Organizados por nível.
        </p>
      </div>
      {/* horizontal bookshelf — full-bleed scroll */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 4,
        padding: '20px 20px 14px',
        overflowX: 'auto',
        borderBottom: `2px solid ${m1.ink}`,
        margin: '0 20px',
        WebkitOverflowScrolling: 'touch',
      }}>
        {d.books.map((b, i) => <M1BookSpine key={b.title} book={b} i={i} />)}
        <div style={{
          flex: '0 0 auto', width: 60, height: 150,
          border: `1px dashed ${m1.rule}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: m1Mono, fontSize: 10, color: m1.inkFaint,
          textAlign: 'center',
        }}>
          + 34<br />outros
        </div>
      </div>
      <div style={{ padding: '20px 20px 0', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ padding: '6px 12px', background: m1.greenTint, color: m1.greenDeep, fontFamily: m1Mono, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', borderRadius: 999 }}>iniciante · 14</span>
        <span style={{ padding: '6px 12px', background: m1.paper, color: m1.inkSoft, border: `1px solid ${m1.rule}`, fontFamily: m1Mono, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', borderRadius: 999 }}>intermediário · 18</span>
        <span style={{ padding: '6px 12px', background: m1.paper, color: m1.inkSoft, border: `1px solid ${m1.rule}`, fontFamily: m1Mono, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', borderRadius: 999 }}>avançado · 10</span>
      </div>
      <div style={{ padding: '20px' }}>
        <button style={{
          width: '100%', background: m1.ink, color: m1.paper,
          border: 'none', padding: '15px 22px', borderRadius: 999,
          fontFamily: m1Sans, fontSize: 15, fontWeight: 500,
        }}>Ver a estante completa →</button>
      </div>
    </section>
  );
};

const M1SpecialsCursos = () => {
  const d = window.DiariaData;
  return (
    <section style={{ padding: '40px 20px 36px', background: m1.ink, color: m1.paper }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontFamily: m1Mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: m1.green }}>● Para assinantes</div>
        <div style={{ fontFamily: m1Mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(244,239,226,0.5)' }}>{d.courses.length}+ cursos</div>
      </div>
      <h2 style={{
        fontFamily: m1Serif, fontSize: 42, fontWeight: 500,
        letterSpacing: '-0.03em', margin: '4px 0 12px',
        color: m1.paper, lineHeight: 0.98,
      }}>
        Cursos<br /><span style={{ fontStyle: 'italic', color: m1.green }}>gratuitos.</span>
      </h2>
      <p style={{ fontFamily: m1Sans, fontSize: 15, lineHeight: 1.5, color: 'rgba(244,239,226,0.7)', margin: '0 0 24px' }}>
        Selecionados entre as melhores plataformas. Atualizamos toda semana.
      </p>
      <div style={{ background: 'rgba(244,239,226,0.04)', border: '1px solid rgba(244,239,226,0.12)' }}>
        {d.courses.slice(0, 5).map((c, i) => (
          <div key={c.title} style={{
            padding: '16px 16px', display: 'grid',
            gridTemplateColumns: '44px 1fr auto', gap: 14, alignItems: 'center',
            borderTop: i === 0 ? 'none' : '1px solid rgba(244,239,226,0.08)',
            minHeight: 64,
          }}>
            <div style={{
              width: 44, height: 44, background: m1.green, color: m1.ink,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: m1Mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
              borderRadius: 6,
            }}>{c.tag}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: m1Serif, fontSize: 17, fontWeight: 500, color: m1.paper, lineHeight: 1.2, letterSpacing: '-0.01em' }}>{c.title}</div>
              <div style={{ fontFamily: m1Sans, fontSize: 12, color: 'rgba(244,239,226,0.6)', marginTop: 3 }}>{c.provider} · {c.hours}h · {c.level}</div>
            </div>
            <div style={{ fontFamily: m1Mono, fontSize: 12, color: 'rgba(244,239,226,0.5)' }}>↗</div>
          </div>
        ))}
      </div>
      <button style={{
        marginTop: 20, width: '100%',
        background: m1.green, color: m1.ink, border: 'none',
        padding: '15px 22px', borderRadius: 999,
        fontFamily: m1Sans, fontSize: 15, fontWeight: 600,
      }}>Ver os 28 cursos →</button>
    </section>
  );
};

// ── Archive list ────────────────────────────────────────────
const M1ArchiveRow = ({ issue }) => (
  <article style={{
    display: 'grid', gridTemplateColumns: '88px 1fr', gap: 14,
    padding: '20px 0', borderTop: `1px solid ${m1.rule}`, alignItems: 'start',
  }}>
    <div style={{ aspectRatio: '1/1', borderRadius: 4, overflow: 'hidden', background: m1.paperAlt }}>
      <img src={issue.cover} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: m1Mono, fontSize: 10, color: m1.inkFaint, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
        <span>#{issue.n} · {issue.dateShort}</span>
        <span>{issue.mins} min</span>
      </div>
      <h3 style={{ fontFamily: m1Serif, fontSize: 19, lineHeight: 1.15, letterSpacing: '-0.015em', fontWeight: 500, margin: 0, color: m1.ink }}>
        {issue.title}
      </h3>
    </div>
  </article>
);

const M1Archive = ({ issues }) => (
  <section style={{ padding: '40px 20px 36px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
      <h2 style={{ fontFamily: m1Serif, fontSize: 30, fontWeight: 500, letterSpacing: '-0.025em', margin: 0, color: m1.ink }}>
        Edições anteriores
      </h2>
    </div>
    <p style={{ fontFamily: m1Sans, fontSize: 14, color: m1.inkSoft, margin: '0 0 4px' }}>
      411 edições no arquivo.
    </p>
    <div style={{ marginTop: 20 }}>
      {issues.slice(1).map((iss) => <M1ArchiveRow key={iss.n} issue={iss} />)}
      <div style={{ borderTop: `1px solid ${m1.rule}` }} />
    </div>
    <button style={{
      marginTop: 24, width: '100%',
      background: 'transparent', border: `1px solid ${m1.ink}`, color: m1.ink,
      padding: '14px 22px', borderRadius: 999,
      fontFamily: m1Sans, fontSize: 14, fontWeight: 500,
    }}>Ver arquivo completo →</button>
  </section>
);

// ── FAQ ─────────────────────────────────────────────────────
const M1Faqs = ({ faqs }) => (
  <section style={{ padding: '40px 20px 36px', background: m1.paperAlt }}>
    <M1Kicker>Antes de assinar</M1Kicker>
    <h2 style={{ fontFamily: m1Serif, fontSize: 36, fontWeight: 500, letterSpacing: '-0.03em', margin: '8px 0 20px', color: m1.ink, lineHeight: 1 }}>
      Perguntas <span style={{ fontStyle: 'italic' }}>frequentes.</span>
    </h2>
    <div>
      {faqs.map((f, i) => (
        <details key={i} open={i === 0} style={{ borderTop: `1px solid ${m1.rule}`, padding: '18px 0' }}>
          <summary style={{ listStyle: 'none', cursor: 'pointer', display: 'grid', gridTemplateColumns: '1fr 20px', gap: 12, alignItems: 'start' }}>
            <h3 style={{ fontFamily: m1Serif, fontSize: 19, fontWeight: 500, margin: 0, color: m1.ink, letterSpacing: '-0.01em' }}>{f.q}</h3>
            <span style={{ fontFamily: m1Serif, fontSize: 24, color: m1.green, lineHeight: 1, paddingTop: 2 }}>+</span>
          </summary>
          <p style={{ fontFamily: m1Sans, fontSize: 14, lineHeight: 1.55, color: m1.inkSoft, margin: '12px 0 0' }}>{f.a}</p>
        </details>
      ))}
      <div style={{ borderTop: `1px solid ${m1.rule}` }} />
    </div>
  </section>
);

// ── Footer subscribe ────────────────────────────────────────
const M1Footer = () => (
  <section style={{ padding: '48px 20px 120px', background: m1.ink, color: m1.paper }}>
    <div style={{ fontFamily: m1Serif, fontSize: 44, lineHeight: 0.95, letterSpacing: '-0.035em', fontWeight: 500 }}>
      5 minutos.<br /><span style={{ fontStyle: 'italic', color: 'var(--brand-bright)' }}>Toda manhã.</span>
    </div>
    <div style={{ marginTop: 24, fontFamily: m1Mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(244,239,226,0.6)' }}>Assine grátis</div>
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <input defaultValue="seu@email.com" style={{
        border: '1px solid rgba(244,239,226,0.3)', background: 'transparent',
        padding: '14px 16px', borderRadius: 999,
        fontFamily: m1Sans, fontSize: 16, color: m1.paper, outline: 'none',
      }} />
      <button style={{
        background: m1.paper, color: m1.ink, border: 'none',
        padding: '15px 22px', borderRadius: 999,
        fontFamily: m1Sans, fontSize: 15, fontWeight: 600,
      }}>Assinar grátis</button>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
      <M1Kicker size={9} color="rgba(244,239,226,0.5)">Seg–Sex · 8h</M1Kicker>
      <M1Kicker size={9} color="rgba(244,239,226,0.5)">Sem spam</M1Kicker>
      <M1Kicker size={9} color="rgba(244,239,226,0.5)">Cancele</M1Kicker>
    </div>
    <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(244,239,226,0.15)', fontFamily: m1Mono, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(244,239,226,0.5)', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span>© 2026 Diar.ia · São Paulo</span>
      <span>Privacidade · Termos · Reportar</span>
    </div>
  </section>
);

// ── Sticky subscribe bar ────────────────────────────────────
const M1StickyBar = () => (
  <div style={{
    position: 'sticky', bottom: 0, zIndex: 30,
    padding: '12px 16px 16px',
    background: 'rgba(244,239,226,0.96)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    borderTop: `1px solid ${m1.rule}`,
    display: 'flex', gap: 10, alignItems: 'center',
  }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: m1Serif, fontSize: 15, lineHeight: 1.2, color: m1.ink, fontWeight: 500 }}>5 min sobre IA, toda manhã.</div>
      <div style={{ fontFamily: m1Mono, fontSize: 10, color: m1.inkFaint, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>12,4 mil leitores · grátis</div>
    </div>
    <button style={{
      background: m1.ink, color: m1.paper, border: 'none',
      padding: '12px 18px', borderRadius: 999,
      fontFamily: m1Sans, fontSize: 14, fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>Assinar →</button>
  </div>
);

// ── Compose ────────────────────────────────────────────────
const V1MobileLanding = () => {
  const d = window.DiariaData;
  return (
    <div style={{ background: m1.paper, color: m1.ink, fontFamily: m1Sans, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <M1Nav />
      <main style={{ flex: 1 }}>
        <M1Masthead />
        <M1Feature issue={d.issues[0]} />
        <M1SpecialsLivros />
        <M1SpecialsCursos />
        <M1Archive issues={d.issues} />
        <M1Faqs faqs={d.faqs} />
        <M1Footer />
      </main>
      <M1StickyBar />
    </div>
  );
};

window.V1MobileLanding = V1MobileLanding;
