// Variation 2 — "Signal"
// Intelligence-briefing aesthetic. Mono everywhere, dense feed, a single
// phosphor accent, terminal status line. Plays on "filter through the
// noise" literally.

const v2 = {
  bg: '#0c0d0c',
  bgAlt: '#131513',
  fg: '#e8e4d6',
  fgSoft: 'rgba(232,228,214,0.6)',
  fgFaint: 'rgba(232,228,214,0.35)',
  rule: 'rgba(232,228,214,0.12)',
  signal: 'var(--brand-bright)',   // brand green, terminal-bright
  signalDim: 'color-mix(in srgb, var(--brand-bright) 40%, transparent)',
};

const v2Mono = `'JetBrains Mono', 'Geist Mono', ui-monospace, monospace`;
const v2Sans = `'Geist', system-ui, sans-serif`;

const V2Logo = () => (
  <div style={{ fontFamily: v2Sans, fontWeight: 600, fontSize: 16, letterSpacing: '-0.01em', color: v2.fg, display: 'flex', alignItems: 'center', gap: 10 }}>
    <span style={{ width: 8, height: 8, background: v2.signal, borderRadius: '50%', boxShadow: `0 0 8px ${v2.signal}` }} />
    <span>diar<span style={{ color: v2.signal }}>.</span>ia<span style={{ color: v2.signal }}>.br</span></span>
    <span style={{ color: v2.fgFaint, fontFamily: v2Mono, fontSize: 12 }}>/ signal_feed</span>
  </div>
);

const V2Nav = () => (
  <header style={{ padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${v2.rule}` }}>
    <V2Logo />
    <div style={{ fontFamily: v2Mono, fontSize: 11, color: v2.fgFaint, display: 'flex', gap: 24 }}>
      <span>feed</span><span>arquivo</span><span>especiais</span><span>sobre</span>
    </div>
    <div style={{ fontFamily: v2Mono, fontSize: 11, display: 'flex', gap: 8, alignItems: 'center' }}>
      <span style={{ color: v2.fgFaint }}>[</span>
      <a style={{ color: v2.fgSoft }}>login</a>
      <span style={{ color: v2.fgFaint }}>]</span>
      <button style={{ background: v2.signal, color: v2.bg, border: 'none', padding: '7px 14px', fontFamily: 'inherit', fontSize: 11, fontWeight: 600, marginLeft: 8 }}>$ subscribe ▸</button>
    </div>
  </header>
);

// Animated status ticker (CSS-only — we just paint a snapshot)
const V2StatusBar = () => (
  <div style={{ padding: '10px 48px', borderBottom: `1px solid ${v2.rule}`, background: v2.bgAlt, fontFamily: v2Mono, fontSize: 11, color: v2.fgSoft, display: 'flex', justifyContent: 'space-between' }}>
    <span><span style={{ color: v2.signal }}>●</span> SIGNAL_OK · 412 edições publicadas · 12.4k leitores ativos · retenção 94%</span>
    <span>próxima edição em <span style={{ color: v2.signal }}>03:24:11</span></span>
  </div>
);

const V2Hero = () => (
  <section style={{ padding: '80px 48px 64px', position: 'relative' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 80, alignItems: 'center' }}>
      <div>
        <div style={{ fontFamily: v2Mono, fontSize: 12, color: v2.signal, letterSpacing: '0.12em', marginBottom: 32 }}>
          {'>'} brief.ai/daily —— pt-BR ——
        </div>
        <h1 style={{ fontFamily: v2Mono, fontSize: 112, lineHeight: 0.9, letterSpacing: '-0.04em', fontWeight: 500, margin: 0, color: v2.fg }}>
          sinal<br />
          no <span style={{ color: v2.signal }}>ruído</span><br />
          da IA.
        </h1>
        <p style={{ fontFamily: v2Sans, fontSize: 19, lineHeight: 1.5, color: v2.fgSoft, marginTop: 36, maxWidth: 480 }}>
          Filtramos centenas de fontes em uma briefing diária de 5 minutos. Pesquisas, lançamentos, tendências — só o que importa.
        </p>
        <div style={{ display: 'flex', marginTop: 36, maxWidth: 520, gap: 0 }}>
          <div style={{ fontFamily: v2Mono, fontSize: 14, color: v2.signal, padding: '13px 8px 13px 0', userSelect: 'none' }}>$</div>
          <input defaultValue="seu@email.com" style={{ flex: 1, border: 'none', borderBottom: `1px solid ${v2.signal}`, background: 'transparent', padding: '12px 8px', fontFamily: v2Mono, fontSize: 14, color: v2.fg, outline: 'none' }} />
          <button style={{ background: v2.signal, color: v2.bg, border: 'none', padding: '12px 20px', fontFamily: v2Mono, fontSize: 13, fontWeight: 600, marginLeft: 12 }}>subscribe ▸</button>
        </div>
        <div style={{ fontFamily: v2Mono, fontSize: 11, color: v2.fgFaint, marginTop: 12, letterSpacing: '0.06em' }}>
          // seg–sex · 8h · 5 min · cancele a qualquer momento
        </div>
      </div>

      {/* Signal/noise visualization */}
      <div style={{ fontFamily: v2Mono, fontSize: 10, color: v2.fgFaint, lineHeight: 1.4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, color: v2.fgSoft }}>
          <span>// FEED.RAW</span><span>847 sinais hoje</span>
        </div>
        <V2NoiseGrid />
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '14px 0', color: v2.signal }}>
          <span>↓ DIAR.IA FILTER</span><span>~~~~~~</span>
        </div>
        <V2SignalGrid />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, color: v2.fgSoft }}>
          <span>// BRIEFING.OUT</span><span>6 itens · 5 min</span>
        </div>
      </div>
    </div>
  </section>
);

const V2NoiseGrid = () => {
  // 8 rows × ~80 chars of pseudo-noise headlines
  const noise = [
    'OpenAI ANNOUNCES new tier · Anthropic responds · investors react · ',
    'GPT-5 leak SUGGESTS · Sora2 rumors · benchmark wars · drama on X · ',
    'Meta hires former · Google teases · Nvidia earnings beat estimates ',
    'EU passes AI act § · China regulator · congressional hearing · ',
    'startup raises 200M · failed launch · CEO drama · acquisition · ',
    'paper published · paper retracted · twitter feud · podcast take · ',
    'subreddit thread · blog post · linkedin influencer · medium piece ',
    'tweet thread by · substack post · youtube video · tiktok claim · ',
  ];
  return (
    <div style={{ height: 200, overflow: 'hidden', border: `1px solid ${v2.rule}`, background: v2.bgAlt, padding: 12, opacity: 0.7 }}>
      {noise.map((row, i) => (
        <div key={i} style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>{row.repeat(3)}</div>
      ))}
    </div>
  );
};

const V2SignalGrid = () => {
  const sig = window.DiariaData.issues.slice(0, 4);
  return (
    <div style={{ border: `1px solid ${v2.signal}`, background: 'color-mix(in srgb, var(--brand-bright) 4%, transparent)', padding: 14, fontSize: 11 }}>
      {sig.map((s) => (
        <div key={s.n} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 12, padding: '6px 0', borderBottom: `1px solid ${v2.rule}`, color: v2.fg }}>
          <span style={{ color: v2.signal }}>#{s.n} · {s.mins}m</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</span>
        </div>
      ))}
      <div style={{ padding: '6px 0 0', color: v2.fgFaint }}>+ 2 sinais →</div>
    </div>
  );
};

const V2FeedRow = ({ issue, isLatest }) => (
  <article style={{ display: 'grid', gridTemplateColumns: '180px 90px 1fr 240px', gap: 32, padding: '28px 0', borderTop: `1px solid ${v2.rule}`, alignItems: 'start' }}>
    <div style={{ fontFamily: v2Mono, fontSize: 12 }}>
      <div style={{ color: isLatest ? v2.signal : v2.fgSoft }}>{issue.dateISO}</div>
      <div style={{ color: v2.fgFaint, marginTop: 4 }}>08:00 BRT</div>
      {isLatest && <div style={{ color: v2.signal, marginTop: 8 }}>● MAIS RECENTE</div>}
    </div>
    <div style={{ fontFamily: v2Mono, fontSize: 12, color: v2.fgFaint }}>
      <div>#{issue.n}</div>
      <div style={{ marginTop: 4 }}>{issue.mins} min</div>
    </div>
    <div>
      <h3 style={{ fontFamily: v2Sans, fontSize: 26, lineHeight: 1.15, letterSpacing: '-0.02em', fontWeight: 500, margin: 0, color: v2.fg }}>
        {issue.title}
      </h3>
      <p style={{ fontFamily: v2Sans, fontSize: 14, lineHeight: 1.5, color: v2.fgSoft, margin: '10px 0 0' }}>
        {issue.dek}
      </p>
      <div style={{ display: 'flex', gap: 12, marginTop: 14, fontFamily: v2Mono, fontSize: 11, color: v2.fgFaint }}>
        {['research', 'launch', 'policy'].slice(0, 2 + (issue.n % 2)).map((t) => (
          <span key={t} style={{ border: `1px solid ${v2.rule}`, padding: '2px 8px' }}>{t}</span>
        ))}
      </div>
    </div>
    <div style={{ aspectRatio: '16/10', background: v2.bgAlt, overflow: 'hidden', border: `1px solid ${v2.rule}` }}>
      <img src={issue.cover} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.15) contrast(1.05)' }} alt="" />
    </div>
  </article>
);

const V2Feed = ({ issues }) => (
  <section style={{ padding: '64px 48px', borderTop: `1px solid ${v2.rule}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
      <div style={{ fontFamily: v2Mono, fontSize: 12, color: v2.signal, letterSpacing: '0.1em' }}>
        ── FEED ──────────────────────────────────────
      </div>
      <div style={{ fontFamily: v2Mono, fontSize: 11, color: v2.fgFaint, display: 'flex', gap: 16 }}>
        <span style={{ color: v2.fg }}>todos</span><span>research</span><span>launch</span><span>policy</span><span>industry</span>
      </div>
    </div>
    <h2 style={{ fontFamily: v2Mono, fontSize: 36, fontWeight: 500, letterSpacing: '-0.025em', margin: '8px 0 32px', color: v2.fg }}>
      últimos sinais
    </h2>
    <div>
      {issues.map((iss, i) => <V2FeedRow key={iss.n} issue={iss} isLatest={i === 0} />)}
      <div style={{ borderTop: `1px solid ${v2.rule}`, padding: '24px 0', textAlign: 'center', fontFamily: v2Mono, fontSize: 12, color: v2.fgFaint }}>
        $ load_more ──────── 406 edições no arquivo
      </div>
    </div>
  </section>
);

const V2Specials = ({ specials }) => {
  const d = window.DiariaData;
  return (
    <section style={{ padding: '72px 48px', borderTop: `1px solid ${v2.rule}`, background: v2.bgAlt }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <div style={{ fontFamily: v2Mono, fontSize: 12, color: v2.signal, letterSpacing: '0.1em' }}>
          ── DOSSIÊS ───────────────────────────────────────────────────────────
        </div>
        <div style={{ fontFamily: v2Mono, fontSize: 11, color: v2.fgFaint }}>~/diaria/dossies</div>
      </div>
      <h2 style={{ fontFamily: v2Mono, fontSize: 40, fontWeight: 500, letterSpacing: '-0.025em', margin: '8px 0 8px', color: v2.fg }}>
        coleções <span style={{ color: v2.signal }}>vivas</span>
      </h2>
      <p style={{ fontFamily: v2Sans, fontSize: 15, lineHeight: 1.5, color: v2.fgSoft, margin: '0 0 36px', maxWidth: 640 }}>
        Curadoria contínua mantida pela redação. Dois acervos sempre atualizados, complementares ao briefing diário.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Livros dossier */}
        <div style={{ background: v2.bg, border: `1px solid ${v2.signal}`, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: `1px solid ${v2.rule}`, background: 'color-mix(in srgb, var(--brand-bright) 6%, transparent)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontFamily: v2Mono, fontSize: 12, color: v2.signal }}>
              <span>●</span><span>livros.md</span><span style={{ color: v2.fgFaint }}>[01]</span>
            </div>
            <div style={{ fontFamily: v2Mono, fontSize: 11, color: v2.fgFaint }}>OPEN · 42 entries</div>
          </div>
          <div style={{ padding: '28px 28px 24px' }}>
            <div style={{ fontFamily: v2Mono, fontSize: 11, color: v2.fgFaint, marginBottom: 12, letterSpacing: '0.1em' }}>LISTA ABERTA</div>
            <h3 style={{ fontFamily: v2Mono, fontSize: 36, fontWeight: 500, letterSpacing: '-0.025em', margin: 0, color: v2.fg }}>
              livros<br />sobre <span style={{ color: v2.signal }}>IA</span>
            </h3>
            <p style={{ fontFamily: v2Sans, fontSize: 14, lineHeight: 1.5, color: v2.fgSoft, margin: '14px 0 24px' }}>
              42 títulos curados. Iniciantes a especialistas, por nível e tema.
            </p>
            <div style={{ fontFamily: v2Mono, fontSize: 12, color: v2.fg, lineHeight: 1.7, background: v2.bgAlt, padding: '14px 18px', border: `1px solid ${v2.rule}` }}>
              {d.books.slice(0, 6).map((b, i) => (
                <div key={b.title} style={{ display: 'grid', gridTemplateColumns: '20px 1fr auto', gap: 8 }}>
                  <span style={{ color: v2.signal }}>{i === 5 ? '└─' : '├─'}</span>
                  <span style={{ color: v2.fg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span style={{ color: v2.fg }}>{b.title}</span>
                    <span style={{ color: v2.fgFaint }}> · {b.author}</span>
                  </span>
                  <span style={{ color: v2.fgFaint, fontSize: 10 }}>[{b.level}]</span>
                </div>
              ))}
              <div style={{ color: v2.fgFaint, paddingLeft: 28, marginTop: 4 }}>+ 36 outros títulos</div>
            </div>
            <a style={{ display: 'inline-block', marginTop: 24, fontFamily: v2Mono, fontSize: 13, color: v2.signal }}>
              $ open ./livros.md ▸
            </a>
          </div>
        </div>

        {/* Cursos dossier */}
        <div style={{ background: v2.bg, border: `1px solid ${v2.signal}`, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: `1px solid ${v2.rule}`, background: 'color-mix(in srgb, var(--brand-bright) 6%, transparent)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontFamily: v2Mono, fontSize: 12, color: v2.signal }}>
              <span>●</span><span>cursos.md</span><span style={{ color: v2.fgFaint }}>[02]</span>
            </div>
            <div style={{ fontFamily: v2Mono, fontSize: 11, color: v2.fgFaint }}>SUBSCRIBERS · 28 entries</div>
          </div>
          <div style={{ padding: '28px 28px 24px' }}>
            <div style={{ fontFamily: v2Mono, fontSize: 11, color: v2.fgFaint, marginBottom: 12, letterSpacing: '0.1em' }}>PARA ASSINANTES</div>
            <h3 style={{ fontFamily: v2Mono, fontSize: 36, fontWeight: 500, letterSpacing: '-0.025em', margin: 0, color: v2.fg }}>
              cursos<br /><span style={{ color: v2.signal }}>gratuitos</span>
            </h3>
            <p style={{ fontFamily: v2Sans, fontSize: 14, lineHeight: 1.5, color: v2.fgSoft, margin: '14px 0 24px' }}>
              28 cursos abertos, selecionados entre os melhores. Atualizado semanalmente.
            </p>
            <div style={{ background: v2.bgAlt, border: `1px solid ${v2.rule}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: '54px 1fr 70px 50px', gap: 8, padding: '10px 14px', borderBottom: `1px solid ${v2.rule}`, fontFamily: v2Mono, fontSize: 10, color: v2.fgFaint, letterSpacing: '0.1em' }}>
                <span>TAG</span><span>CURSO</span><span>NÍVEL</span><span>H</span>
              </div>
              {d.courses.slice(0, 6).map((c) => (
                <div key={c.title} style={{ display: 'grid', gridTemplateColumns: '54px 1fr 70px 50px', gap: 8, padding: '10px 14px', borderTop: `1px solid ${v2.rule}`, alignItems: 'center', fontFamily: v2Mono, fontSize: 12 }}>
                  <span style={{ color: v2.signal, fontWeight: 600 }}>{c.tag}</span>
                  <span style={{ color: v2.fg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</span>
                  <span style={{ color: v2.fgFaint, fontSize: 10 }}>{c.level}</span>
                  <span style={{ color: v2.fgSoft }}>{c.hours}h</span>
                </div>
              ))}
            </div>
            <a style={{ display: 'inline-block', marginTop: 24, fontFamily: v2Mono, fontSize: 13, color: v2.signal }}>
              $ open ./cursos.md ▸
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const V2Faqs = ({ faqs }) => (
  <section style={{ padding: '64px 48px', borderTop: `1px solid ${v2.rule}` }}>
    <div style={{ fontFamily: v2Mono, fontSize: 12, color: v2.signal, letterSpacing: '0.1em', marginBottom: 8 }}>
      ── README ────────────────────────────────────
    </div>
    <h2 style={{ fontFamily: v2Mono, fontSize: 36, fontWeight: 500, letterSpacing: '-0.025em', margin: '8px 0 32px', color: v2.fg }}>
      perguntas frequentes
    </h2>
    <div>
      {faqs.map((f, i) => (
        <div key={i} style={{ padding: '20px 0', borderTop: `1px solid ${v2.rule}`, display: 'grid', gridTemplateColumns: '60px 1fr', gap: 24 }}>
          <div style={{ fontFamily: v2Mono, fontSize: 12, color: v2.signal }}>Q.0{i + 1}</div>
          <div>
            <h3 style={{ fontFamily: v2Mono, fontSize: 16, fontWeight: 500, margin: 0, color: v2.fg }}>
              {'>'} {f.q.toLowerCase()}
            </h3>
            <p style={{ fontFamily: v2Sans, fontSize: 14, lineHeight: 1.55, color: v2.fgSoft, margin: '10px 0 0' }}>{f.a}</p>
          </div>
        </div>
      ))}
      <div style={{ borderTop: `1px solid ${v2.rule}` }} />
    </div>
  </section>
);

const V2Footer = () => (
  <section style={{ padding: '64px 48px 32px', borderTop: `1px solid ${v2.signal}` }}>
    <div style={{ fontFamily: v2Mono, fontSize: 14, color: v2.signal, marginBottom: 24 }}>
      $ subscribe --daily --format=brief
    </div>
    <div style={{ fontFamily: v2Mono, fontSize: 64, lineHeight: 1, fontWeight: 500, color: v2.fg, letterSpacing: '-0.03em' }}>
      junte-se a 12.4k<br />
      <span style={{ color: v2.signal }}>operadores</span> de IA.
    </div>
    <div style={{ display: 'flex', marginTop: 32, maxWidth: 560, gap: 0 }}>
      <input defaultValue="seu@email.com" style={{ flex: 1, border: `1px solid ${v2.rule}`, background: v2.bgAlt, padding: '14px 16px', fontFamily: v2Mono, fontSize: 14, color: v2.fg, outline: 'none' }} />
      <button style={{ background: v2.signal, color: v2.bg, border: 'none', padding: '14px 24px', fontFamily: v2Mono, fontSize: 13, fontWeight: 600 }}>execute ▸</button>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 80, fontFamily: v2Mono, fontSize: 11, color: v2.fgFaint, paddingTop: 24, borderTop: `1px solid ${v2.rule}` }}>
      <span>© 2026 diar.ia · build 412</span>
      <span>privacy · terms · report</span>
      <span><span style={{ color: v2.signal }}>●</span> uptime 99.98%</span>
    </div>
  </section>
);

const V2Landing = () => {
  const d = window.DiariaData;
  return (
    <div style={{ background: v2.bg, color: v2.fg, fontFamily: v2Sans, minHeight: '100%' }}>
      <V2Nav />
      <V2StatusBar />
      <V2Hero />
      <V2Specials specials={d.specials} />
      <V2Feed issues={d.issues} />
      <V2Faqs faqs={d.faqs} />
      <V2Footer />
    </div>
  );
};

window.V2Landing = V2Landing;
