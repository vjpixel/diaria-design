// Variation 1 — "Daily Edition"
// Newspaper masthead, serif headlines, structured archive. Plays on
// "diária" = daily newspaper. Warm cream paper + ink black + a single
// hot red for the brand dot.

const v1 = {
  paper: '#FBFAF6',
  paperAlt: '#ebe5d0',
  ink: '#171411',
  inkSoft: '#171411',
  inkFaint: '#171411',
  rule: 'rgba(23,20,17,0.18)',
  green: 'var(--brand)',       // brand green (subscribe/accent)
  greenDeep: 'var(--brand-deep)',
  greenTint: 'var(--brand-tint)',
};

const v1Serif = `Georgia, 'Times New Roman', serif`;
const v1Sans = `'Geist', -apple-system, BlinkMacSystemFont, system-ui, sans-serif`;
const v1Mono = `'Geist Mono', 'JetBrains Mono', ui-monospace, monospace`;

const V1Kicker = ({ children, color }) => (
  <div style={{ fontFamily: v1Mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.16em', color: color || v1.inkSoft }}>{children}</div>
);

const V1Rule = ({ thick, style }) => (
  <div style={{ height: thick ? 2 : 1, background: v1.ink, opacity: thick ? 1 : 0.18, ...style }} />
);

const V1Logo = ({ size = 20 }) => (
  <div style={{ fontFamily: v1Sans, fontWeight: 600, fontSize: size, letterSpacing: '-0.02em', color: v1.ink, display: 'inline-flex', alignItems: 'baseline' }}>
    diar<span style={{ color: v1.green }}>.</span>ia<span style={{ color: v1.green }}>.br</span>
  </div>
);

const V1Nav = () => (
  <header style={{ padding: '18px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${v1.rule}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
      <V1Logo />
      <div style={{ fontFamily: v1Mono, fontSize: 11, color: v1.inkFaint, letterSpacing: '0.08em' }}>EDIÇÃO Nº 412 · TER 19 MAI 2026</div>
    </div>
    <nav style={{ display: 'flex', gap: 28, fontFamily: v1Sans, fontSize: 13, color: v1.inkSoft }}>
      <a>Edições</a><a>Especiais</a><a>Livros</a><a>Cursos</a><a>Sobre</a>
    </nav>
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontFamily: v1Sans, fontSize: 13 }}>
      <button style={{ background: 'transparent', border: 'none', color: v1.inkSoft, padding: '8px 12px', fontSize: 13, fontFamily: 'inherit' }}>Buscar</button>
      <button style={{ background: 'transparent', border: `1px solid ${v1.rule}`, color: v1.ink, padding: '8px 14px', borderRadius: 999, fontFamily: 'inherit', fontSize: 13 }}>Entrar</button>
      <button style={{ background: v1.ink, color: v1.paper, border: 'none', padding: '9px 16px', borderRadius: 999, fontFamily: 'inherit', fontSize: 13, fontWeight: 500 }}>Assinar</button>
    </div>
  </header>
);

const V1Masthead = () => (
  <section style={{ padding: '64px 56px 56px', position: 'relative' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: v1Mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.16em', color: v1.inkSoft, marginBottom: 24 }}>
      <span>Diário · de segunda a sexta · São Paulo, BR</span>
      <span>Vol. III · Nº 412 · R$ 0,00</span>
    </div>
    <V1Rule thick />
    <h1 style={{ fontFamily: v1Serif, fontSize: 220, lineHeight: 0.88, letterSpacing: '-0.05em', fontWeight: 500, margin: '24px 0 0', color: v1.ink, textAlign: 'center' }}>
      diar<span style={{ color: v1.green, fontWeight: 400 }}>.</span>ia<span style={{ color: v1.green, fontWeight: 400 }}>.br</span>
    </h1>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16 }}>
      <V1Kicker>Seu filtro no caos</V1Kicker>
      <V1Kicker>{`12.4 mil leitores · 5 min de leitura`}</V1Kicker>
    </div>
    <V1Rule thick style={{ marginTop: 12 }} />
    <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 64, marginTop: 56, alignItems: 'start' }}>
      <p style={{ fontFamily: v1Serif, fontSize: 32, lineHeight: 1.25, fontStyle: 'italic', margin: 0, color: v1.ink, fontWeight: 400 }}>
        Um resumo diário das principais pesquisas, notícias, tendências e insights — para ler em 5 minutos, se manter atualizado e usar IA <span style={{ color: v1.green }}>melhor</span>.
      </p>
      <div>
        <V1Kicker>Comece a receber hoje</V1Kicker>
        <div style={{ display: 'flex', marginTop: 14, border: `1px solid ${v1.ink}`, borderRadius: 999, padding: 4, background: '#fff' }}>
          <input defaultValue="seu@email.com" style={{ flex: 1, border: 'none', background: 'transparent', padding: '10px 16px', fontFamily: v1Sans, fontSize: 14, color: v1.ink, outline: 'none' }} />
          <button style={{ background: v1.ink, color: v1.paper, border: 'none', padding: '10px 22px', borderRadius: 999, fontFamily: v1Sans, fontSize: 14, fontWeight: 500 }}>Assinar grátis</button>
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 16, fontFamily: v1Mono, fontSize: 11, color: v1.inkFaint, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <span>✓ Seg–Sex</span><span>✓ 5 min</span><span>✓ Cancelar a qualquer momento</span>
        </div>
      </div>
    </div>
  </section>
);

const V1Feature = ({ issue }) => (
  <section style={{ padding: '64px 56px', borderTop: `1px solid ${v1.rule}`, borderBottom: `1px solid ${v1.rule}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32 }}>
      <V1Kicker color={v1.green}>● EDIÇÃO DE HOJE</V1Kicker>
      <V1Kicker>{issue.dateISO} · #{issue.n} · {issue.mins} min</V1Kicker>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 56, alignItems: 'start' }}>
      <div>
        <h2 style={{ fontFamily: v1Serif, fontSize: 68, lineHeight: 1.0, letterSpacing: '-0.028em', fontWeight: 500, margin: 0, color: v1.ink }}>
          {issue.title}
        </h2>
        <p style={{ fontFamily: v1Serif, fontSize: 22, lineHeight: 1.4, color: v1.inkSoft, marginTop: 28, fontStyle: 'italic' }}>
          {issue.dek}
        </p>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 36, fontFamily: v1Sans, fontSize: 13, color: v1.inkSoft }}>
          <button style={{ background: v1.ink, color: v1.paper, border: 'none', padding: '11px 22px', borderRadius: 999, fontFamily: 'inherit', fontSize: 13, fontWeight: 500 }}>Ler edição</button>
          <span style={{ color: v1.inkFaint, fontFamily: v1Mono, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>ou pelo email →</span>
        </div>
      </div>
      <div style={{ aspectRatio: '4/3', borderRadius: 6, overflow: 'hidden', background: v1.paperAlt }}>
        <img src={issue.cover} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
      </div>
    </div>
  </section>
);

const V1ArchiveCard = ({ issue }) => (
  <article style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ aspectRatio: '4/3', borderRadius: 4, overflow: 'hidden', background: v1.paperAlt }}>
      <img src={issue.cover} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: v1Mono, fontSize: 11, color: v1.inkFaint, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      <span>#{issue.n} · {issue.dateLong}</span>
      <span>{issue.mins} min</span>
    </div>
    <h3 style={{ fontFamily: v1Serif, fontSize: 26, lineHeight: 1.1, letterSpacing: '-0.02em', fontWeight: 500, margin: 0, color: v1.ink }}>
      {issue.title}
    </h3>
    <p style={{ fontFamily: v1Serif, fontSize: 15, lineHeight: 1.45, color: v1.inkSoft, margin: 0, fontStyle: 'italic' }}>
      {issue.dek}
    </p>
  </article>
);

const V1Archive = ({ issues }) => (
  <section style={{ padding: '72px 56px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
      <h2 style={{ fontFamily: v1Serif, fontSize: 44, fontWeight: 500, letterSpacing: '-0.025em', margin: 0, color: v1.ink }}>
        Edições anteriores
      </h2>
      <a style={{ fontFamily: v1Sans, fontSize: 13, color: v1.ink, textDecoration: 'underline', textUnderlineOffset: 4 }}>Ver arquivo completo (411) →</a>
    </div>
    <V1Rule style={{ marginBottom: 40 }} />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 44, rowGap: 56 }}>
      {issues.slice(1).map((iss) => <V1ArchiveCard key={iss.n} issue={iss} />)}
    </div>
  </section>
);

const V1BookSpine = ({ book, i }) => {
  // Vary height + rotation slightly so the row reads as a real shelf
  const heights = [220, 240, 210, 230, 215, 245, 225, 235];
  const widths = [38, 44, 36, 42, 40, 46, 38, 42];
  return (
    <div style={{
      width: widths[i % widths.length],
      height: heights[i % heights.length],
      background: book.spine,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      padding: '14px 6px',
      position: 'relative',
      boxShadow: 'inset -3px 0 0 rgba(0,0,0,0.18), inset 3px 0 0 rgba(255,255,255,0.06)',
      flex: '0 0 auto',
    }}>
      <div style={{
        writingMode: 'vertical-rl', transform: 'rotate(180deg)',
        fontFamily: v1Serif, fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.92)',
        letterSpacing: '0.02em', whiteSpace: 'nowrap',
        textTransform: 'none',
      }}>{book.title}</div>
    </div>
  );
};

const V1CourseTile = ({ course }) => (
  <div style={{ padding: '16px 16px 18px', borderTop: `1px solid ${v1.rule}`, display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: 14, alignItems: 'center' }}>
    <div style={{
      width: 36, height: 36, background: v1.green, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: v1Mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.04em',
      borderRadius: 4,
    }}>{course.tag}</div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: v1Serif, fontSize: 17, fontWeight: 500, color: v1.ink, lineHeight: 1.2, letterSpacing: '-0.01em' }}>{course.title}</div>
      <div style={{ fontFamily: v1Sans, fontSize: 12, color: v1.inkSoft, marginTop: 3 }}>{course.provider} · {course.hours}h · {course.level}</div>
    </div>
    <div style={{ fontFamily: v1Mono, fontSize: 11, color: v1.inkFaint, letterSpacing: '0.08em' }}>↗</div>
  </div>
);

const V1Specials = ({ specials }) => {
  const d = window.DiariaData;
  return (
    <section style={{ padding: '80px 56px 88px', background: v1.paperAlt, borderTop: `1px solid ${v1.rule}`, borderBottom: `1px solid ${v1.rule}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <V1Kicker color={v1.green}>Cadernos especiais · curadoria contínua</V1Kicker>
        <V1Kicker>Atualizado em 19 mai 2026</V1Kicker>
      </div>
      <h2 style={{ fontFamily: v1Serif, fontSize: 72, fontWeight: 500, letterSpacing: '-0.035em', margin: '12px 0 4px', color: v1.ink, lineHeight: 0.98 }}>
        O que <span style={{ fontStyle: 'italic', color: v1.greenDeep }}>não cabe</span> em 5 minutos.
      </h2>
      <p style={{ fontFamily: v1Serif, fontSize: 20, lineHeight: 1.4, color: v1.inkSoft, margin: '0 0 48px', fontStyle: 'italic', maxWidth: 720 }}>
        Duas coleções vivas, mantidas pela redação, para quem quer ir além da edição diária.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 32 }}>
        {/* Livros */}
        <div style={{ background: v1.paper, padding: '36px 36px 32px', border: `1px solid ${v1.rule}`, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <V1Kicker color={v1.green}>● Lista aberta</V1Kicker>
            <V1Kicker>{d.books.length}+ títulos curados</V1Kicker>
          </div>
          <h3 style={{ fontFamily: v1Serif, fontSize: 52, fontWeight: 500, letterSpacing: '-0.03em', margin: 0, color: v1.ink, lineHeight: 0.98 }}>
            Livros<br /><span style={{ fontStyle: 'italic' }}>sobre IA.</span>
          </h3>
          <p style={{ fontFamily: v1Sans, fontSize: 14, lineHeight: 1.55, color: v1.inkSoft, margin: '18px 0 28px', maxWidth: 460 }}>
            Iniciantes, profissionais e quem quer ir a fundo. Por nível, autor e ano de publicação.
          </p>
          {/* Bookshelf */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, padding: '0 0 8px', borderBottom: `2px solid ${v1.ink}`, marginBottom: 24, minHeight: 260 }}>
            {d.books.map((b, i) => <V1BookSpine key={b.title} book={b} i={i} />)}
            <div style={{ flex: '0 0 auto', width: 70, height: 200, border: `1px dashed ${v1.rule}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: v1Mono, fontSize: 10, color: v1.inkFaint, letterSpacing: '0.08em', textAlign: 'center', padding: 8 }}>
              + 34<br />outros
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, fontFamily: v1Mono, fontSize: 10, color: v1.inkFaint, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 24 }}>
            <span style={{ padding: '4px 10px', background: v1.greenTint, color: v1.greenDeep }}>iniciante · 14</span>
            <span style={{ padding: '4px 10px', border: `1px solid ${v1.rule}` }}>intermediário · 18</span>
            <span style={{ padding: '4px 10px', border: `1px solid ${v1.rule}` }}>avançado · 10</span>
          </div>
          <button style={{ background: v1.ink, color: v1.paper, border: 'none', padding: '13px 22px', borderRadius: 999, fontFamily: v1Sans, fontSize: 14, fontWeight: 500, alignSelf: 'flex-start' }}>
            Acessar a estante completa →
          </button>
        </div>

        {/* Cursos */}
        <div style={{ background: v1.ink, color: v1.paper, padding: '36px 36px 32px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ fontFamily: v1Mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.16em', color: v1.green }}>● Para assinantes</div>
            <div style={{ fontFamily: v1Mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'rgba(244,239,226,0.5)' }}>28 cursos grátis</div>
          </div>
          <h3 style={{ fontFamily: v1Serif, fontSize: 52, fontWeight: 500, letterSpacing: '-0.03em', margin: 0, color: v1.paper, lineHeight: 0.98 }}>
            Cursos<br /><span style={{ fontStyle: 'italic', color: v1.green }}>gratuitos.</span>
          </h3>
          <p style={{ fontFamily: v1Sans, fontSize: 14, lineHeight: 1.55, color: 'rgba(244,239,226,0.65)', margin: '18px 0 24px' }}>
            Selecionados entre os melhores cursos abertos. Atualizamos toda semana.
          </p>
          <div style={{ background: 'rgba(244,239,226,0.04)', border: '1px solid rgba(244,239,226,0.12)', borderRadius: 4, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', fontFamily: v1Mono, fontSize: 10, color: 'rgba(244,239,226,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid rgba(244,239,226,0.12)' }}>
              <span>Curso</span><span>Provedor · h · nível</span>
            </div>
            {d.courses.map((c) => (
              <div key={c.title} style={{ padding: '14px 16px', borderTop: '1px solid rgba(244,239,226,0.08)', display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: 14, alignItems: 'center' }}>
                <div style={{
                  width: 40, height: 40, background: v1.green, color: v1.ink,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: v1Mono, fontSize: 9, fontWeight: 700, letterSpacing: '0.04em',
                  borderRadius: 4,
                }}>{c.tag}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: v1Serif, fontSize: 17, fontWeight: 500, color: v1.paper, lineHeight: 1.2 }}>{c.title}</div>
                  <div style={{ fontFamily: v1Sans, fontSize: 12, color: 'rgba(244,239,226,0.6)', marginTop: 3 }}>{c.provider} · {c.hours}h · {c.level}</div>
                </div>
                <div style={{ fontFamily: v1Mono, fontSize: 11, color: 'rgba(244,239,226,0.5)' }}>↗</div>
              </div>
            ))}
          </div>
          <button style={{ background: v1.green, color: v1.ink, border: 'none', padding: '13px 22px', borderRadius: 999, fontFamily: v1Sans, fontSize: 14, fontWeight: 600, alignSelf: 'flex-start' }}>
            Ver os 28 cursos →
          </button>
        </div>
      </div>
    </section>
  );
};

const V1Faqs = ({ faqs }) => (
  <section style={{ padding: '80px 56px' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64 }}>
      <div>
        <V1Kicker>Antes de assinar</V1Kicker>
        <h2 style={{ fontFamily: v1Serif, fontSize: 56, fontWeight: 500, letterSpacing: '-0.03em', margin: '12px 0 0', color: v1.ink, lineHeight: 1 }}>
          Perguntas<br />frequentes.
        </h2>
      </div>
      <div>
        {faqs.map((f, i) => (
          <div key={i} style={{ borderTop: `1px solid ${v1.rule}`, padding: '24px 0', display: 'grid', gridTemplateColumns: '32px 1fr', gap: 16 }}>
            <div style={{ fontFamily: v1Mono, fontSize: 11, color: v1.inkFaint, paddingTop: 6 }}>0{i + 1}</div>
            <div>
              <h3 style={{ fontFamily: v1Serif, fontSize: 22, fontWeight: 500, margin: 0, color: v1.ink }}>{f.q}</h3>
              <p style={{ fontFamily: v1Sans, fontSize: 15, lineHeight: 1.55, color: v1.inkSoft, margin: '10px 0 0' }}>{f.a}</p>
            </div>
          </div>
        ))}
        <V1Rule />
      </div>
    </div>
  </section>
);

const V1Footer = () => (
  <section style={{ padding: '72px 56px 48px', background: v1.ink, color: v1.paper }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 64, alignItems: 'end' }}>
      <div>
        <div style={{ fontFamily: v1Serif, fontSize: 88, lineHeight: 0.9, letterSpacing: '-0.035em', fontWeight: 500 }}>
          5 minutos.<br /><span style={{ fontStyle: 'italic', color: 'var(--brand-bright)' }}>Toda manhã.</span>
        </div>
      </div>
      <div>
        <div style={{ fontFamily: v1Mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'rgba(244,239,226,0.6)' }}>Assine grátis</div>
        <div style={{ display: 'flex', marginTop: 16, border: '1px solid rgba(244,239,226,0.3)', borderRadius: 999, padding: 4, background: 'transparent' }}>
          <input defaultValue="seu@email.com" style={{ flex: 1, border: 'none', background: 'transparent', padding: '12px 16px', fontFamily: v1Sans, fontSize: 14, color: v1.paper, outline: 'none' }} />
          <button style={{ background: v1.paper, color: v1.ink, border: 'none', padding: '12px 24px', borderRadius: 999, fontFamily: v1Sans, fontSize: 14, fontWeight: 500 }}>Assinar</button>
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 16, fontFamily: v1Mono, fontSize: 11, color: 'rgba(244,239,226,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <span>Seg–Sex · 8h</span><span>Sem spam</span><span>Cancele quando quiser</span>
        </div>
      </div>
    </div>
    <V1Rule style={{ background: 'rgba(244,239,226,0.2)', opacity: 1, marginTop: 64 }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, fontFamily: v1Mono, fontSize: 11, color: 'rgba(244,239,226,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
      <span>© 2026 Diar.ia · São Paulo, Brasil</span>
      <span>Privacidade · Termos · Reportar abuso</span>
    </div>
  </section>
);

const V1Landing = () => {
  const d = window.DiariaData;
  return (
    <div style={{ background: v1.paper, color: v1.ink, fontFamily: v1Sans, minHeight: '100%' }}>
      <V1Nav />
      <V1Masthead />
      <V1Feature issue={d.issues[0]} />
      <V1Specials specials={d.specials} />
      <V1Archive issues={d.issues} />
      <V1Faqs faqs={d.faqs} />
      <V1Footer />
    </div>
  );
};

window.V1Landing = V1Landing;
