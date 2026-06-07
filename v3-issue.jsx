// Variation 3 — "Issue №"
// Editorial magazine. Big italic display serif headlines, bold issue
// numbers as decorative type, full-bleed cover treatments. Cream + deep
// burgundy + ink.

const v3 = {
  cream: '#f1ebde',
  creamAlt: '#e5dcc4',
  ink: '#171411',
  inkSoft: 'rgba(26,22,18,0.62)',
  inkFaint: 'rgba(26,22,18,0.4)',
  rule: 'rgba(26,22,18,0.2)',
  green: 'var(--brand)',
  greenDeep: 'var(--brand-deep)',
  greenSoft: 'var(--brand-bright)',
  greenTint: 'var(--brand-tint)',
};

// Mobile-readable serif (Georgia is a web-safe screen serif)
const v3Display = `Georgia, 'Times New Roman', serif`;
const v3Sans = `'Geist', system-ui, sans-serif`;
const v3Mono = `'Geist Mono', ui-monospace, monospace`;

const V3Logo = ({ size = 24 }) => (
  <div style={{ fontFamily: v3Sans, fontSize: size, fontWeight: 600, color: v3.ink, lineHeight: 1, letterSpacing: '-0.02em', display: 'inline-flex', alignItems: 'baseline' }}>
    diar<span style={{ color: v3.green }}>.</span>ia<span style={{ color: v3.green }}>.br</span>
  </div>
);

const V3Kicker = ({ children, accent }) => (
  <div style={{ fontFamily: v3Mono, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: accent ? v3.green : v3.inkSoft }}>
    {children}
  </div>
);

const V3Nav = () => (
  <header style={{ padding: '22px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <V3Logo />
    <nav style={{ display: 'flex', gap: 32, fontFamily: v3Sans, fontSize: 13, color: v3.ink }}>
      <a>Edições</a>
      <a>Especiais</a>
      <a>Livros</a>
      <a>Cursos</a>
      <a>Sobre</a>
    </nav>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: v3Sans, fontSize: 13 }}>
      <button style={{ background: 'transparent', border: 'none', color: v3.ink, fontFamily: 'inherit', fontSize: 13 }}>Buscar</button>
      <button style={{ background: 'transparent', border: 'none', color: v3.ink, fontFamily: 'inherit', fontSize: 13 }}>Entrar</button>
      <button style={{ background: v3.ink, color: v3.cream, border: 'none', padding: '10px 18px', borderRadius: 999, fontFamily: 'inherit', fontSize: 13, fontWeight: 500 }}>Assinar</button>
    </div>
  </header>
);

const V3Hero = () => (
  <section style={{ padding: '40px 56px 80px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 56, alignItems: 'start' }}>
      <div>
        <V3Kicker>Edição diária · ano III · Nº 412</V3Kicker>
        <h1 style={{ fontFamily: v3Display, fontSize: 168, lineHeight: 0.88, letterSpacing: '-0.045em', fontWeight: 400, margin: '20px 0 0', color: v3.ink }}>
          Seu filtro<br />
          no <span style={{ fontStyle: 'italic', color: v3.green }}>caos</span><br />
          da IA.
        </h1>
        <p style={{ fontFamily: v3Sans, fontSize: 19, lineHeight: 1.5, color: v3.inkSoft, marginTop: 36, maxWidth: 540 }}>
          Um resumo diário das principais pesquisas, notícias, tendências e insights. Para ler em 5 minutos, manter-se atualizado e usar IA melhor.
        </p>
        <div style={{ display: 'flex', marginTop: 36, maxWidth: 540, gap: 12, alignItems: 'center' }}>
          <input defaultValue="seu@email.com" style={{ flex: 1, border: `1px solid ${v3.ink}`, background: v3.cream, padding: '14px 18px', borderRadius: 999, fontFamily: v3Sans, fontSize: 14, color: v3.ink, outline: 'none' }} />
          <button style={{ background: v3.ink, color: v3.cream, border: 'none', padding: '14px 26px', borderRadius: 999, fontFamily: v3Sans, fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap' }}>Assinar grátis →</button>
        </div>
        <div style={{ display: 'flex', gap: 32, marginTop: 28, fontFamily: v3Sans, fontSize: 13, color: v3.inkSoft }}>
          <span><strong style={{ color: v3.ink, fontFamily: v3Display, fontSize: 22, fontWeight: 400 }}>12.4k</strong> leitores</span>
          <span><strong style={{ color: v3.ink, fontFamily: v3Display, fontSize: 22, fontWeight: 400 }}>412</strong> edições</span>
          <span><strong style={{ color: v3.ink, fontFamily: v3Display, fontSize: 22, fontWeight: 400 }}>5 min</strong> de leitura</span>
        </div>
      </div>

      {/* Stack of cover thumbs, hand-fanned */}
      <div style={{ position: 'relative', height: 560 }}>
        {window.DiariaData.issues.slice(0, 4).map((iss, i) => {
          const rotations = [-6, 4, -2, 8];
          const offsets = [{ x: 60, y: 30 }, { x: 0, y: 80 }, { x: 100, y: 140 }, { x: 30, y: 220 }];
          return (
            <div key={iss.n} style={{
              position: 'absolute',
              top: offsets[i].y,
              left: offsets[i].x,
              transform: `rotate(${rotations[i]}deg)`,
              width: 260,
              boxShadow: '0 24px 60px rgba(26,22,18,0.18), 0 4px 12px rgba(26,22,18,0.1)',
            }}>
              <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: v3.creamAlt, position: 'relative' }}>
                <img src={iss.cover} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                <div style={{ position: 'absolute', top: 14, left: 14, fontFamily: v3Mono, fontSize: 10, color: '#fff', mixBlendMode: 'difference', letterSpacing: '0.12em' }}>
                  Nº {iss.n}
                </div>
                <div style={{ position: 'absolute', top: 14, right: 14, fontFamily: v3Mono, fontSize: 10, color: '#fff', mixBlendMode: 'difference', letterSpacing: '0.12em' }}>
                  {iss.dateShort}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const V3LatestFeature = ({ issue }) => (
  <section style={{ padding: '80px 56px', background: v3.ink, color: v3.cream, position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 40, right: 56, display: 'flex', alignItems: 'baseline', gap: 16 }}>
      <V3Kicker>● Edição de hoje</V3Kicker>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 64, alignItems: 'center' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ aspectRatio: '4/5', overflow: 'hidden', background: '#2a221b' }}>
          <img src={issue.cover} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
        </div>
        <div style={{ position: 'absolute', bottom: -20, left: -32, fontFamily: v3Display, fontSize: 280, lineHeight: 0.8, fontWeight: 400, color: v3.greenSoft, fontStyle: 'italic', pointerEvents: 'none' }}>
          {issue.n}
        </div>
      </div>
      <div>
        <div style={{ fontFamily: v3Mono, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(241,235,222,0.5)', marginBottom: 16 }}>
          Nº {issue.n} · {issue.dateLong} · {issue.mins} min de leitura
        </div>
        <h2 style={{ fontFamily: v3Display, fontSize: 76, lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 400, margin: 0, color: v3.cream }}>
          {issue.title.split(',')[0]},<br />
          <span style={{ fontStyle: 'italic' }}>{issue.title.split(',')[1] || ''}</span>
        </h2>
        <p style={{ fontFamily: v3Sans, fontSize: 18, lineHeight: 1.55, color: 'rgba(241,235,222,0.75)', marginTop: 28 }}>
          {issue.dek}
        </p>
        <button style={{ background: v3.cream, color: v3.ink, border: 'none', padding: '14px 26px', borderRadius: 999, fontFamily: v3Sans, fontSize: 14, fontWeight: 500, marginTop: 32 }}>
          Ler esta edição →
        </button>
      </div>
    </div>
  </section>
);

const V3IssueCard = ({ issue }) => (
  <article style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
    <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: v3.creamAlt }}>
      <img src={issue.cover} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.55))' }} />
      <div style={{ position: 'absolute', top: 16, left: 16, fontFamily: v3Mono, fontSize: 11, color: '#fff', letterSpacing: '0.14em' }}>
        Nº {issue.n}
      </div>
      <div style={{ position: 'absolute', top: 16, right: 16, fontFamily: v3Mono, fontSize: 11, color: '#fff', letterSpacing: '0.14em' }}>
        {issue.dateShort}
      </div>
      <div style={{ position: 'absolute', bottom: 16, right: 16, fontFamily: v3Mono, fontSize: 11, color: '#fff', letterSpacing: '0.14em' }}>
        {issue.mins} min
      </div>
    </div>
    <h3 style={{ fontFamily: v3Display, fontSize: 28, lineHeight: 1.05, letterSpacing: '-0.022em', fontWeight: 400, margin: '20px 0 0', color: v3.ink }}>
      {issue.title}
    </h3>
    <p style={{ fontFamily: v3Sans, fontSize: 14, lineHeight: 1.5, color: v3.inkSoft, margin: '10px 0 0' }}>
      {issue.dek}
    </p>
  </article>
);

const V3Archive = ({ issues }) => (
  <section style={{ padding: '96px 56px 80px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
      <div>
        <V3Kicker accent>Arquivo</V3Kicker>
        <h2 style={{ fontFamily: v3Display, fontSize: 88, fontWeight: 400, letterSpacing: '-0.035em', margin: '12px 0 0', lineHeight: 0.95, color: v3.ink }}>
          411 edições<br /><span style={{ fontStyle: 'italic', color: v3.green }}>anteriores</span>
        </h2>
      </div>
      <div style={{ display: 'flex', gap: 8, fontFamily: v3Sans, fontSize: 13 }}>
        <button style={{ padding: '8px 16px', borderRadius: 999, border: `1px solid ${v3.ink}`, background: v3.ink, color: v3.cream, fontFamily: 'inherit' }}>Todas</button>
        <button style={{ padding: '8px 16px', borderRadius: 999, border: `1px solid ${v3.rule}`, background: 'transparent', color: v3.ink, fontFamily: 'inherit' }}>Pesquisa</button>
        <button style={{ padding: '8px 16px', borderRadius: 999, border: `1px solid ${v3.rule}`, background: 'transparent', color: v3.ink, fontFamily: 'inherit' }}>Lançamentos</button>
        <button style={{ padding: '8px 16px', borderRadius: 999, border: `1px solid ${v3.rule}`, background: 'transparent', color: v3.ink, fontFamily: 'inherit' }}>Política</button>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 36, rowGap: 56 }}>
      {issues.slice(1).map((iss) => <V3IssueCard key={iss.n} issue={iss} />)}
    </div>
    <div style={{ textAlign: 'center', marginTop: 64 }}>
      <button style={{ background: 'transparent', border: `1px solid ${v3.ink}`, color: v3.ink, padding: '14px 32px', borderRadius: 999, fontFamily: v3Sans, fontSize: 14 }}>
        Carregar mais edições
      </button>
    </div>
  </section>
);

const V3BookSpine = ({ book, i }) => {
  const heights = [240, 260, 230, 250, 235, 265, 245, 255];
  const widths = [42, 48, 40, 46, 44, 50, 42, 46];
  return (
    <div style={{
      width: widths[i % widths.length],
      height: heights[i % heights.length],
      background: book.spine,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      padding: '14px 6px',
      boxShadow: 'inset -3px 0 0 rgba(0,0,0,0.18), inset 3px 0 0 rgba(255,255,255,0.06)',
      flex: '0 0 auto',
    }}>
      <div style={{
        writingMode: 'vertical-rl', transform: 'rotate(180deg)',
        fontFamily: v3Display, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.94)',
        whiteSpace: 'nowrap',
      }}>{book.title}</div>
    </div>
  );
};

const V3Specials = ({ specials }) => {
  const d = window.DiariaData;
  return (
    <section style={{ padding: '88px 56px', background: v3.creamAlt, position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <V3Kicker accent>Especiais · curadoria contínua</V3Kicker>
        <h2 style={{ fontFamily: v3Display, fontSize: 88, fontWeight: 500, letterSpacing: '-0.035em', margin: '12px 0 16px', color: v3.ink, lineHeight: 0.98 }}>
          Coleções <span style={{ fontStyle: 'italic', color: v3.greenDeep }}>curadas</span>
        </h2>
        <p style={{ fontFamily: v3Sans, fontSize: 18, lineHeight: 1.55, color: v3.inkSoft, margin: '0 auto', maxWidth: 600 }}>
          O que não cabe em 5 minutos por dia: duas estantes vivas, mantidas pela redação.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 28 }}>
        {/* Livros */}
        <div style={{ background: v3.cream, padding: '40px 40px 36px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -10, fontFamily: v3Display, fontSize: 260, lineHeight: 0.8, fontWeight: 400, color: 'rgba(26,22,18,0.05)', fontStyle: 'italic', pointerEvents: 'none' }}>
            01
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, position: 'relative' }}>
            <V3Kicker accent>● Lista aberta · grátis</V3Kicker>
            <V3Kicker>{d.books.length}+ títulos</V3Kicker>
          </div>
          <h3 style={{ fontFamily: v3Display, fontSize: 64, fontWeight: 500, letterSpacing: '-0.03em', margin: 0, color: v3.ink, lineHeight: 0.95, position: 'relative' }}>
            Livros<br /><span style={{ fontStyle: 'italic' }}>sobre IA.</span>
          </h3>
          <p style={{ fontFamily: v3Sans, fontSize: 16, lineHeight: 1.55, color: v3.inkSoft, margin: '20px 0 28px', position: 'relative', maxWidth: 480 }}>
            De introdução acessível a tratados densos — organizados por nível, autor e ano.
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, padding: '0 0 10px', borderBottom: `2px solid ${v3.ink}`, marginBottom: 24, minHeight: 280, position: 'relative' }}>
            {d.books.map((b, i) => <V3BookSpine key={b.title} book={b} i={i} />)}
            <div style={{ flex: '0 0 auto', width: 76, height: 210, border: `1px dashed ${v3.rule}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: v3Mono, fontSize: 11, color: v3.inkFaint, textAlign: 'center', padding: 10 }}>
              + 34<br />outros
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 28, fontFamily: v3Mono, fontSize: 11, color: v3.inkFaint, position: 'relative' }}>
            <span style={{ padding: '5px 12px', background: v3.greenTint, color: v3.greenDeep, borderRadius: 999 }}>iniciante · 14</span>
            <span style={{ padding: '5px 12px', border: `1px solid ${v3.rule}`, borderRadius: 999 }}>intermediário · 18</span>
            <span style={{ padding: '5px 12px', border: `1px solid ${v3.rule}`, borderRadius: 999 }}>avançado · 10</span>
          </div>
          <button style={{ background: v3.ink, color: v3.cream, border: 'none', padding: '14px 26px', borderRadius: 999, fontFamily: v3Sans, fontSize: 14, fontWeight: 500, alignSelf: 'flex-start', position: 'relative' }}>
            Ver a estante completa →
          </button>
        </div>

        {/* Cursos */}
        <div style={{ background: v3.ink, color: v3.cream, padding: '40px 40px 36px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -10, fontFamily: v3Display, fontSize: 260, lineHeight: 0.8, fontWeight: 400, color: 'rgba(241,235,222,0.06)', fontStyle: 'italic', pointerEvents: 'none' }}>
            02
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, position: 'relative' }}>
            <div style={{ fontFamily: v3Mono, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: v3.green }}>● Para assinantes</div>
            <div style={{ fontFamily: v3Mono, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(241,235,222,0.5)' }}>{d.courses.length}+ cursos</div>
          </div>
          <h3 style={{ fontFamily: v3Display, fontSize: 64, fontWeight: 500, letterSpacing: '-0.03em', margin: 0, color: v3.cream, lineHeight: 0.95, position: 'relative' }}>
            Cursos<br /><span style={{ fontStyle: 'italic', color: v3.green }}>gratuitos.</span>
          </h3>
          <p style={{ fontFamily: v3Sans, fontSize: 16, lineHeight: 1.55, color: 'rgba(241,235,222,0.65)', margin: '20px 0 24px', position: 'relative' }}>
            Selecionados entre as melhores plataformas. Atualizamos toda semana.
          </p>
          <div style={{ background: 'rgba(241,235,222,0.04)', border: '1px solid rgba(241,235,222,0.12)', marginBottom: 28, position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 18px', fontFamily: v3Mono, fontSize: 10, color: 'rgba(241,235,222,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase', borderBottom: '1px solid rgba(241,235,222,0.12)' }}>
              <span>Curso</span><span>Nível · Horas</span>
            </div>
            {d.courses.slice(0, 6).map((c) => (
              <div key={c.title} style={{ padding: '14px 18px', borderTop: '1px solid rgba(241,235,222,0.08)', display: 'grid', gridTemplateColumns: '44px 1fr auto', gap: 14, alignItems: 'center' }}>
                <div style={{
                  width: 44, height: 44, background: v3.green, color: v3.ink,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: v3Mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.04em',
                  borderRadius: 6,
                }}>{c.tag}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: v3Display, fontSize: 19, fontWeight: 500, color: v3.cream, lineHeight: 1.15, letterSpacing: '-0.01em' }}>{c.title}</div>
                  <div style={{ fontFamily: v3Sans, fontSize: 12, color: 'rgba(241,235,222,0.55)', marginTop: 3 }}>{c.provider}</div>
                </div>
                <div style={{ fontFamily: v3Mono, fontSize: 11, color: 'rgba(241,235,222,0.55)', textAlign: 'right' }}>
                  <div>{c.level}</div>
                  <div style={{ marginTop: 2 }}>{c.hours}h</div>
                </div>
              </div>
            ))}
          </div>
          <button style={{ background: v3.green, color: v3.ink, border: 'none', padding: '14px 26px', borderRadius: 999, fontFamily: v3Sans, fontSize: 14, fontWeight: 600, alignSelf: 'flex-start', position: 'relative' }}>
            Ver os 28 cursos →
          </button>
        </div>
      </div>
    </section>
  );
};

const V3Faqs = ({ faqs }) => (
  <section style={{ padding: '96px 56px' }}>
    <div style={{ textAlign: 'center', marginBottom: 56 }}>
      <V3Kicker>FAQ</V3Kicker>
      <h2 style={{ fontFamily: v3Display, fontSize: 80, fontWeight: 400, letterSpacing: '-0.035em', margin: '12px 0 0', color: v3.ink, lineHeight: 1 }}>
        Antes de <span style={{ fontStyle: 'italic', color: v3.green }}>assinar</span>
      </h2>
    </div>
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      {faqs.map((f, i) => (
        <details key={i} open={i === 0} style={{ borderTop: `1px solid ${v3.rule}`, padding: '28px 0' }}>
          <summary style={{ listStyle: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: v3Display, fontSize: 32, fontWeight: 400, letterSpacing: '-0.02em', margin: 0, color: v3.ink }}>{f.q}</h3>
            <span style={{ fontFamily: v3Display, fontSize: 36, color: v3.green, fontStyle: 'italic' }}>+</span>
          </summary>
          <p style={{ fontFamily: v3Sans, fontSize: 16, lineHeight: 1.6, color: v3.inkSoft, margin: '16px 0 0', maxWidth: 720 }}>{f.a}</p>
        </details>
      ))}
      <div style={{ borderTop: `1px solid ${v3.rule}` }} />
    </div>
  </section>
);

const V3Footer = () => (
  <section style={{ padding: '96px 56px 48px', background: v3.ink, color: v3.cream, position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'relative', textAlign: 'center' }}>
      <V3Kicker>Junte-se a 12.400 leitores</V3Kicker>
      <h2 style={{ fontFamily: v3Display, fontSize: 132, lineHeight: 0.95, letterSpacing: '-0.04em', fontWeight: 400, margin: '20px 0 32px', color: v3.cream }}>
        5 minutos. <span style={{ fontStyle: 'italic', color: v3.greenSoft }}>Toda manhã.</span>
      </h2>
      <div style={{ display: 'flex', maxWidth: 560, margin: '0 auto', gap: 12 }}>
        <input defaultValue="seu@email.com" style={{ flex: 1, border: '1px solid rgba(241,235,222,0.3)', background: 'transparent', padding: '16px 20px', borderRadius: 999, fontFamily: v3Sans, fontSize: 15, color: v3.cream, outline: 'none' }} />
        <button style={{ background: v3.cream, color: v3.ink, border: 'none', padding: '16px 28px', borderRadius: 999, fontFamily: v3Sans, fontSize: 14, fontWeight: 500 }}>Assinar grátis</button>
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 96, paddingTop: 28, borderTop: '1px solid rgba(241,235,222,0.15)', fontFamily: v3Mono, fontSize: 11, color: 'rgba(241,235,222,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
      <span>© 2026 Diar.ia · São Paulo</span>
      <span>Privacidade · Termos · Reportar abuso</span>
    </div>
  </section>
);

const V3Landing = () => {
  const d = window.DiariaData;
  return (
    <div style={{ background: v3.cream, color: v3.ink, fontFamily: v3Sans, minHeight: '100%' }}>
      <V3Nav />
      <V3Hero />
      <V3Specials specials={d.specials} />
      <V3LatestFeature issue={d.issues[0]} />
      <V3Archive issues={d.issues} />
      <V3Faqs faqs={d.faqs} />
      <V3Footer />
    </div>
  );
};

window.V3Landing = V3Landing;
